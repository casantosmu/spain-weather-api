import { UnprocessableEntityError } from "../../error";

export class InvalidNumberOfProvincesError extends UnprocessableEntityError {
  constructor() {
    super({
      name: "InvalidNumberOfProvincesError",
      message: "The number of provinces is not valid for Spain",
    });
  }
}
