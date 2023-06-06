import { BadRequestError } from "../src/error";
import { checkListParams, defaultList } from "../src/operations";

describe("checkListParams", () => {
  describe("when default options", () => {
    describe("and params are within default values", () => {
      test("should not throw an error", () => {
        const params = {
          limit: defaultList.limit.default,
          skip: defaultList.skip.default,
        };

        const result = () => {
          checkListParams(params);
        };

        expect(result).not.toThrow();
      });
    });

    describe("and limit exceed max", () => {
      test("should throw a BadRequestError", () => {
        const invalidParams = {
          limit: defaultList.limit.max + 5,
          skip: defaultList.skip.default,
        };

        const result = () => {
          checkListParams(invalidParams);
        };

        expect(result).toThrow(BadRequestError);
      });
    });

    describe("and skip is less than min", () => {
      test("should throw a BadRequestError", () => {
        const invalidParams = {
          limit: defaultList.limit.default,
          skip: defaultList.skip.min - 1,
        };

        const result = () => {
          checkListParams(invalidParams);
        };

        expect(result).toThrow(BadRequestError);
      });
    });
  });

  describe("when custom options are provided", () => {
    const customOptions = {
      limit: {
        default: 50,
        min: 10,
        max: 200,
      },
      skip: {
        default: 20,
        min: 0,
        max: 100,
      },
    } as const;

    describe("and params are within default values", () => {
      test("should not throw an error", () => {
        const params = {
          limit: customOptions.limit.default,
          skip: customOptions.skip.default,
        };

        const result = () => {
          checkListParams(params, customOptions);
        };

        expect(result).not.toThrow();
      });
    });

    describe("and limit exceed max", () => {
      test("should throw a BadRequestError", () => {
        const invalidParams = {
          limit: customOptions.limit.max + 5,
          skip: customOptions.skip.default,
        };

        const result = () => {
          checkListParams(invalidParams, customOptions);
        };

        expect(result).toThrow(BadRequestError);
      });
    });

    describe("and skip is less than min", () => {
      test("should throw a BadRequestError", () => {
        const invalidParams = {
          limit: customOptions.limit.default,
          skip: customOptions.skip.min - 1,
        };

        const result = () => {
          checkListParams(invalidParams, customOptions);
        };

        expect(result).toThrow(BadRequestError);
      });
    });
  });
});
