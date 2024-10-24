export const formatCreditCardNumber = (input: string): string => {
  const digitsOnly = input.replace(/\D/g, "");
  const parts = digitsOnly.match(/[\s\S]{1,4}/g) || [];
  return parts.join(" ");
};

export const formatExpirationDate = (input: string): string => {
  const digitsOnly = input.replace(/\D/g, "");
  if (input.length > 5) {
    return input.slice(0, 5);
  }
  const parts = digitsOnly.match(/^(\d{1,2})(\d{1,2})?$/);
  if (parts) {
    const month = parts[1];
    const year = parts[2];
    return year ? `${month}/${year}` : month;
  }
  return "";
};

export const formatCVC = (input: string): string => {
  const digitsOnly = input.replace(/\D/g, "");
  if (input.length > 3) {
    return input.slice(0, 3);
  }
  return digitsOnly;
};
