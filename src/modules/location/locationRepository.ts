import { type Municipality, type Province } from "./types";
import { MunicipalityModel, ProvinceModel } from "./locationModels";
import httpClient from "../../httpClient";

export type OpenDataSoftRecord<T> = {
  fields: T;
};

export type OpenDataSoftResponse<T> = {
  records: Array<OpenDataSoftRecord<T>>;
};

export type OpenDataSoftMunicipalitiesFields = {
  prov_name: string;
  geo_point_2d: [number, number];
  prov_code: string;
  mun_code: string;
  mun_name: string;
};

export type OpenDataSoftMunicipalitiesResponse =
  OpenDataSoftResponse<OpenDataSoftMunicipalitiesFields>;

export type OpenDataSoftProvinceFields = {
  prov_name: string;
  geo_point_2d: [number, number];
  prov_code: string;
};

export type OpenDataSoftProvincesResponse =
  OpenDataSoftResponse<OpenDataSoftProvinceFields>;

const openDataSoftBaseUrl =
  "https://public.opendatasoft.com/api/records/1.0/search/";

export const getNewProvincesRepository = async () => {
  const dataset = "georef-spain-provincia";
  const rows = 1000;
  const facets = ["prov_code", "prov_name"];
  const url = `${openDataSoftBaseUrl}?dataset=${dataset}&rows=${rows}&facet=${facets.join(
    "&facet="
  )}`;

  const { data: newProvinces } =
    await httpClient.get<OpenDataSoftProvincesResponse>(url);

  return newProvinces.records.map((record) => ({
    name: record.fields.prov_name,
    latLng: [
      record.fields.geo_point_2d[0],
      record.fields.geo_point_2d[1],
    ] as const,
    code: record.fields.prov_code,
    capital: {
      code: "test",
      name: "test",
    },
  }));
};

export type NewProvincesRepository = Awaited<
  ReturnType<typeof getNewProvincesRepository>
>[number];

export const getNewMunicipalitiesRepository = async () => {
  const dataset = "georef-spain-municipio";
  const rows = 1000;
  const facets = ["prov_code", "prov_name", "mun_code", "mun_name"];
  const url = `${openDataSoftBaseUrl}?dataset=${dataset}&rows=${rows}&facet=${facets.join(
    "&facet="
  )}`;

  const { data: newMunicipalities } =
    await httpClient.get<OpenDataSoftMunicipalitiesResponse>(url);

  return newMunicipalities.records.map((record) => ({
    code: record.fields.mun_code,
    name: record.fields.mun_name,
    latLng: [
      record.fields.geo_point_2d[0],
      record.fields.geo_point_2d[1],
    ] as const,
    province: {
      code: record.fields.prov_code,
      name: record.fields.prov_name,
    },
  }));
};

export type NewMunicipalitiesRepository = Awaited<
  ReturnType<typeof getNewMunicipalitiesRepository>
>[number];

export const createProvincesRepository = async (provinces: Province[]) => {
  const mappedProvinces = provinces.map((province) => ({
    _id: province.id,
    name: province.name,
    latitude: province.latLng[0],
    longitude: province.latLng[1],
    code: province.code,
    capital: {
      _id: province.capital.id,
      code: province.capital.code,
      name: province.capital.name,
    },
  }));

  await ProvinceModel.insertMany(mappedProvinces);
};

export const createMunicipalitiesRepository = async (
  municipalities: Municipality[]
) => {
  const mappedProvinces = municipalities.map((municipality) => ({
    _id: municipality.id,
    name: municipality.name,
    latitude: municipality.latLng[0],
    longitude: municipality.latLng[1],
    code: municipality.code,
    province: {
      _id: municipality.province.id,
      code: municipality.province.code,
      name: municipality.province.name,
    },
  }));

  await MunicipalityModel.insertMany(mappedProvinces);
};
