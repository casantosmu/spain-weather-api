/* eslint-disable @typescript-eslint/naming-convention */
import mongoose from "mongoose";

export const ipLocationSchema = new mongoose.Schema({
  ipFrom: {
    type: Number,
    required: true,
  },
  ipTo: {
    type: Number,
    required: true,
    index: 1,
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

export const IpLocationModel = mongoose.model(
  "IpLocation",
  ipLocationSchema,
  "iplocations"
);
