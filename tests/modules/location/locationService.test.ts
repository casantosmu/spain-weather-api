import {
  getProvinces,
  createProvince,
} from "../../../src/modules/location/locationRepository";
import { createProvinces } from "../../../src/modules/location/locationService";
import { randomUUID } from "crypto";

jest.mock("../../../src/modules/location/locationRepository");
const mockedGetProvinces = jest.mocked(getProvinces);
const mockedCreateProvince = jest.mocked(createProvince);

jest.mock("crypto");
const mockedRandomUuid = jest.mocked(randomUUID);

describe("createProvinces", () => {
  describe("when called", () => {
    test("should call getProvinces and call createProvince for each province with the province and a random uuid", async () => {
      const provinces = [
        { name: "Albacete", latLng: [1, 2] as const },
        { name: "Alicante", latLng: [2, 1] as const },
      ];
      const ids = ["id1", "id2"];
      mockedGetProvinces.mockResolvedValueOnce(provinces);
      mockedRandomUuid
        .mockReturnValueOnce(ids[0] as never)
        .mockReturnValueOnce(ids[1] as never);

      await createProvinces();

      expect(mockedCreateProvince).toHaveBeenNthCalledWith(1, {
        id: ids[0],
        ...provinces[0],
      });
      expect(mockedCreateProvince).toHaveBeenNthCalledWith(2, {
        id: ids[1],
        ...provinces[1],
      });
    });
  });
});
