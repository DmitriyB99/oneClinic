import { useState, useEffect } from "react";

export const useSearchInput = (dialogVisible: boolean) => {
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (dialogVisible) {
      setSearchValue("");
    }
  }, [dialogVisible]);

  return { searchValue, setSearchValue };
};
