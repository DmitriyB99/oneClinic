import type { FC } from "react";
import { useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import {
  DesktopClientLogin,
  SegmentedControlDesktop,
  SaunetMobileIcon,
} from "@/shared/components";
import { colors } from "@/shared/config";
import { DesktopAuthDoctor, DesktopAuthManager } from "@/widgets/auth";

type tabRole = "doctor" | "manager" | "client";

const SegmentedOption = {
  colorText: colors?.brand?.darkGreen,
  boxShadowTertiary: `0px 4px 0px -2px ${colors?.brand?.darkGreen}`,
  borderRadiusOuter: 0,
  borderRadius: 0,
  borderRadiusLG: 0,
  borderRadiusSM: 0,
  borderRadiusXS: 0,
};

export const DesktopAuthPage: FC = () => {
  const [activeTab, setActiveTab] = useState<string | number>("doctor");
  const [subtitle, setSubtitle] = useState<string>("");
  const [isLogin, setLogin] = useState<boolean>(true);
  const tDesktop = useTranslations("Desktop.Login");
  const t = useTranslations("Common");

  const regTitleModel = useMemo(
    () => ({
      doctor: tDesktop("Doctor's"),
      manager: tDesktop("Clinic's"),
      client: t("Patient's"),
    }),
    [tDesktop, t]
  );

  return (
    <div className="flex flex-row justify-center gap-5 bg-white p-8">
      <div className="relative flex h-screen w-[480px] flex-col justify-between pb-12">
        <SaunetMobileIcon height={60} size="xxl" />
        <div className="absolute top-[175px] flex w-full flex-col">
          <p className="mb-3 text-Bold32">
            {isLogin
              ? tDesktop("LoginToTheSystem")
              : tDesktop("RegistrationFor", {
                  role: regTitleModel[activeTab as tabRole],
                })}
          </p>
          <p className="mb-6 text-Medium16 text-gray-4">
            {isLogin ? tDesktop("ChooseAuthMethod") : subtitle}
          </p>
          {isLogin && (
            <div className="border-[0px] border-b border-solid border-gray-0">
              <SegmentedControlDesktop
                options={[
                  { label: t("Doctor"), value: "doctor" },
                  { label: t("Clinic"), value: "manager" },
                  { label: t("Patient"), value: "client" },
                ]}
                size="large"
                value={activeTab}
                onChange={(value) => setActiveTab(value)}
                activeStyle={SegmentedOption}
              />
            </div>
          )}
          <div>
            {activeTab === "client" && <DesktopClientLogin />}
            {activeTab === "doctor" && (
              <DesktopAuthDoctor
                isLogin={isLogin}
                setLogin={setLogin}
                setSubtitle={setSubtitle}
              />
            )}
            {activeTab === "manager" && (
              <DesktopAuthManager
                isLogin={isLogin}
                setLogin={setLogin}
                setSubtitle={setSubtitle}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex h-screen w-[716px] flex-col justify-between rounded-2xl bg-brand-superLight pt-14">
        <div className="mb-3 px-14 text-Medium24">
          <div className="mr-2 inline-block text-Bold32">{t("OneClinic")}</div>
          {tDesktop("OneClinicDescription")}
          <div className="relative">
            <div className="mt-10">{tDesktop("OnlineWithoutQueues")}</div>
            <img
              src="/underlineLogin.png"
              alt="underlineLogin"
              className="absolute -bottom-10 -left-2"
            />
          </div>
        </div>
        <div className="relative w-full">
          <img
            src="/doctorlogin3.png"
            alt="doctorlogin3"
            className="absolute bottom-0 z-20 h-[480px]"
          />
          <img
            src="/doctorlogin4.png"
            alt="doctorlogin3"
            className="absolute bottom-0 right-0 h-[650px]"
          />
        </div>
      </div>
    </div>
  );
};
