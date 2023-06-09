import {
  createLocationsRepository,
  getLocationByLatLngRepository,
  hasLocationRepository,
} from "../../../src/modules/location/locationRepository";
import {
  getReverseLocationService,
  seedLocationsService,
} from "../../../src/modules/location/locationService";
import { randomUUID } from "crypto";
import {
  LocationAutonomousCityBuilder,
  NewAutonomousCityBuilder,
  NewMunicipalitiesBuilder,
  NewProvinceBuilder,
} from "./locationFactory";
import {
  InvalidEntityError,
  ProvinceNotFoundError,
} from "../../../src/modules/location/error";
import { MunicipalityNotFoundError } from "../../../src/modules/location/error";
import { entity } from "../../../src/modules/location/constants";
import {
  getNewAutonomousCitiesRepository,
  getNewMunicipalitiesRepository,
  getNewProvincesRepository,
} from "../../../src/modules/location/newLocationRepository";
import { stringValidator } from "../../../src/validator";
import { BadRequestError, NotFoundError } from "../../../src/error";
import { getLatLngFromIpv4Repository } from "../../../src/modules/location/ipLocationRepository";

jest.mock("../../../src/modules/location/newLocationRepository");
const mockGetNewProvincesRepository = jest.mocked(getNewProvincesRepository);
const mockGetNewMunicipalitiesRepository = jest.mocked(
  getNewMunicipalitiesRepository
);
const mockGetNewAutonomousCitiesRepository = jest.mocked(
  getNewAutonomousCitiesRepository
);

jest.mock("../../../src/modules/location/locationRepository");
const mockHasLocationRepository = jest.mocked(hasLocationRepository);
const mockGetLocationByLatLngRepository = jest.mocked(
  getLocationByLatLngRepository
);

jest.mock("../../../src/modules/location/ipLocationRepository");
const mockGetLatLngFromIpv4Repository = jest.mocked(
  getLatLngFromIpv4Repository
);

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

    describe("and repository returns 2 municipalities and 2 provinces", () => {
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
        const ids = ["id1", "id2", "id3", "id4", "id5", "id6", "id7", "id8"];
        ids.forEach((id) => {
          mockRandomUuid.mockReturnValueOnce(id as never);
        });

        await seedLocationsService();

        expect(createLocationsRepository).toHaveBeenCalledTimes(1);
        expect(createLocationsRepository).toHaveBeenCalledWith([
          {
            ...province1,
            id: ids[0],
            provinceId: ids[1],
            entity: entity.province,
            capital: {
              ...province1.capital,
              id: ids[5],
            },
          },
          {
            ...province2,
            id: ids[2],
            provinceId: ids[3],
            entity: entity.province,
            capital: {
              ...province2.capital,
              id: ids[7],
            },
          },
          {
            ...municipality1,
            id: ids[4],
            municipalityId: ids[5],
            entity: entity.municipality,
            province: {
              ...municipality1.province,
              id: ids[1],
            },
          },
          {
            ...municipality2,
            id: ids[6],
            municipalityId: ids[7],
            entity: entity.municipality,
            province: {
              ...municipality2.province,
              id: ids[3],
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
        const ids = ["id1", "id2", "id3", "id4"];
        ids.forEach((id) => {
          mockRandomUuid.mockReturnValueOnce(id as never);
        });

        await seedLocationsService();

        expect(createLocationsRepository).toHaveBeenCalledTimes(1);
        expect(createLocationsRepository).toHaveBeenCalledWith([
          {
            ...autonomousCity1,
            entity: entity.autonomousCity,
            id: ids[0],
            autonomousCityId: ids[1],
          },
          {
            ...autonomousCity2,
            entity: entity.autonomousCity,
            id: ids[2],
            autonomousCityId: ids[3],
          },
        ]);
      });
    });
  });
});

describe("getReverseLocationService", () => {
  describe("when called", () => {
    test("should return the location returned by getLocationByLatLngRepository", async () => {
      const location = new LocationAutonomousCityBuilder().build();
      const params = {
        filter: "0,0",
        entity: entity.autonomousCity,
      };
      jest.spyOn(stringValidator, "isLatLng").mockReturnValueOnce(true);
      jest.spyOn(stringValidator, "isIp").mockReturnValueOnce(false);
      mockGetLocationByLatLngRepository.mockResolvedValueOnce(location);

      const result = await getReverseLocationService(params);

      expect(result).toStrictEqual(location);
    });
  });

  describe("when receives a valid entity", () => {
    test("should call getLocationByLatLngRepository with the entity", async () => {
      const params = {
        filter: "0,0",
        entity: entity.autonomousCity,
      };
      jest.spyOn(stringValidator, "isLatLng").mockReturnValueOnce(true);
      jest.spyOn(stringValidator, "isIp").mockReturnValueOnce(false);

      await getReverseLocationService(params);

      expect(mockGetLocationByLatLngRepository.mock.calls[0]?.[0].entity).toBe(
        params.entity
      );
    });
  });

  describe("when receives a list of valid entities", () => {
    test("should call getLocationByLatLngRepository with an array of unique entities", async () => {
      const entities = [
        entity.autonomousCity,
        entity.autonomousCity,
        entity.municipality,
      ];
      const params = {
        filter: "0,0",
        entity: entities.join(", "),
      };
      jest.spyOn(stringValidator, "isLatLng").mockReturnValueOnce(true);
      jest.spyOn(stringValidator, "isIp").mockReturnValueOnce(false);

      await getReverseLocationService(params);

      expect(
        mockGetLocationByLatLngRepository.mock.calls[0]?.[0].entity
      ).toStrictEqual(entities.slice(1));
    });
  });

  describe("when receives a latLng filter", () => {
    test("should call getLocationByLatLngRepository with correct latLng", async () => {
      const latLng = [40.7128, -74.006];
      const params = {
        filter: latLng.join(", "),
        entity: entity.autonomousCity,
      };
      jest.spyOn(stringValidator, "isLatLng").mockReturnValueOnce(true);
      jest.spyOn(stringValidator, "isIp").mockReturnValueOnce(false);

      await getReverseLocationService(params);

      expect(
        mockGetLocationByLatLngRepository.mock.calls[0]?.[0].latLng
      ).toStrictEqual(latLng);
    });
  });

  describe("when receives a IP v4 filter", () => {
    test("should call getLocationByLatLngRepository with latLng returned by getLatLngFromIpRepository", async () => {
      const latLng = [40.7128, -74.006] as const;
      const params = {
        filter: "35.35.45",
        entity: entity.autonomousCity,
      };
      jest.spyOn(stringValidator, "isLatLng").mockReturnValueOnce(false);
      jest.spyOn(stringValidator, "isIp").mockReturnValueOnce(true);
      mockGetLatLngFromIpv4Repository.mockResolvedValueOnce(latLng);

      await getReverseLocationService(params);

      expect(
        mockGetLocationByLatLngRepository.mock.calls[0]?.[0].latLng
      ).toStrictEqual(latLng);
    });
  });

  describe("when receives a not found IP filter", () => {
    test("should throw a Not Found Error", async () => {
      const params = {
        filter: "35.35.45",
        entity: entity.autonomousCity,
      };
      jest.spyOn(stringValidator, "isLatLng").mockReturnValueOnce(false);
      jest.spyOn(stringValidator, "isIp").mockReturnValueOnce(true);
      mockGetLatLngFromIpv4Repository.mockResolvedValueOnce(undefined);

      const result = async () => getReverseLocationService(params);

      await expect(result).rejects.toThrow(NotFoundError);
    });
  });

  describe("when receives an invalid filter", () => {
    test("should throw a Bad Request Error", async () => {
      jest.spyOn(stringValidator, "isLatLng").mockReturnValueOnce(false);
      jest.spyOn(stringValidator, "isIp").mockReturnValueOnce(false);

      const result = async () => getReverseLocationService({ filter: "" });

      await expect(result).rejects.toThrow(BadRequestError);
    });
  });

  describe("when receives an invalid entity", () => {
    test("should throw a InvalidEntityError", async () => {
      const params = {
        filter: "0,0",
        entity: `${entity.autonomousCity},invalid-entity`,
      };
      jest.spyOn(stringValidator, "isLatLng").mockReturnValueOnce(true);
      jest.spyOn(stringValidator, "isIp").mockReturnValueOnce(false);

      const result = async () => getReverseLocationService(params);

      await expect(result).rejects.toThrow(InvalidEntityError);
    });
  });
});
