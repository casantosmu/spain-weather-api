/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AxiosInstance } from "axios";
import { AutonomousCityBuilder } from "./locationFactory";
import { faker } from "@faker-js/faker";
import { createAutonomousCityRepository } from "../../../src/modules/location/locationRepository";
import {
  afterAllIntegrationTests,
  beforeAllIntegrationTests,
} from "../../testUtils";

let request: AxiosInstance;

beforeAll(async () => {
  const { httpClient } = await beforeAllIntegrationTests();
  request = httpClient;
});

describe("getLocations", () => {
  describe("when is paginated and filtered", () => {
    test("should return the list of matching locations paginated", async () => {
      const name = faker.datatype.uuid();
      const autonomousCity = new AutonomousCityBuilder()
        .withRandomId()
        .withRandomCode()
        .withRandomLatLng()
        .withName(name)
        .withRandomYear()
        .build();
      const autonomousCity2 = new AutonomousCityBuilder()
        .withRandomId()
        .withRandomCode()
        .withRandomLatLng()
        .withName(name)
        .withRandomYear()
        .build();
      await createAutonomousCityRepository([autonomousCity, autonomousCity2]);
      const { year, ...expectAutonomousCity } = autonomousCity2;
      const limit = 1;
      const skip = 1;

      const { status, data } = await request.get("/locations", {
        params: {
          name,
          limit,
          skip,
        },
      });

      expect(status).toBe(200);
      expect(data).toStrictEqual({
        metadata: {
          limit,
          skip,
        },
        data: [expectAutonomousCity],
      });
    });
  });

  describe("when defaults", () => {
    it("should return a list of 25 locations", async () => {
      const autonomousCity = new AutonomousCityBuilder()
        .withRandomId()
        .withRandomCode()
        .withRandomLatLng()
        .withRandomName()
        .withRandomYear()
        .build();
      await createAutonomousCityRepository([autonomousCity]);

      const { status, data } = await request.get("/locations");

      expect(status).toBe(200);
      expect(data.data.length).toBeLessThanOrEqual(1);
      expect(data.data.length).toBeLessThanOrEqual(25);
      expect(data).toStrictEqual({
        metadata: {
          limit: 25,
          skip: 0,
        },
        data: expect.any(Array),
      });
    });
  });

  describe("when bad request", () => {
    it("should return 400 error", async () => {
      const { status, data } = await request.get("/locations", {
        params: {
          foo: "bar",
        },
      });

      expect(status).toBe(400);
      expect(data).toStrictEqual({
        error: {
          name: expect.any(String),
          message: expect.any(String),
        },
      });
    });
  });
});

afterAll(afterAllIntegrationTests);
