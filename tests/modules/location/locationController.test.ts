/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AxiosInstance } from "axios";
import {
  LocationAutonomousCityBuilder,
  LocationMunicipalityBuilder,
  LocationProvinceBuilder,
} from "./locationFactory";
import { faker } from "@faker-js/faker";
import {
  afterAllIntegrationTests,
  beforeAllIntegrationTests,
} from "../../testUtils";
import { defaultList } from "../../../src/operations";
import {
  createLocationRepository,
  createLocationsRepository,
} from "../../../src/modules/location/locationRepository";

let request: AxiosInstance;

beforeAll(async () => {
  const { httpClient } = await beforeAllIntegrationTests();
  request = httpClient;
});

describe("GET /locations", () => {
  describe("when paginated and filtered by name", () => {
    test("should return a list of locations with matching names, paginated and ordered by name", async () => {
      const filterBy = faker.string.uuid();
      const autonomousCity = new LocationAutonomousCityBuilder()
        .withRandomValues()
        .withName("A" + filterBy)
        .build();
      const municipality = new LocationMunicipalityBuilder()
        .withRandomValues()
        .withName("C" + filterBy)
        .build();
      const province = new LocationProvinceBuilder()
        .withRandomValues()
        .withCode(filterBy)
        .withName("B")
        .build();
      await createLocationsRepository([autonomousCity, municipality, province]);
      const { year: year1, ...expectedFirstLocation } = province;
      const { year: year2, ...expectedSecondLocation } = municipality;
      const limit = 2;
      const skip = 1;
      const queryLength = 3;

      const { status, data } = await request.get("/locations", {
        params: {
          filter: filterBy,
          limit,
          skip,
        },
      });

      expect(status).toBe(200);
      expect(data).toStrictEqual({
        metadata: {
          limit,
          skip,
          total: queryLength,
        },
        data: [expectedFirstLocation, expectedSecondLocation],
      });
    });
  });

  describe("when no filters are applied", () => {
    test("should return a list of 25 locations by default", async () => {
      const autonomousCities = Array.from(
        { length: defaultList.limit.default + 5 },
        () => new LocationAutonomousCityBuilder().withRandomValues().build()
      );
      await createLocationsRepository(autonomousCities);

      const { status, data } = await request.get("/locations");

      expect(status).toBe(200);
      expect(data.data).toHaveLength(defaultList.limit.default);
      expect(data).toStrictEqual({
        metadata: {
          limit: defaultList.limit.default,
          skip: defaultList.skip.default,
          total: expect.any(Number),
        },
        data: expect.any(Array),
      });
    });
  });

  describe("when bad request parameters are used", () => {
    test("should return a 400 error", async () => {
      const { status } = await request.get("/locations", {
        params: {
          foo: "bar",
        },
      });

      expect(status).toBe(400);
    });
  });
});

describe("GET /locations/reverse", () => {
  describe("when filtered by latLng and entity", () => {
    test("should return a location within coordinates", async () => {
      const location = new LocationAutonomousCityBuilder()
        .withRandomValues()
        .build();
      await createLocationRepository(location);
      const { year, ...expectedLocation } = location;

      const { status, data } = await request.get("/locations/reverse", {
        params: {
          filter: location.latLng.join(","),
          entity: location.entity,
        },
      });

      expect(status).toBe(200);
      expect(data).toStrictEqual(expectedLocation);
    });
  });

  describe("when bad request parameters are used", () => {
    test("should return a 400 error", async () => {
      const { status } = await request.get("/locations/reverse", {
        params: {
          foo: "bar",
        },
      });

      expect(status).toBe(400);
    });
  });
});

afterAll(afterAllIntegrationTests);
