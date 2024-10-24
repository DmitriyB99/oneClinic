export const setDefaultLocale = (locale: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`;
  }
};
