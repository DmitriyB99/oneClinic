import { useState, useEffect } from "react";

import { mobileMaxSize } from "../config";

export const useMediaQuery = (): boolean => {
  const [windowSize, setWindowSize] = useState<number>(
    typeof window === "object" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize < mobileMaxSize;
};
