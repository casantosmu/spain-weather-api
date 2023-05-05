import {
  createMunicipalitiesRepository,
  createProvincesRepository,
  getNewMunicipalitiesRepository,
  getNewProvincesRepository,
  hasLocationRepository,
} from "../../../src/modules/location/locationRepository";
import { seedLocationsService } from "../../../src/modules/location/locationService";
import { randomUUID } from "crypto";
import {
  NewMunicipalitiesRepositoryBuilder,
  NewProvincesRepositoryBuilder,
} from "./locationFactory";

jest.mock("../../../src/modules/location/locationRepository");
const mockedGetNewProvincesRepository = jest.mocked(getNewProvincesRepository);
const mockedGetNewMunicipalitiesRepository = jest.mocked(
  getNewMunicipalitiesRepository
);
const mockHasLocationRepository = jest.mocked(hasLocationRepository);

jest.mock("../../../src/modules/location/provinceService");

jest.mock("crypto");
const mockedRandomUuid = jest.mocked(randomUUID);

describe("seedLocationsService", () => {
  describe("when called", () => {
    describe("and repository has locations", () => {
      test("should not call any other repository", async () => {
        mockHasLocationRepository.mockResolvedValueOnce(true);
        await seedLocationsService();

        expect(mockedGetNewProvincesRepository).not.toHaveBeenCalled();
        expect(mockedGetNewMunicipalitiesRepository).not.toHaveBeenCalled();
      });
    });

    describe("and repository returns 2 municipalities and their provinces", () => {
      test("should call createMunicipalitiesRepository with the 2 municipalities with an id and their province", async () => {
        const province1 = new NewProvincesRepositoryBuilder()
          .withCode("AB")
          .withName("Alberta")
          .withLatLng([51.0486, -114.0708])
          .withCapital(
            new NewMunicipalitiesRepositoryBuilder()
              .withCode("CAL01")
              .withName("Calgary Municipality")
              .build()
          )
          .build();
        const province2 = new NewProvincesRepositoryBuilder()
          .withCode("ON")
          .withName("Ontario")
          .withLatLng([43.6532, -79.3832])
          .withCapital(
            new NewMunicipalitiesRepositoryBuilder()
              .withCode("TOR01")
              .withName("Toronto Municipality")
              .build()
          )
          .build();
        const municipality1 = new NewMunicipalitiesRepositoryBuilder()
          .withCode("CAL01")
          .withName("Calgary Municipality")
          .withLatLng([51.0447, -114.0719])
          .withProvince(province1)
          .build();
        const municipality2 = new NewMunicipalitiesRepositoryBuilder()
          .withCode("TOR01")
          .withName("Toronto Municipality")
          .withLatLng([43.6532, -79.3832])
          .withProvince(province2)
          .build();
        const provinces = [province1, province2];
        const municipalities = [municipality1, municipality2];
        mockedGetNewProvincesRepository.mockResolvedValueOnce(provinces);
        mockedGetNewMunicipalitiesRepository.mockResolvedValue(municipalities);
        const ids = ["id1", "id2", "id3", "id3"];
        ids.forEach((id) => {
          mockedRandomUuid.mockReturnValueOnce(id as never);
        });

        await seedLocationsService();

        expect(createMunicipalitiesRepository).toHaveBeenCalledTimes(1);
        expect(createMunicipalitiesRepository).toHaveBeenCalledWith([
          {
            ...municipality1,
            id: ids[2],
            province: {
              ...municipality1.province,
              id: ids[0],
            },
          },
          {
            ...municipality2,
            id: ids[3],
            province: {
              ...municipality2.province,
              id: ids[1],
            },
          },
        ]);
      });
    });

    describe("and repository returns 2 provinces and their capitals", () => {
      test("should call createProvincesRepository with the 2 provinces with its capital", async () => {
        const province1 = new NewProvincesRepositoryBuilder()
          .withCode("AB")
          .withName("Alberta")
          .withLatLng([51.0486, -114.0708])
          .withCapital(
            new NewMunicipalitiesRepositoryBuilder()
              .withCode("CAL01")
              .withName("Calgary Municipality")
              .build()
          )
          .build();
        const province2 = new NewProvincesRepositoryBuilder()
          .withCode("ON")
          .withName("Ontario")
          .withLatLng([43.6532, -79.3832])
          .withCapital(
            new NewMunicipalitiesRepositoryBuilder()
              .withCode("TOR01")
              .withName("Toronto Municipality")
              .build()
          )
          .build();
        const municipality1 = new NewMunicipalitiesRepositoryBuilder()
          .withCode("CAL01")
          .withName("Calgary Municipality")
          .withLatLng([51.0447, -114.0719])
          .withProvince(province1)
          .build();
        const municipality2 = new NewMunicipalitiesRepositoryBuilder()
          .withCode("TOR01")
          .withName("Toronto Municipality")
          .withLatLng([43.6532, -79.3832])
          .withProvince(province2)
          .build();
        const provinces = [province1, province2];
        const municipalities = [municipality1, municipality2];
        mockedGetNewProvincesRepository.mockResolvedValueOnce(provinces);
        mockedGetNewMunicipalitiesRepository.mockResolvedValue(municipalities);
        const ids = ["id1", "id2", "id3", "id3"];
        ids.forEach((id) => {
          mockedRandomUuid.mockReturnValueOnce(id as never);
        });

        await seedLocationsService();

        expect(createProvincesRepository).toHaveBeenCalledTimes(1);
        expect(createProvincesRepository).toHaveBeenCalledWith([
          {
            ...province1,
            id: ids[0],
            capital: {
              ...province1.capital,
              id: ids[2],
            },
          },
          {
            ...province2,
            id: ids[1],
            capital: {
              ...province2.capital,
              id: ids[3],
            },
          },
        ]);
      });
    });
  });
});
