/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type Location,
  type AutonomousCity,
  type Municipality,
  type Province,
} from "./types";
import {
  AutonomousCityModel,
  LocationModel,
  MunicipalityModel,
  ProvinceModel,
} from "./locationModels";
import httpClient from "../../httpClient";
import capitalsOfProvincesJson from "./seeder/capitalsOfProvinces.json";
import { NotFoundError } from "../../error";
import { getProvinceCodeFromMunicipalityCode } from "./utils";
import { entity } from "./constants";
import { sanitizeFilter } from "mongoose";

export type OpenDataSoftRecord<T> = {
  fields: T;
};

export type OpenDataSoftResponse<T> = {
  records: Array<OpenDataSoftRecord<T>>;
};

export type OpenDataSoftMunicipalitiesField = {
  prov_name: string;
  geo_point_2d: [number, number];
  prov_code: string;
  mun_code: string;
  mun_name: string;
  year: string;
};

export type OpenDataSoftMunicipalitiesResponse =
  OpenDataSoftResponse<OpenDataSoftMunicipalitiesField>;

export type OpenDataSoftProvinceField = {
  prov_name: string;
  geo_point_2d: [number, number];
  prov_code: string;
  year: string;
};

export type OpenDataSoftProvincesResponse =
  OpenDataSoftResponse<OpenDataSoftProvinceField>;

const openDataSoftBaseUrl =
  "https://public.opendatasoft.com/api/records/1.0/search/";

// The provinces provided by Open Soft Data include Ceuta and Melilla autonomous cities and "Territorio no asociado a ninguna provincia".
const specialProvincesCodes = {
  ceuta: "51",
  melilla: "52",
  unknown: "53",
  unincorporatedTerritory: "54",
};

export const getNewProvincesRepository = async () => {
  const dataset = "georef-spain-provincia";
  const rows = 1000;
  const facets = ["prov_code", "prov_name"];
  const url = `${openDataSoftBaseUrl}?dataset=${dataset}&rows=${rows}&facet=${facets.join(
    "&facet="
  )}`;

  const { data: newProvinces } =
    await httpClient.get<OpenDataSoftProvincesResponse>(url);

  return newProvinces.records
    .filter(
      (record) =>
        !Object.values(specialProvincesCodes).includes(record.fields.prov_code)
    )
    .map((record) => {
      // The information provided by Open Data Soft on Spanish provinces does not include their respective capitals.
      const provinceCapital = capitalsOfProvincesJson[0]?.data.find(
        (provinceCapital) =>
          getProvinceCodeFromMunicipalityCode(provinceCapital.code) ===
          record.fields.prov_code
      );

      if (!provinceCapital) {
        throw new NotFoundError({
          name: "ProvinceCapitalNotFoundError",
          message: `Could not find the capital city for the province with code ${record.fields.prov_code}.`,
        });
      }

      return {
        name: record.fields.prov_name,
        code: record.fields.prov_code,
        latLng: [
          record.fields.geo_point_2d[0],
          record.fields.geo_point_2d[1],
        ] as const,
        capital: {
          code: provinceCapital.code,
          name: provinceCapital.name,
        },
        year: Number(record.fields.year),
      };
    });
};

const repeatedMunicipalities = [
  "Sotu'l Barcu",
  "Maó-Mahón",
  "Alacant",
  "Novelé",
  "Coaña",
  "Tapia",
];

export const getNewMunicipalitiesRepository = async () => {
  const dataset = "georef-spain-municipio";
  const rows = 10000; // There are around 8k provinces in Spain.
  const facets = ["prov_code", "prov_name", "mun_code", "mun_name"];
  const url = `${openDataSoftBaseUrl}?dataset=${dataset}&rows=${rows}&facet=${facets.join(
    "&facet="
  )}`;

  const { data: newMunicipalities } =
    await httpClient.get<OpenDataSoftMunicipalitiesResponse>(url);

  return newMunicipalities.records
    .filter(
      (record) =>
        !Object.values(specialProvincesCodes).includes(
          getProvinceCodeFromMunicipalityCode(record.fields.mun_code)
        ) && !repeatedMunicipalities.includes(record.fields.mun_name)
    )
    .map((record) => ({
      name: record.fields.mun_name,
      code: record.fields.mun_code,
      latLng: [
        record.fields.geo_point_2d[0],
        record.fields.geo_point_2d[1],
      ] as const,
      province: {
        code: record.fields.prov_code,
        name: record.fields.prov_name,
      },
      year: Number(record.fields.year),
    }));
};

export const getNewAutonomousCitiesRepository = async () => {
  const dataset = "georef-spain-provincia";
  const rows = 1000;
  const facets = ["prov_code", "prov_name"];
  const url = `${openDataSoftBaseUrl}?dataset=${dataset}&rows=${rows}&facet=${facets.join(
    "&facet="
  )}`;

  const { data: provinces } =
    await httpClient.get<OpenDataSoftProvincesResponse>(url);

  return provinces.records
    .filter(
      (record) =>
        record.fields.prov_code === specialProvincesCodes.ceuta ||
        record.fields.prov_code === specialProvincesCodes.melilla
    )
    .map((record) => ({
      name: record.fields.prov_name,
      code: record.fields.prov_code,
      latLng: [
        record.fields.geo_point_2d[0],
        record.fields.geo_point_2d[1],
      ] as const,
      year: Number(record.fields.year),
    }));
};

const mapToLocationModel = (location: Location) => ({
  _id: location.id,
  name: location.name,
  latitude: location.latLng[0],
  longitude: location.latLng[1],
  code: location.code,
  year: location.year,
});

const mapToProvinceModel = (province: Province) => ({
  ...mapToLocationModel(province),
  capital: {
    _id: province.capital.id,
    code: province.capital.code,
    name: province.capital.name,
  },
});

const mapToMunicipalityModel = (municipality: Municipality) => ({
  ...mapToLocationModel(municipality),
  province: {
    _id: municipality.province.id,
    code: municipality.province.code,
    name: municipality.province.name,
  },
});

const mapToLocation = (location: any) => {
  const defaultData = {
    id: location._id,
    name: location.name,
    latLng: [location.latitude, location.longitude],
    code: location.code,
    entity: location.entity,
  };

  switch (location.entity) {
    case entity.municipality:
      return {
        ...defaultData,
        province: {
          id: location.province._id,
          name: location.province.name,
          code: location.province.code,
        },
      };
    case entity.province:
      return {
        ...defaultData,
        capital: {
          id: location.capital._id,
          name: location.capital.name,
          code: location.capital.code,
        },
      };
    default:
      return defaultData;
  }
};

const mapToAutonomousCityModel = (autonomousCity: AutonomousCity) =>
  mapToLocationModel(autonomousCity);

export const createProvincesRepository = async (provinces: Province[]) => {
  const mappedProvinces = provinces.map(mapToProvinceModel);
  await ProvinceModel.insertMany(mappedProvinces);
};

export const createProvinceRepository = async (province: Province) => {
  const mappedProvince = mapToProvinceModel(province);
  await ProvinceModel.create(mappedProvince);
};

export const createMunicipalitiesRepository = async (
  municipalities: Municipality[]
) => {
  const mappedMunicipalities = municipalities.map(mapToMunicipalityModel);
  await MunicipalityModel.insertMany(mappedMunicipalities);
};

export const createMunicipalityRepository = async (
  municipality: Municipality
) => {
  const mappedMunicipality = mapToMunicipalityModel(municipality);
  await MunicipalityModel.create(mappedMunicipality);
};

export const createAutonomousCitiesRepository = async (
  autonomousCities: AutonomousCity[]
) => {
  const mappedAutonomousCities = autonomousCities.map(mapToAutonomousCityModel);
  await AutonomousCityModel.insertMany(mappedAutonomousCities);
};

export const createAutonomousCityRepository = async (
  autonomousCity: AutonomousCity
) => {
  const mappedAutonomousCity = mapToAutonomousCityModel(autonomousCity);
  await AutonomousCityModel.create(mappedAutonomousCity);
};

export const hasLocationRepository = async () => {
  const hasLocation = await MunicipalityModel.findOne().exec();
  return Boolean(hasLocation);
};

type GetLocationsParams = {
  name?: string;
  limit: number;
  skip: number;
};

export const filterLikeNameLocationsRepository = async ({
  name,
  limit,
  skip,
}: GetLocationsParams) => {
  const query = {
    ...(name && { name: new RegExp(name, "i") }),
  };

  const locations = await LocationModel.find(query)
    .limit(limit)
    .skip(skip)
    .sort({ name: "asc" });

  return {
    limit,
    skip,
    data: locations.map((location) => mapToLocation(location)),
  };
};
