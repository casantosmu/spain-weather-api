import {
  type NewLocationBase,
  type LatLng,
  type NewLocation,
  type NewMunicipality,
  type NewProvince,
  type NewAutonomousCity,
} from "../../../src/modules/location/types";

abstract class BaseLocationBuilder<T extends NewLocation> {
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

export class NewProvincesBuilder extends BaseLocationBuilder<NewProvince> {
  withCapital(capital: NewLocationBase) {
    this.data.capital = capital;
    return this;
  }
}

export class NewMunicipalitiesBuilder extends BaseLocationBuilder<NewMunicipality> {
  withProvince(province: NewLocationBase) {
    this.data.province = province;
    return this;
  }
}

export class NewAutonomousCityBuilder extends BaseLocationBuilder<NewAutonomousCity> {}
