import { ipToLong } from "../../utils";
import { IPLocationModel } from "./ipLocationModel";

export const getLatLngFromIpRepository = async (ip: string) => {
  const ipLong = ipToLong(ip);

  const query = {
    ipTo: {
      $gte: ipLong,
    },
  };

  const result = await IPLocationModel.findOne(query)
    .select("latitude longitude")
    .lean();

  return result ? ([result.latitude, result.latitude] as const) : undefined;
};
