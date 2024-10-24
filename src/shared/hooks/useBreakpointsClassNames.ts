export function createPrefixer<T>(prefix: string, separator = "-") {
  return (value: T) => {
    if (typeof value === "number") {
      return `${value >= 0 ? "" : "-"}${prefix}${separator}${Math.abs(value)}`;
    }

    return `${prefix}${separator}${value}`;
  };
}
