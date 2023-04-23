import axios from "axios";
import { type Province } from "./types";
import { ProvinceModel } from "./locationModels";

export type ProvincesResponse = {
  records: ProvincesRecord[];
};

export type ProvincesRecord = {
  fields: ProvinceFields;
};

export type ProvinceFields = {
  prov_name: string;
  geo_point_2d: [number, number];
};

export const getProvinces = async () => {
  const baseUrl = "https://public.opendatasoft.com/api/records/1.0/search/";
  const dataset = "georef-spain-provincia";
  const rows = "2"; // 1000
  const facet = "prov_name";
  const url = `${baseUrl}?dataset=${dataset}&rows=${rows}&facet=${facet}`;

  const { data: spainProvincesResponse } = await axios.get<ProvincesResponse>(
    url
  );

  return spainProvincesResponse.records.map((record) => ({
    name: record.fields.prov_name,
    latLng: [
      record.fields.geo_point_2d[0],
      record.fields.geo_point_2d[1],
    ] as const,
  }));
};

export const createProvince = async (province: Province) => {
  const createdProvince = await ProvinceModel.create({
    _id: province.id,
    name: province.name,
    latitude: province.latLng[0],
    longitude: province.latLng[1],
  });

  return createdProvince.toObject();
};
