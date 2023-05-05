export type LatLng = readonly [number, number];

export type NewLocationBase = {
  code: string;
  name: string;
};

export type NewLocation = {
  latLng: LatLng;
} & NewLocationBase;

export type NewProvince = {
  capital: NewLocationBase;
} & NewLocation;

export type NewMunicipality = {
  province: NewLocationBase;
} & NewLocation;

type LocationBase = {
  id: string;
  code: string;
  name: string;
};

type Location = {
  latLng: LatLng;
} & LocationBase;

export type Province = {
  capital: LocationBase;
} & Location;
export type Municipality = {
  province: LocationBase;
} & Location;
