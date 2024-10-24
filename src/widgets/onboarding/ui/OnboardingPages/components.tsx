import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  ConsultationPage,
  DoctorsPage,
  ClientsPage,
} from "@/entities/onboarding";
import { TabsPagination } from "@/shared/components";

export function OnBoarding() {
  const [active, setActive] = useState(0);
  const router = useRouter();

  const lookedOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lookedOnboarding", "true");
      router.push("/main");
    }
  };

  return (
    <div className="h-full bg-gray-bgCard">
      <TabsPagination
        items={[
          <ClientsPage key="clients" complete={() => setActive(1)} />,
          <ConsultationPage key="consultation" complete={() => setActive(2)} />,
          <DoctorsPage key="doctors" onBoardingComplete={lookedOnboarding} />,
        ]}
        activeIndex={active}
      />
    </div>
  );
}
