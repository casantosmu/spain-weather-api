import { type Municipality, type Province } from "./types";
import { MunicipalityModel, ProvinceModel } from "./locationModels";
import httpClient from "../../httpClient";
import { provinceCodeRange } from "./constants";
import capitalsOfProvincesJson from "./seeder/capitalsOfProvinces.json";
import { NotFoundError } from "../../error";
import { getProvinceCodeFromMunicipalityCode } from "./utils";

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
const isValidProvinceCode = (provinceCode: string) =>
  Number(provinceCode) <= provinceCodeRange.max;

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
    .filter((record) => isValidProvinceCode(record.fields.prov_code))
    .map((record) => {
      // The information provided by Open Data Soft on Spanish provinces does not include their respective capitals.
      // Therefore, we need to search for the capital city of each province in a JSON file containing a list of Spanish provincial capitals.
      const provinceCapital = capitalsOfProvincesJson[0]?.data.find(
        (provinceCapital) =>
          getProvinceCodeFromMunicipalityCode(provinceCapital.code) ===
          record.fields.prov_code
      );

      if (!provinceCapital) {
        throw new NotFoundError({
          name: "ProvinceCapitalNotFound",
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

export type NewProvincesRepository = Awaited<
  ReturnType<typeof getNewProvincesRepository>
>[number];

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
        isValidProvinceCode(
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
    year: province.year,
  }));

  await ProvinceModel.insertMany(mappedProvinces);
};

export const createMunicipalitiesRepository = async (
  municipalities: Municipality[]
) => {
  const mappedMunicipalities = municipalities.map((municipality) => ({
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
    year: municipality.year,
  }));

  await MunicipalityModel.insertMany(mappedMunicipalities);
};

export const hasLocationRepository = async () => {
  const hasLocation = await MunicipalityModel.findOne().exec();
  return Boolean(hasLocation);
};
