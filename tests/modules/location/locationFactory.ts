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
  type Province,
  type Municipality,
} from "../../../src/modules/location/types";
import { entity } from "../../../src/modules/location/constants";

abstract class BaseLocationBuilder<T extends NewLocation> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  protected readonly data: T = {} as T;

  withCode(code: string) {
    this.data.code = code;
    return this;
  }

  withRandomCode() {
    this.data.code = faker.string.alpha(5);
    return this;
  }

  withName(name: string) {
    this.data.name = name;
    return this;
  }

  withRandomName() {
    this.data.name = faker.location.city();
    return this;
  }

  withLatLng(latLng: LatLng) {
    this.data.latLng = latLng;
    return this;
  }

  withRandomLatLng() {
    this.data.latLng = [
      Number(faker.location.latitude()),
      Number(faker.location.longitude()),
    ];
    return this;
  }

  withYear(year: number) {
    this.data.year = year;
    return this;
  }

  withRandomYear() {
    this.data.year = faker.date.anytime().getFullYear();
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
    this.data.id = faker.string.uuid();
    return this;
  }
}

export class NewProvincesBuilder extends BaseLocationBuilder<NewProvince> {
  withCapital(capital: NewLocationBase) {
    this.data.capital = capital;
    return this;
  }
}

export class ProvinceBuilder extends LocationBuilder<Province> {
  withEntity() {
    this.data.entity = entity.province;
    return this;
  }

  withRandomCapital() {
    this.data.capital = new MunicipalityBuilder()
      .withRandomId()
      .withRandomCode()
      .withRandomName()
      .build();
    return this;
  }

  withRandomValues() {
    this.withRandomId()
      .withRandomName()
      .withRandomCode()
      .withRandomLatLng()
      .withRandomYear()
      .withRandomCapital()
      .withEntity();
    return this;
  }
}

export class NewMunicipalitiesBuilder extends BaseLocationBuilder<NewMunicipality> {
  withProvince(province: NewLocationBase) {
    this.data.province = province;
    return this;
  }
}

export class MunicipalityBuilder extends LocationBuilder<Municipality> {
  withEntity() {
    this.data.entity = entity.municipality;
    return this;
  }

  withRandomProvince() {
    this.data.province = new ProvinceBuilder()
      .withRandomId()
      .withRandomCode()
      .withRandomName()
      .build();
    return this;
  }

  withRandomValues() {
    this.withRandomId()
      .withRandomName()
      .withRandomCode()
      .withRandomLatLng()
      .withRandomYear()
      .withRandomProvince()
      .withEntity();
    return this;
  }
}

export class NewAutonomousCityBuilder extends BaseLocationBuilder<NewAutonomousCity> {}

export class AutonomousCityBuilder extends LocationBuilder<AutonomousCity> {
  withEntity() {
    this.data.entity = entity.autonomousCity;
    return this;
  }

  withRandomValues() {
    this.withRandomId()
      .withRandomName()
      .withRandomCode()
      .withRandomLatLng()
      .withRandomYear()
      .withEntity();
    return this;
  }
}
