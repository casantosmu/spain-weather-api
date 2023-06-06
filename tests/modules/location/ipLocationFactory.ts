import { type LatLng } from "../../../src/modules/location/types";
import { type InferSchemaType } from "mongoose";
import { type ipLocationSchema } from "../../../src/modules/location/ipLocationModel";
import { ipv4ToNumber } from "../../../src/utils";

export class IpLocationModelBuilder {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  readonly data = {} as InferSchemaType<typeof ipLocationSchema>;

  withIpv4(ipv4: string) {
    this.data.ipFrom = ipv4ToNumber(ipv4);
    this.data.ipTo = this.data.ipFrom + 5;
    return this;
  }

  withLatLng(latLng: LatLng) {
    this.data.latitude = latLng[0];
    this.data.longitude = latLng[1];
    return this;
  }

  build() {
    return this.data;
  }
}
