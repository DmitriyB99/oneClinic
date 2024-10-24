import type { FC } from "react";
import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

import {
  IncreaseIncome,
  PromoteProfile,
  WorkWithSmartphone,
} from "@/entities/doctorOnboarding";
import { TabsPagination } from "@/shared/components";
import { COMPLETED_DOCTOR_ONBOARDING } from "@/shared/utils";

export const DoctorOnboarding: FC = () => {
  const [activeOnboardingPage, setActiveOnboardingPage] = useState<number>(0);
  const router = useRouter();

  const completeOnboarding = useCallback(() => {
    if (typeof window !== undefined) {
      localStorage.setItem(COMPLETED_DOCTOR_ONBOARDING, "true");
      router.push("/mainDoctor");
    }
  }, [router]);

  return (
    <div className="h-full">
      <TabsPagination
        activeIndex={activeOnboardingPage}
        items={[
          <IncreaseIncome
            skip={completeOnboarding}
            next={() => setActiveOnboardingPage(1)}
            key="increaseIncome"
          />,
          <PromoteProfile
            skip={completeOnboarding}
            next={() => setActiveOnboardingPage(2)}
            key="promoteProfile"
          />,
          <WorkWithSmartphone
            completeDoctorOnboarding={completeOnboarding}
            key="workWithSmartphone"
          />,
        ]}
      />
    </div>
  );
};
