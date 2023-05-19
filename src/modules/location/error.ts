import { NotFoundError, UnprocessableEntityError } from "../../error";

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

export class InvalidProvinceCodeError extends UnprocessableEntityError {
  constructor(provinceCode: string) {
    super({
      name: "InvalidProvinceCodeError",
      message: `Invalid province code: ${provinceCode}`,
    });
  }
}

export class InvalidMunicipalityCodeError extends UnprocessableEntityError {
  constructor(municipalityCode: string) {
    super({
      name: "InvalidMunicipalityCodeError",
      message: `The code '${municipalityCode}' is not a valid municipality code for Spain`,
    });
  }
}
