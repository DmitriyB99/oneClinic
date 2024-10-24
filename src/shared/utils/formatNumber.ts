export function formatNumber(num: number) {
  return Intl.NumberFormat().format(num).replace(/,/g, " ");
}

export function formatKazakhstanPhoneNumber(
  phoneNumber: string | number
): string {
  const numberString = phoneNumber.toString();
  return numberString.replace(
    /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
    "+$1 ($2) $3 $4 $5"
  );
}
