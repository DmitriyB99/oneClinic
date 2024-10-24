export const COMPLETED_DOCTOR_ONBOARDING = "lookedDoctorOnboarding";
export const COMPLETED_DUTY_DOCTOR_ONBOARDING =
  "isDutyDoctorOnboardingCompleted";
export const COMPLETED_AMBULANCE_ONBOARDING = "isAmbulanceOnboardingCompleted";
export const COMPLETED_PATIENT_ONBOARDING = "isPatientOnboardingCompleted";

export const getOnboardingStatusByType = (
  onboardingType: string
): boolean | undefined => {
  if (typeof window !== "undefined") {
    const isCompleted = localStorage.getItem(onboardingType);
    return isCompleted ? isCompleted === "true" : undefined;
  }
};
