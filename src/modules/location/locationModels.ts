/* eslint-disable @typescript-eslint/naming-convention */
import mongoose from "mongoose";
import { entity } from "./constants";
import { pointSchema } from "../../db";

const locationSchema = new mongoose.Schema(
  {
    _id: "UUID",
    name: { type: String, required: true, index: 1 },
    code: { type: String, required: true, unique: true },
    geo2dPoint: {
      type: pointSchema,
      required: true,
      index: "2dsphere",
    },
    year: { type: Number, required: true },
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

// Polymorphic model data using discriminator key "entity".

const provinceLocationSchema = new mongoose.Schema({
  provinceId: {
    type: mongoose.Schema.Types.UUID,
    required: true,
    unique: true,
  },
  capital: {
    municipalityId: {
      type: mongoose.Schema.Types.UUID,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
});
export const ProvinceModel = LocationModel.discriminator(
  entity.province,
  provinceLocationSchema
);

const municipalityLocationSchema = new mongoose.Schema({
  municipalityId: {
    type: mongoose.Schema.Types.UUID,
    required: true,
    unique: true,
  },
  province: {
    provinceId: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
});
export const MunicipalityModel = LocationModel.discriminator(
  entity.municipality,
  municipalityLocationSchema
);

const autonomousCityLocationSchema = new mongoose.Schema({
  autonomousCityId: {
    type: mongoose.Schema.Types.UUID,
    required: true,
    unique: true,
  },
});
export const AutonomousCityModel = LocationModel.discriminator(
  entity.autonomousCity,
  autonomousCityLocationSchema
);
