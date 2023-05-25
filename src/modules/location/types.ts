import { type operations } from "../../generated/Docs";
import { type entity } from "./constants";

export type LatLng = readonly [number, number];

export type NewLocation = {
  code: string;
  name: string;
  latLng: LatLng;
  year: number;
};

export type NewLocationRelation = {
  code: string;
  name: string;
};

export type NewProvince = {
  capital: NewLocationRelation;
} & NewLocation;

export type NewMunicipality = {
  province: NewLocationRelation;
} & NewLocation;

export type NewAutonomousCity = NewLocation;

export type Location = {
  id: string;
  code: string;
  name: string;
  latLng: LatLng;
  year: number;
  entity: (typeof entity)[keyof typeof entity];
};

export type LocationRelation = {
  id: string;
  code: string;
  name: string;
};

export type LocationProvince = {
  capital: LocationRelation;
  entity: typeof entity.province;
} & Location;

export type LocationMunicipality = {
  province: LocationRelation;
  entity: typeof entity.municipality;
} & Location;

export type LocationAutonomousCity = {
  entity: typeof entity.autonomousCity;
} & Location;

export type GetLocationsQuery =
  operations["getLocations"]["parameters"]["query"];
