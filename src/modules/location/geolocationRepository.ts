export const getLatLngFromIpRepository = async (ip: string) =>
  ip ? Promise.resolve([Number(0), Number(0)] as const) : Promise.reject();
