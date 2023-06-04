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
    filter: {
      type: "string",
    },
  },
  required: [],
  additionalProperties: false,
};

export const getLocationsQueryValidator = validator.compile(
  getLocationsQuerySchema
);

const getReverseLocationQuerySchema = {
  type: "object",
  properties: {
    filter: {
      type: "string",
    },
    entity: {
      type: "string",
    },
  },
  required: ["filter"],
  additionalProperties: false,
};

export const getReverseLocationQueryValidator = validator.compile(
  getReverseLocationQuerySchema
);
