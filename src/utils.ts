export const ipToLong = (dot: string) => {
  const d = dot.split(".");
  return (
    ((Number(d[0]) * 256 + Number(d[1])) * 256 + Number(d[2])) * 256 +
    Number(d[3])
  );
};
