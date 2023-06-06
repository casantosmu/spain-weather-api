import { type Request, type Response } from "express";
import {
  type LocationMunicipality,
  type GetLocationsQuery,
  type LocationProvince,
  type LocationAutonomousCity,
  type GetReverseLocationQuery,
} from "./types";
import {
  getLocationsService,
  getReverseLocationService,
} from "./locationService";

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

export const getReverseLocationController = async (
  req: Request<unknown, unknown, unknown, GetReverseLocationQuery>,
  res: Response
) => {
  const location = await getReverseLocationService(req.query);

  res.status(200).json(mapToLocationView(location));
};
