import { provincesLength } from "./constants";
import { InvalidNumberOfProvincesError } from "./error";

export const checkProvincesLength = (provinces: unknown[]) => {
  if (provinces.length !== provincesLength) {
    throw new InvalidNumberOfProvincesError();
  }
};
