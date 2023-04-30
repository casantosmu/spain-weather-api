import {
  type NewMunicipalitiesRepository,
  type NewProvincesRepository,
} from "../../../src/modules/location/locationRepository";
import { type LatLng } from "../../../src/modules/location/types";

type BaseLocation = {
  code: string;
  name: string;
  latLng: LatLng;
};

abstract class BaseLocationBuilder<T extends BaseLocation> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  protected readonly data: T = {} as T;

  withCode(code: string) {
    this.data.code = code;
    return this;
  }

  withName(name: string) {
    this.data.name = name;
    return this;
  }

  withLatLng(latLng: LatLng) {
    this.data.latLng = latLng;
    return this;
  }

  build() {
    return this.data;
  }
}

export class NewProvincesRepositoryBuilder extends BaseLocationBuilder<NewProvincesRepository> {
  withCapital(capital: { code: string; name: string }) {
    this.data.capital = capital;
    return this;
  }
}

export class NewMunicipalitiesRepositoryBuilder extends BaseLocationBuilder<NewMunicipalitiesRepository> {
  withProvince(province: { code: string; name: string }) {
    this.data.province = province;
    return this;
  }
}
