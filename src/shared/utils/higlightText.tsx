import React from "react";

const removeSpecialChars = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "");

export const highlightText = (
  text: string,
  highlight: string
): React.ReactNode => {
  if (!highlight?.trim()) {
    return text;
  }
  const filteredHighlight = removeSpecialChars(highlight);
  const regex = new RegExp(`(${filteredHighlight})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <strong key={index}>{part}</strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};
