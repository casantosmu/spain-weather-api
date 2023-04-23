/* eslint-disable @typescript-eslint/naming-convention */
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    _id: "UUID",
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
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

const provinceSchema = new mongoose.Schema({
  capital: { type: String },
});
export const ProvinceModel = LocationModel.discriminator(
  "Province",
  provinceSchema
);
