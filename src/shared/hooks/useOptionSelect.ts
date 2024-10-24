import { useState } from "react";

export const useOptionSelect = (initialOption = null) => {
  const [selectedOption, setSelectedOption] = useState(initialOption);

  const handleOptionChange = (id, optionsList) => {
    const selected = optionsList.find((option) => option.id === id);
    if (selected) setSelectedOption(selected);
  };

  return { selectedOption, handleOptionChange };
};
