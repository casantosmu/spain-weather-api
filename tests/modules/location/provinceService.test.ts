import {
  provinceCodeRange,
  provincesLength,
} from "../../../src/modules/location/constants";
import {
  InvalidNumberOfProvincesError,
  InvalidProvinceCodeError,
} from "../../../src/modules/location/error";
import {
  checkProvinceCode,
  checkProvincesLength,
} from "../../../src/modules/location/provinceService";
import { NewProvincesBuilder } from "./locationFactory";

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

describe("checkProvinceCode", () => {
  test("Given a valid province code, it does not throw an error", () => {
    const province = new NewProvincesBuilder()
      .withCode("20")
      .withName("Name")
      .build();

    const result = () => {
      checkProvinceCode(province);
    };

    expect(result).not.toThrow();
  });

  test("Given an invalid province code that is too low, it throws an InvalidProvinceCodeError", () => {
    const province = new NewProvincesBuilder()
      .withCode(`${provinceCodeRange.min - 1}`)
      .withName("Name")
      .build();

    const result = () => {
      checkProvinceCode(province);
    };

    expect(result).toThrow(InvalidProvinceCodeError);
  });

  test("Given an invalid province code that is too high, it throws an InvalidProvinceCodeError", () => {
    const province = new NewProvincesBuilder()
      .withCode(`${provinceCodeRange.max + 1}`)
      .withName("Name")
      .build();

    const result = () => {
      checkProvinceCode(province);
    };

    expect(result).toThrow(InvalidProvinceCodeError);
  });

  test("Given an invalid province code that is not a number, it throws an InvalidProvinceCodeError", () => {
    const province = new NewProvincesBuilder()
      .withCode("invalid code")
      .withName("Name")
      .build();

    const result = () => {
      checkProvinceCode(province);
    };

    expect(result).toThrow(InvalidProvinceCodeError);
  });
});
