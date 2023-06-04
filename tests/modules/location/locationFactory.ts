import { faker } from "@faker-js/faker";
import {
  type NewLocationRelation,
  type LatLng,
  type NewLocation,
  type NewMunicipality,
  type NewProvince,
  type NewAutonomousCity,
  type Location,
  type LocationAutonomousCity,
  type LocationProvince,
  type LocationMunicipality,
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

export class NewProvinceBuilder extends BaseLocationBuilder<NewProvince> {
  withCapital(capital: NewLocationRelation) {
    this.data.capital = capital;
    return this;
  }
}

export class NewMunicipalitiesBuilder extends BaseLocationBuilder<NewMunicipality> {
  withProvince(province: NewLocationRelation) {
    this.data.province = province;
    return this;
  }
}

export class NewAutonomousCityBuilder extends BaseLocationBuilder<NewAutonomousCity> {}

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

export class LocationProvinceBuilder extends LocationBuilder<LocationProvince> {
  withEntity() {
    this.data.entity = entity.province;
    return this;
  }

  withRandomCapital() {
    this.data.capital = new LocationMunicipalityBuilder()
      .withRandomId()
      .withRandomCode()
      .withRandomName()
      .build();
    return this;
  }

  withRandomProvinceId() {
    this.data.provinceId = faker.string.uuid();
    return this;
  }

  withRandomValues() {
    this.withRandomId()
      .withRandomName()
      .withRandomCode()
      .withRandomLatLng()
      .withRandomYear()
      .withRandomCapital()
      .withRandomProvinceId()
      .withEntity();
    return this;
  }
}

export class LocationMunicipalityBuilder extends LocationBuilder<LocationMunicipality> {
  withEntity() {
    this.data.entity = entity.municipality;
    return this;
  }

  withRandomProvince() {
    this.data.province = new LocationProvinceBuilder()
      .withRandomId()
      .withRandomCode()
      .withRandomName()
      .build();
    return this;
  }

  withRandomMunicipalityId() {
    this.data.municipalityId = faker.string.uuid();
    return this;
  }

  withRandomValues() {
    this.withRandomId()
      .withRandomName()
      .withRandomCode()
      .withRandomLatLng()
      .withRandomYear()
      .withRandomProvince()
      .withRandomMunicipalityId()
      .withEntity();
    return this;
  }
}

export class LocationAutonomousCityBuilder extends LocationBuilder<LocationAutonomousCity> {
  withEntity() {
    this.data.entity = entity.autonomousCity;
    return this;
  }

  withRandomAutonomousCityId() {
    this.data.autonomousCityId = faker.string.uuid();
    return this;
  }

  withRandomValues() {
    this.withRandomId()
      .withRandomName()
      .withRandomCode()
      .withRandomLatLng()
      .withRandomYear()
      .withRandomAutonomousCityId()
      .withEntity();
    return this;
  }
}
