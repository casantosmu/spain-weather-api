import { type Request, type Response } from "express";
import { LocationModel } from "./locationModels";
import { type GetLocationsQuery } from "./types";

export const getLocationsController = async (
  req: Request<unknown, unknown, unknown, GetLocationsQuery>,
  res: Response
) => {
  const limit = req.query.limit ?? 25;
  const skip = req.query.skip ?? 0;
  const { name } = req.query;

  const data = (await LocationModel.find({ name }).limit(limit).skip(skip)).map(
    (location) => ({
      id: location._id,
      code: location.code,
      name: location.name,
      latLng: [location.latitude, location.longitude],
    })
  );

  res.status(200).json({
    metadata: {
      limit,
      skip,
    },
    data,
  });
};
