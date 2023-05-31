import { validator } from "../../validator";

const getLocationsQuerySchema = {
  type: "object",
  properties: {
    limit: {
      type: "integer",
    },
    skip: {
      type: "integer",
    },
    name: {
      type: "string",
    },
  },
  required: [],
  additionalProperties: false,
};

export const getLocationsQueryValidator = validator.compile(
  getLocationsQuerySchema
);
