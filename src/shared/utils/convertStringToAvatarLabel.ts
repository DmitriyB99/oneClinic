export const convertStringToAvatarLabel = (str?: string): string => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
};
