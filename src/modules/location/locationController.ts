import { type Request, type Response } from "express";
import { type GetLocationsQuery } from "./types";
import { getLocationsService } from "./locationService";

export const getLocationsController = async (
  req: Request<unknown, unknown, unknown, GetLocationsQuery>,
  res: Response
) => {
  const { data, limit, skip } = await getLocationsService(req.query);

  res.status(200).json({
    metadata: {
      limit,
      skip,
    },
    data,
  });
};
