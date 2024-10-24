export const COMPLETED_ONBOARDING = "lookedOnboarding";
export const getCompletedOnboarding = (): boolean | undefined => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(COMPLETED_ONBOARDING) === "true" ?? undefined;
  }
};
