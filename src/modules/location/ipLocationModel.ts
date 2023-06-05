/* eslint-disable @typescript-eslint/naming-convention */
import mongoose from "mongoose";

const ipLocationSchema = new mongoose.Schema({
  ipFrom: {
    type: Number,
    required: true,
  },
  ipTo: {
    type: Number,
    required: true,
    index: 1,
  },
  countryCode: {
    type: String,
    required: true,
  },
  countryName: {
    type: String,
    required: true,
  },
  regionName: {
    type: String,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

export const IPLocationModel = mongoose.model(
  "IPLocation",
  ipLocationSchema,
  "iplocations"
);
