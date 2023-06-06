export const ipv4ToNumber = (ipv4: string) => {
  const ipParts = ipv4.split(".");
  return (
    ((Number(ipParts[0]) * 256 + Number(ipParts[1])) * 256 +
      Number(ipParts[2])) *
      256 +
    Number(ipParts[3])
  );
};
