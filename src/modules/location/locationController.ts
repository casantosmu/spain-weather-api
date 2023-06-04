import { type Request, type Response } from "express";
import {
  type LocationMunicipality,
  type GetLocationsQuery,
  type LocationProvince,
  type LocationAutonomousCity,
} from "./types";
import { getLocationsService } from "./locationService";

export const mapToLocationView = (
  location: LocationMunicipality | LocationProvince | LocationAutonomousCity
) => {
  const { year, ...restData } = location;
  return restData;
};

export const getLocationsController = async (
  req: Request<unknown, unknown, unknown, GetLocationsQuery>,
  res: Response
) => {
  const { data, limit, skip, total } = await getLocationsService(req.query);

  res.status(200).json({
    metadata: {
      limit,
      skip,
      total,
    },
    data: data.map(mapToLocationView),
  });
};
