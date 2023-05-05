import { isValidMunicipalityCode } from "../../../src/modules/location/municipalityService";
import {
  NewMunicipalitiesRepositoryBuilder,
  NewProvincesRepositoryBuilder,
} from "./locationFactory";

describe("isValidMunicipalityCode", () => {
  test("returns true for a valid municipality code", () => {
    const province = new NewProvincesRepositoryBuilder()
      .withCode("ON")
      .withName("Province")
      .build();
    const municipality = new NewMunicipalitiesRepositoryBuilder()
      .withCode("ON010")
      .withName("Municipality")
      .withProvince(province)
      .build();

    const result = isValidMunicipalityCode(municipality);

    expect(result).toBe(true);
  });

  test("returns false for an invalid municipality code", () => {
    const province = new NewProvincesRepositoryBuilder()
      .withCode("ON")
      .withName("Ontario")
      .build();
    const municipality = new NewMunicipalitiesRepositoryBuilder()
      .withCode("ON00")
      .withName("Municipality")
      .withProvince(province)
      .build();

    const result = isValidMunicipalityCode(municipality);

    expect(result).toBe(false);
  });
});
