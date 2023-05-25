import {
  createLocationsRepository,
  getNewAutonomousCitiesRepository,
  getNewMunicipalitiesRepository,
  getNewProvincesRepository,
  hasLocationRepository,
} from "../../../src/modules/location/locationRepository";
import { seedLocationsService } from "../../../src/modules/location/locationService";
import { randomUUID } from "crypto";
import {
  NewAutonomousCityBuilder,
  NewMunicipalitiesBuilder,
  NewProvinceBuilder,
} from "./locationFactory";
import { ProvinceNotFoundError } from "../../../src/modules/location/error";
import { MunicipalityNotFoundError } from "../../../src/modules/location/error";
import { entity } from "../../../src/modules/location/constants";

jest.mock("../../../src/modules/location/locationRepository");
const mockGetNewProvincesRepository = jest.mocked(getNewProvincesRepository);
const mockGetNewMunicipalitiesRepository = jest.mocked(
  getNewMunicipalitiesRepository
);
const mockGetNewAutonomousCitiesRepository = jest.mocked(
  getNewAutonomousCitiesRepository
);
const mockHasLocationRepository = jest.mocked(hasLocationRepository);

jest.mock("../../../src/modules/location/provinceService");
jest.mock("../../../src/modules/location/municipalityService");

jest.mock("crypto");
const mockRandomUuid = jest.mocked(randomUUID);

describe("seedLocationsService", () => {
  describe("when called", () => {
    describe("and repository has locations", () => {
      test("should not call any other repository", async () => {
        mockHasLocationRepository.mockResolvedValueOnce(true);

        await seedLocationsService();

        expect(mockGetNewProvincesRepository).not.toHaveBeenCalled();
        expect(mockGetNewMunicipalitiesRepository).not.toHaveBeenCalled();
      });
    });

    describe("and repository returns a municipality with not found province", () => {
      test("should throw error", async () => {
        const municipality = new NewMunicipalitiesBuilder()
          .withCode("TOR01º")
          .withName("Municipality1")
          .withProvince(
            new NewProvinceBuilder()
              .withCode("00")
              .withName("NOT FOUND")
              .build()
          )
          .build();
        mockGetNewProvincesRepository.mockResolvedValueOnce([]);
        mockGetNewAutonomousCitiesRepository.mockResolvedValueOnce([]);
        mockGetNewMunicipalitiesRepository.mockResolvedValueOnce([
          municipality,
        ]);

        const result = async () => {
          await seedLocationsService();
        };

        await expect(result).rejects.toThrow(ProvinceNotFoundError);
      });
    });

    describe("and repository returns a province with not found municipality", () => {
      test("should throw error", async () => {
        const province = new NewProvinceBuilder()
          .withCode("ON")
          .withName("Ontario")
          .withLatLng([43.6532, -79.3832])
          .withCapital(
            new NewMunicipalitiesBuilder()
              .withCode("00")
              .withName("NOT FOUND")
              .build()
          )
          .build();
        mockGetNewProvincesRepository.mockResolvedValueOnce([province]);
        mockGetNewMunicipalitiesRepository.mockResolvedValueOnce([]);
        mockGetNewAutonomousCitiesRepository.mockResolvedValueOnce([]);

        const result = async () => {
          await seedLocationsService();
        };

        await expect(result).rejects.toThrow(MunicipalityNotFoundError);
      });
    });

    describe("and repository returns 2 municipalities and their provinces", () => {
      test("should call createLocationsRepository with the 2 municipalities and 2 provinces with an id and their relations", async () => {
        const province1 = new NewProvinceBuilder()
          .withCode("AB")
          .withName("Alberta")
          .withLatLng([51.0486, -114.0708])
          .withCapital(
            new NewMunicipalitiesBuilder()
              .withCode("CAL01")
              .withName("Calgary Municipality")
              .build()
          )
          .build();
        const province2 = new NewProvinceBuilder()
          .withCode("ON")
          .withName("Ontario")
          .withLatLng([43.6532, -79.3832])
          .withCapital(
            new NewMunicipalitiesBuilder()
              .withCode("TOR01")
              .withName("Toronto Municipality")
              .build()
          )
          .build();
        const municipality1 = new NewMunicipalitiesBuilder()
          .withCode("CAL01")
          .withName("Calgary Municipality")
          .withLatLng([51.0447, -114.0719])
          .withProvince(province1)
          .build();
        const municipality2 = new NewMunicipalitiesBuilder()
          .withCode("TOR01")
          .withName("Toronto Municipality")
          .withLatLng([43.6532, -79.3832])
          .withProvince(province2)
          .build();
        mockGetNewProvincesRepository.mockResolvedValueOnce([
          province1,
          province2,
        ]);
        mockGetNewMunicipalitiesRepository.mockResolvedValueOnce([
          municipality1,
          municipality2,
        ]);
        mockGetNewAutonomousCitiesRepository.mockResolvedValueOnce([]);
        const ids = ["id1", "id2", "id3", "id3"];
        ids.forEach((id) => {
          mockRandomUuid.mockReturnValueOnce(id as never);
        });

        await seedLocationsService();

        expect(createLocationsRepository).toHaveBeenCalledTimes(1);
        expect(createLocationsRepository).toHaveBeenCalledWith([
          {
            ...province1,
            id: ids[0],
            entity: entity.province,
            capital: {
              ...province1.capital,
              id: ids[2],
            },
          },
          {
            ...province2,
            id: ids[1],
            entity: entity.province,
            capital: {
              ...province2.capital,
              id: ids[3],
            },
          },
          {
            ...municipality1,
            id: ids[2],
            entity: entity.municipality,
            province: {
              ...municipality1.province,
              id: ids[0],
            },
          },
          {
            ...municipality2,
            id: ids[3],
            entity: entity.municipality,
            province: {
              ...municipality2.province,
              id: ids[1],
            },
          },
        ]);
      });
    });

    describe("and repository returns 2 autonomous cities", () => {
      test("should call createLocationsRepository with the 2 autonomous cities with a uuid", async () => {
        const autonomousCity1 = new NewAutonomousCityBuilder()
          .withCode("ON")
          .withName("Ontario")
          .build();
        const autonomousCity2 = new NewAutonomousCityBuilder()
          .withCode("AB")
          .withName("Alberta")
          .build();
        mockGetNewProvincesRepository.mockResolvedValueOnce([]);
        mockGetNewMunicipalitiesRepository.mockResolvedValueOnce([]);
        mockGetNewAutonomousCitiesRepository.mockResolvedValueOnce([
          autonomousCity1,
          autonomousCity2,
        ]);
        const ids = ["id1", "id2"];
        mockRandomUuid
          .mockReturnValueOnce(ids[0] as never)
          .mockReturnValueOnce(ids[1] as never);

        await seedLocationsService();

        expect(createLocationsRepository).toHaveBeenCalledTimes(1);
        expect(createLocationsRepository).toHaveBeenCalledWith([
          { ...autonomousCity1, entity: entity.autonomousCity, id: ids[0] },
          { ...autonomousCity2, entity: entity.autonomousCity, id: ids[1] },
        ]);
      });
    });
  });
});
