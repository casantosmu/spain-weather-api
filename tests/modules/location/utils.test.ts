import { getProvinceCodeFromMunicipalityCode } from "../../../src/modules/location/utils";

describe("getProvinceCodeFromMunicipalityCode", () => {
  test("Given a valid municipality code, it returns the correct province code", () => {
    const municipalityCode = "01000";
    const expectedProvinceCode = "01";

    const provinceCode = getProvinceCodeFromMunicipalityCode(municipalityCode);

    expect(provinceCode).toBe(expectedProvinceCode);
  });
});
