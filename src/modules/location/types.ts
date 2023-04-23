type Location = {
  id: string;
  name: string;
  latLng: readonly [number, number];
};

export type Province = {
  capital?: string;
} & Location;
