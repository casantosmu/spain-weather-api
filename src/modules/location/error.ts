import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../../error";

export class InvalidNumberOfProvincesError extends UnprocessableEntityError {
  constructor() {
    super({
      name: "InvalidNumberOfProvincesError",
      message: "The number of provinces is not valid for Spain",
    });
  }
}

export class ProvinceNotFoundError extends NotFoundError {
  constructor(provinceName: string) {
    super({
      name: "ProvinceNotFoundError",
      message: `Province '${provinceName}' not found`,
    });
  }
}

export class MunicipalityNotFoundError extends NotFoundError {
  constructor(municipalityName: string) {
    super({
      name: "MunicipalityNotFoundError",
      message: `Municipality '${municipalityName}' not found`,
    });
  }
}

export class LocationCodeNotUniqueError extends ConflictError {
  constructor(locationCode: string) {
    super({
      name: "LocationCodeNotUniqueError",
      message: `Location code '${locationCode}' is not unique`,
    });
  }
}