import { provincesLength } from "../../../src/modules/location/constants";
import { InvalidNumberOfProvincesError } from "../../../src/modules/location/error";
import {
  checkProvincesLength,
  isValidProvinceCode,
} from "../../../src/modules/location/provinceService";
import { NewProvincesRepositoryBuilder } from "./locationFactory";

describe("checkProvincesLength", () => {
  test("Given an array of provinces, when the length is incorrect, then it throws an InvalidNumberOfProvincesError", () => {
    const provinces = new Array(2);

    const checkProvinces = () => {
      checkProvincesLength(provinces);
    };

    expect(checkProvinces).toThrow(InvalidNumberOfProvincesError);
  });

  test("Given an array of provinces, when the length is correct, then it does not throw an error", () => {
    const provinces = new Array(provincesLength);

    const checkProvinces = () => {
      checkProvincesLength(provinces);
    };

    expect(checkProvinces).not.toThrow();
  });
});

describe("isValidProvinceCode", () => {
  test("Given a valid province code, it returns true", () => {
    const province = new NewProvincesRepositoryBuilder()
      .withCode("20")
      .withName("Name")
      .build();

    const result = isValidProvinceCode(province);

    expect(result).toBe(true);
  });

  test("Given an invalid province code that is too low, it returns false", () => {
    const province = new NewProvincesRepositoryBuilder()
      .withCode("0")
      .withName("Name")
      .build();

    const result = isValidProvinceCode(province);

    expect(result).toBe(false);
  });

  test("Given an invalid province code that is too high, it returns false", () => {
    const province = new NewProvincesRepositoryBuilder()
      .withCode("51")
      .withName("Name")
      .build();

    const result = isValidProvinceCode(province);

    expect(result).toBe(false);
  });
});
