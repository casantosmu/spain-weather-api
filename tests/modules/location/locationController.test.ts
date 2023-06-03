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
import { defaultCollection } from "../../../src/operations";
import { createLocationsRepository } from "../../../src/modules/location/locationRepository";

let request: AxiosInstance;

beforeAll(async () => {
  const { httpClient } = await beforeAllIntegrationTests();
  request = httpClient;
});

describe("GET /locations", () => {
  describe("when paginated and filtered by name", () => {
    test("should return a collection of locations with matching names, paginated and ordered by name", async () => {
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
    it("should return a list of 25 locations by default", async () => {
      const autonomousCities = Array.from(
        { length: defaultCollection.limit.default + 5 },
        () => new LocationAutonomousCityBuilder().withRandomValues().build()
      );
      await createLocationsRepository(autonomousCities);

      const { status, data } = await request.get("/locations");

      expect(status).toBe(200);
      expect(data.data).toHaveLength(defaultCollection.limit.default);
      expect(data).toStrictEqual({
        metadata: {
          limit: defaultCollection.limit.default,
          skip: defaultCollection.skip.default,
          total: expect.any(Number),
        },
        data: expect.any(Array),
      });
    });
  });

  describe("when bad request parameters are used", () => {
    it("should return a 400 error", async () => {
      const { status } = await request.get("/locations", {
        params: {
          foo: "bar",
        },
      });

      expect(status).toBe(400);
    });
  });
});

afterAll(afterAllIntegrationTests);
