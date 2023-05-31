import { InvalidMunicipalityCodeError } from "../../../src/modules/location/error";
import { checkMunicipalityCode } from "../../../src/modules/location/municipalityService";
import {
  NewMunicipalitiesBuilder,
  NewProvinceBuilder,
} from "./locationFactory";

describe("checkMunicipalityCode", () => {
  test("Given a valid municipality code, it does not throw an error", () => {
    const municipality = new NewMunicipalitiesBuilder()
      .withCode("20211")
      .withName("Name")
      .withProvince(
        new NewProvinceBuilder().withCode("20").withName("Province").build()
      )
      .build();

    const result = () => {
      checkMunicipalityCode(municipality);
    };

    expect(result).not.toThrow();
  });

  test("Given an invalid municipality code with invalid province code, it throws an InvalidMunicipalityCodeError", () => {
    const municipality = new NewMunicipalitiesBuilder()
      .withCode("10001")
      .withName("Name")
      .withProvince(
        new NewProvinceBuilder().withCode("00").withName("Province").build()
      )
      .build();

    const result = () => {
      checkMunicipalityCode(municipality);
    };

    expect(result).toThrow(InvalidMunicipalityCodeError);
  });

  test("Given an invalid municipality code with invalid length, it throws an InvalidMunicipalityCodeError", () => {
    const municipality = new NewMunicipalitiesBuilder()
      .withCode("202110")
      .withName("Name")
      .withProvince(
        new NewProvinceBuilder().withCode("20").withName("Province").build()
      )
      .build();

    const result = () => {
      checkMunicipalityCode(municipality);
    };

    expect(result).toThrow(InvalidMunicipalityCodeError);
  });
});
