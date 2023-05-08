export type LatLng = readonly [number, number];

export type NewLocationBase = {
  code: string;
  name: string;
};

export type NewLocation = {
  latLng: LatLng;
  year: number;
} & NewLocationBase;

export type NewProvince = {
  capital: NewLocationBase;
} & NewLocation;

export type NewMunicipality = {
  province: NewLocationBase;
} & NewLocation;

export type NewAutonomousCity = NewLocation;

type LocationBase = {
  id: string;
  code: string;
  name: string;
};

type Location = {
  latLng: LatLng;
  year: number;
} & LocationBase;

export type Province = {
  capital: LocationBase;
} & Location;

export type Municipality = {
  province: LocationBase;
} & Location;

export type AutonomousCity = Location;
