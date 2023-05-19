import { BadRequestError } from "../src/error";
import { checkCollectionParams, defaultCollection } from "../src/operations";

describe("checkCollectionParams", () => {
  describe("when default options", () => {
    describe("and params are within default values", () => {
      it("should not throw an error", () => {
        const params = {
          limit: defaultCollection.limit.default,
          skip: defaultCollection.skip.default,
        };

        const result = () => {
          checkCollectionParams(params);
        };

        expect(result).not.toThrow();
      });
    });

    describe("and limit exceed max", () => {
      it("should throw a BadRequestError", () => {
        const invalidParams = {
          limit: defaultCollection.limit.max + 5,
          skip: defaultCollection.skip.default,
        };

        const result = () => {
          checkCollectionParams(invalidParams);
        };

        expect(result).toThrow(BadRequestError);
      });
    });

    describe("and skip is less than min", () => {
      it("should throw a BadRequestError", () => {
        const invalidParams = {
          limit: defaultCollection.limit.default,
          skip: defaultCollection.skip.min - 1,
        };

        const result = () => {
          checkCollectionParams(invalidParams);
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
      it("should not throw an error", () => {
        const params = {
          limit: customOptions.limit.default,
          skip: customOptions.skip.default,
        };

        const result = () => {
          checkCollectionParams(params, customOptions);
        };

        expect(result).not.toThrow();
      });
    });

    describe("and limit exceed max", () => {
      it("should throw a BadRequestError", () => {
        const invalidParams = {
          limit: customOptions.limit.max + 5,
          skip: customOptions.skip.default,
        };

        const result = () => {
          checkCollectionParams(invalidParams, customOptions);
        };

        expect(result).toThrow(BadRequestError);
      });
    });

    describe("and skip is less than min", () => {
      it("should throw a BadRequestError", () => {
        const invalidParams = {
          limit: customOptions.limit.default,
          skip: customOptions.skip.min - 1,
        };

        const result = () => {
          checkCollectionParams(invalidParams, customOptions);
        };

        expect(result).toThrow(BadRequestError);
      });
    });
  });
});
