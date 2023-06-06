import { ipv4ToNumber } from "../../utils";
import { IpLocationModel } from "./ipLocationModel";

export const getLatLngFromIpv4Repository = async (ipv4: string) => {
  const ipNumber = ipv4ToNumber(ipv4);

  const query = {
    ipTo: {
      $gte: ipNumber,
    },
  };

  const result = await IpLocationModel.findOne(query)
    .select("latitude longitude")
    .lean();

  return result ? ([result.latitude, result.longitude] as const) : undefined;
};
