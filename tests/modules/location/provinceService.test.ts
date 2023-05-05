import { provincesLength } from "../../../src/modules/location/constants";
import { InvalidNumberOfProvincesError } from "../../../src/modules/location/error";
import { checkProvincesLength } from "../../../src/modules/location/provinceService";

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
