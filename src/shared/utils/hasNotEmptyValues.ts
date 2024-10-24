export const hasNotEmptyValues = <T>(arr: T[]) =>
  arr.filter(
    (obj) =>
      !Object.values(obj ?? []).some(
        (value: string | []) =>
          value === "" || (Array.isArray(value) && !value.length)
      )
  );
