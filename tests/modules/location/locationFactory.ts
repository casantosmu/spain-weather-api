import { faker } from "@faker-js/faker";
import {
  type NewLocationBase,
  type LatLng,
  type NewLocation,
  type NewMunicipality,
  type NewProvince,
  type NewAutonomousCity,
  type Location,
  type AutonomousCity,
} from "../../../src/modules/location/types";

abstract class BaseLocationBuilder<T extends NewLocation> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  protected readonly data: T = {} as T;

  withCode(code: string) {
    this.data.code = code;
    return this;
  }

  withRandomCode() {
    this.data.code = faker.random.alpha(5);
    return this;
  }

  withName(name: string) {
    this.data.name = name;
    return this;
  }

  withRandomName() {
    this.data.name = faker.address.cityName();
    return this;
  }

  withLatLng(latLng: LatLng) {
    this.data.latLng = latLng;
    return this;
  }

  withRandomLatLng() {
    this.data.latLng = [
      Number(faker.address.latitude()),
      Number(faker.address.longitude()),
    ];
    return this;
  }

  withYear(year: number) {
    this.data.year = year;
    return this;
  }

  withRandomYear() {
    this.data.year = faker.datatype.datetime().getFullYear();
    return this;
  }

  build() {
    return this.data;
  }
}

abstract class LocationBuilder<
  T extends Location
> extends BaseLocationBuilder<T> {
  withId(id: string) {
    this.data.id = id;
    return this;
  }

  withRandomId() {
    this.data.id = faker.datatype.uuid();
    return this;
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

export class AutonomousCityBuilder extends LocationBuilder<AutonomousCity> {}
