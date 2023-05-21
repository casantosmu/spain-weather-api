/* eslint-disable @typescript-eslint/naming-convention */
import mongoose from "mongoose";
import { entity } from "./constants";

// GeoJSON point format:
// MongoDB documentation: https://www.mongodb.com/docs/manual/reference/geojson/
// Mongoose documentation: https://mongoosejs.com/docs/geojson.html
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const locationSchema = new mongoose.Schema(
  {
    _id: "UUID",
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true },
    geo2dPoint: {
      type: pointSchema,
      required: true,
      index: "2dsphere",
    },
    year: { type: Number, required: true },
    schemaVersion: { type: Number, required: true },
  },
  {
    discriminatorKey: "entity",
    timestamps: true,
  }
);
export const LocationModel = mongoose.model(
  "Location",
  locationSchema,
  "locations"
);

const locationRelationSchema = new mongoose.Schema({
  _id: "UUID",
  name: { type: String, required: true },
  code: { type: String, required: true },
});

// Polymorphic model data using discriminator key "entity".

const provinceSchema = new mongoose.Schema({
  capital: locationRelationSchema,
});
export const ProvinceModel = LocationModel.discriminator(
  entity.province,
  provinceSchema
);

const municipalitySchema = new mongoose.Schema({
  province: locationRelationSchema,
});
export const MunicipalityModel = LocationModel.discriminator(
  entity.municipality,
  municipalitySchema
);

const autonomousCitySchema = new mongoose.Schema();
export const AutonomousCityModel = LocationModel.discriminator(
  entity.autonomousCity,
  autonomousCitySchema
);
