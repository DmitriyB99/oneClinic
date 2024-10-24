import { useCallback } from "react";

import { Avatar, List } from "antd";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { ArrowLeftIcon, Button, Island } from "@/shared/components";
import { COMPLETED_AMBULANCE_ONBOARDING } from "@/shared/utils";

import { ONBOARDING_LIST_ITEMS } from "../lib";

export const AmbulanceOnboarding: React.FC = () => {
  const router = useRouter();
  const tMob = useTranslations("Mobile.CallAmbulance");

  const handleCompleteOnboarding = useCallback(() => {
    localStorage.setItem(COMPLETED_AMBULANCE_ONBOARDING, "true");
    router.push("/callAmbulance");
  }, [router]);

  return (
    <div className="flex h-screen flex-col">
      <Button
        size="s"
        variant="tinted"
        className="absolute left-4 top-2 bg-gray-2"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon />
      </Button>
      <div className="flex justify-center">
        <img
          style={{ height: "50vh" }}
          src="/ambulanceOnboarding.png"
          alt="ambulance onboarding"
        />
      </div>
      <Island className="flex h-full flex-col !rounded">
        <p className="mb-4 text-Bold20">{tMob("CallingAnAmbulance")}</p>
        <p className="mb-3 text-Regular16">
          {tMob(
            "WeWillQuicklyArriveEvenOutsideTheCityAndDuringTheCallOurDoctorOnDutyWillAlwaysBeInTouch"
          )}
        </p>

        <List
          className="mt-4"
          itemLayout="horizontal"
          dataSource={ONBOARDING_LIST_ITEMS}
          renderItem={(item, index) => (
            <div className="relative mb-6 flex items-center">
              <Avatar className="flex items-center justify-center rounded-xl bg-brand-light text-Bold20 text-brand-secondary">
                {index + 1}
              </Avatar>
              <div className="grow border-l-2 pl-4">
                <p className="mb-1 text-Regular16">{item.title}</p>
                <p className="mb-0 text-Regular12 text-secondaryText">
                  {item.description}
                </p>
              </div>
              {index <= 1 && (
                <div className="absolute left-[15px] top-[35px] h-[30px] w-[2px] rounded-md bg-brand-light"></div>
              )}
            </div>
          )}
        />
        <Button block className="mb-4 mt-0" onClick={handleCompleteOnboarding}>
          {tMob("CallAnAmbulance")}
        </Button>
        <Button
          block
          variant="tertiary"
          className="mb-4 mt-0 text-Medium16"
          onClick={handleCompleteOnboarding}
        >
          Больше не показывать
        </Button>
      </Island>
    </div>
  );
};
