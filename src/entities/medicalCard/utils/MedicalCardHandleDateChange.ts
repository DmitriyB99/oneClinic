import type { ChangeEvent } from "react";

export const handleDateChange = (
  event: ChangeEvent<HTMLInputElement>,
  setValue: (value: string) => void
) => {
  const input = event.target.value;
  const digitsOnly = input.replace(/\D/g, ""); // Remove non-digit characters

  if (digitsOnly.length <= 8) {
    const day = digitsOnly.slice(0, 2);
    const month = digitsOnly.slice(2, 4);
    const year = digitsOnly.slice(4, 8);

    const formattedDate = `${day}.${month}.${year}`;
    setValue(formattedDate);
  }
};
