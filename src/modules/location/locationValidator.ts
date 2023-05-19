import { type JSONSchemaType } from "ajv";
import { type GetLocationsQuery } from "./types";
import { validator } from "../../validator";

const getLocationsQuerySchema: JSONSchemaType<GetLocationsQuery> = {
  type: "object",
  properties: {
    limit: {
      type: "integer",
      nullable: true,
    },
    skip: {
      type: "integer",
      nullable: true,
    },
    name: {
      type: "string",
      nullable: true,
    },
  },
  additionalProperties: false,
};

export const getLocationsQueryValidator = validator.compile(
  getLocationsQuerySchema
);
