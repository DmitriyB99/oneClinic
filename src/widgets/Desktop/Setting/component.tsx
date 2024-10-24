import { useCallback, useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { DesktopNavLinkSetting } from "@/entities/desktopMain";
import {
  DesktopSettingAccount,
  DesktopSettingClinicData,
} from "@/entities/desktopSetting";
import type { EditDoctorProfileForm } from "@/pages/myDoctor/editProfile";
import { doctorsApi } from "@/shared/api";
import type { UpdateClinicProfileModel } from "@/shared/api/clinics";
import { clinicsApi } from "@/shared/api/clinics";
import {
  Button,
  CategoryIcon,
  DividerSaunet,
  HomeTrendUpIcon,
  UserSquareIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import type { ClinicModel } from "@/widgets/auth";

type NavNames = "account" | "exit" | "clinicData";

export const DesktopSettingsPageWidget = () => {
  const [activeNav, setActiveNav] = useState<NavNames>("account");

  const { logout, user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Settings");
  const { control, reset, handleSubmit, setValue } =
    useForm<UpdateClinicProfileModel | EditDoctorProfileForm>();

  const { mutate: updateMyDoctorProfile } = useMutation(
    ["updateMyDoctorProfile"],
    (data: EditDoctorProfileForm) => doctorsApi.updateDoctorProfile(data)
  );

  const { mutate: updateClinicProfile } = useMutation(
    ["updateMyClinicProfile"],
    (data: UpdateClinicProfileModel) => clinicsApi.updateClinicProfile(data)
  );

  const onSubmit = useCallback(
    (submitData: EditDoctorProfileForm | UpdateClinicProfileModel) => {
      if (user?.role === "clinic") {
        const data = submitData as UpdateClinicProfileModel;
        updateClinicProfile({
          ...data,
          id: user?.role_id,
        });
      } else {
        const data = submitData as EditDoctorProfileForm;
        const clinics = data?.clinics?.map((clinic) => ({
          clinicId: clinic.clinicId,
          cityId: clinic.cityId,
        })) as ClinicModel[];
        updateMyDoctorProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          fatherName: data.fatherName,
          phoneNumber: data.phoneNumber,
          specialityCodes: data.specialityCodes,
          iin: data.iin,
          workExperience: data.workExperience,
          clinics: clinics,
          doctorProfileId: user?.role_id,
          // TODO: add email to doctor profile after Bizhan fixes the backend
          // email: data.email,
        });
      }
    },
    [updateClinicProfile, updateMyDoctorProfile, user]
  );

  const settingPages = useMemo(
    () => [
      {
        pageName: "account",
        component: (
          <DesktopSettingAccount
            control={control}
            reset={reset}
            setValue={setValue}
          />
        ),
      },
      {
        pageName: "clinicData",
        component: (
          <DesktopSettingClinicData
            control={control}
            reset={reset}
            setValue={setValue}
          />
        ),
      },
    ],
    [control, reset, setValue]
  );

  const items = useMemo(
    () => [
      {
        title: tDesktop("ClinicData"),
        isActive: activeNav === "clinicData",
        onClick: () => setActiveNav("clinicData"),
        icon: <CategoryIcon />,
        permission: "clinic",
      },
      {
        title: tDesktop("Account"),
        isActive: activeNav === "account",
        onClick: () => setActiveNav("account"),
        icon: <UserSquareIcon />,
      },
      {
        title: t("LeaveAccount"),
        isActive: activeNav === "exit",
        onClick: () => {
          logout();
          router.push("/desktop/login");
        },
        icon: <HomeTrendUpIcon />,
      },
    ],
    [activeNav, router, logout, t, tDesktop]
  );

  return (
    <div className="h-screen p-12">
      <div className="flex justify-between">
        <div className="text-Bold24">{t("Settings")}</div>
        <div className="flex">
          <Button
            className="!h-10 rounded-lg bg-white px-4 py-0"
            variant="outline"
            outlineDanger
            onClick={() => {
              queryClient.invalidateQueries("getDoctorProfileInfo");
              queryClient.invalidateQueries("getClinicInfoById");
              queryClient.invalidateQueries("getClinicProfileInfo");
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="ml-4 !h-10 rounded-lg px-4 py-0"
            onClick={() => handleSubmit(onSubmit)()}
          >
            {t("Save")}
          </Button>
        </div>
      </div>
      <div className="mt-6 flex h-full bg-white p-6 pr-0">
        <div className="flex h-full w-56 justify-between">
          <div className="flex w-48 flex-col">
            {items?.map((item) => (
              <DesktopNavLinkSetting
                isActive={item.isActive}
                onClick={item.onClick}
                icon={item.icon}
                title={item.title}
                key={item.title}
                permission={item.permission}
              />
            ))}
          </div>
          <DividerSaunet className="mx-4 h-full" type="vertical" />
        </div>
        {settingPages.map(
          (page) => page.pageName === activeNav && page.component
        )}
      </div>
    </div>
  );
};
