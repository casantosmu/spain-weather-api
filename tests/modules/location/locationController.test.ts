/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AxiosInstance } from "axios";
import {
  LocationAutonomousCityBuilder,
  LocationMunicipalityBuilder,
  LocationProvinceBuilder,
} from "./locationFactory";
import { IpLocationModelBuilder } from "./ipLocationFactory";
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
import { IpLocationModel } from "../../../src/modules/location/ipLocationModel";

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
  describe("when filtered by latLng and a entity", () => {
    test("should return a location with the same entity type within the specified latLng coordinates", async () => {
      const latLng = [
        faker.location.latitude(),
        faker.location.longitude(),
      ] as const;
      const locationProvince = new LocationProvinceBuilder()
        .withRandomValues()
        .withLatLng(latLng)
        .build();
      const locationMunicipality = new LocationMunicipalityBuilder()
        .withRandomValues()
        .withLatLng(latLng)
        .build();
      await createLocationsRepository([locationProvince, locationMunicipality]);
      const { year, ...expectedLocation } = locationProvince;

      const { status, data } = await request.get("/locations/reverse", {
        params: {
          filter: latLng.join(","),
          entity: expectedLocation.entity,
        },
      });

      expect(status).toBe(200);
      expect(data).toStrictEqual(expectedLocation);
    });
  });

  describe("when filtered by IP v4 address", () => {
    test("should return a location within the latLng of IP v4 address", async () => {
      const latLng = [
        faker.location.latitude(),
        faker.location.longitude(),
      ] as const;
      const ipv4 = faker.internet.ipv4();
      const location = new LocationProvinceBuilder()
        .withRandomValues()
        .withLatLng(latLng)
        .build();
      const ipLocation = new IpLocationModelBuilder()
        .withIpv4(ipv4)
        .withLatLng(latLng)
        .build();
      await createLocationRepository(location);
      await IpLocationModel.create(ipLocation);
      const { year, ...expectedLocation } = location;

      const { status, data } = await request.get("/locations/reverse", {
        params: {
          filter: ipv4,
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
