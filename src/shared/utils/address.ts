export const getAddressString = (...args: Array<string | undefined>) =>
  args.filter((arg) => arg).join(", ");
