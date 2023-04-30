type LocationBase = {
  id: string;
  code: string;
  name: string;
};

export type LatLng = readonly [number, number];

type Location = {
  latLng: LatLng;
} & LocationBase;

export type Province = {
  capital: LocationBase;
} & Location;
export type Municipality = {
  province: LocationBase;
} & Location;
