import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import type { DoctorProfile } from "@/entities/clinics";
import { MyChooseLangauge, MyNotifications } from "@/entities/myProfile";
import type { LanguageCode } from "@/shared/api";
import { languageApi } from "@/shared/api";
import { doctorsApi } from "@/shared/api/doctors";
import {
  ArrowLeftIcon,
  BellNotificationIcon,
  Dialog,
  EyeIcon,
  InteractiveList,
  Island,
  LogoutIcon,
  Navbar,
  SettingOutlinedIcon,
  Toggle,
  UserWithPlusIcon,
  WorldIcon,
} from "@/shared/components";
import { removeAuthToken, removeRefreshToken } from "@/shared/utils/auth";

function DoctorSettings() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [openDialogId, setOpenDialogId] = useState<string>("");

  const { data: doctorProfile } = useQuery(["getMyProfile"], () =>
    doctorsApi.getMyDoctorProfile().then((res) => res.data)
  );

  const { data: updatedDoctorProfile, mutate: updateDutyDoctorStatus } =
    useMutation(
      ["updateDutyDoctorStatus"],
      (updatedDutyDoctorStatus: DoctorProfile) =>
        doctorsApi
          .updateDutyDoctorStatus(updatedDutyDoctorStatus)
          .then((res) => res.data)
    );

  const { mutate: updateDoctorLanguage } = useMutation(
    ["updateDoctorLanguage", doctorProfile?.userId],
    (newDoctorLanguageLocale: LanguageCode) =>
      languageApi.updateUserLanguage(
        doctorProfile?.userId ?? "",
        newDoctorLanguageLocale
      )
  );

  const isDoctorOnDuty = useMemo(
    () => updatedDoctorProfile?.isOnDuty ?? !!doctorProfile?.isOnDuty,
    [doctorProfile?.isOnDuty, updatedDoctorProfile?.isOnDuty]
  );

  const handleDialogClose = useCallback(() => {
    setOpenDialogId("");
    setOpen(false);
  }, []);

  const handleLanguageChange = useCallback(
    (loc: string) => {
      updateDoctorLanguage(loc as LanguageCode);
      router.push("/myDoctor/settings", "/myDoctor/settings", { locale: loc });
    },
    [router, updateDoctorLanguage]
  );

  const renderedDialog = useMemo(() => {
    if (openDialogId === "notifications") {
      return <MyNotifications onClose={handleDialogClose} />;
    }
    if (openDialogId === "language") {
      return (
        <MyChooseLangauge
          onClose={handleDialogClose}
          onSelectLanguage={handleLanguageChange}
        />
      );
    }

    return <div />;
  }, [handleDialogClose, handleLanguageChange, openDialogId]);

  const doctorProfileOptionsList = useMemo(
    () => [
      {
        id: "duty-doctor",
        title: "Режим дежурного врача",
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue">
            <UserWithPlusIcon color="white" />
          </div>
        ),
        endIcon: (
          <Toggle
            checked={isDoctorOnDuty}
            onChange={(toggleStatus) =>
              updateDutyDoctorStatus({
                id: doctorProfile?.id,
                isOnDuty: toggleStatus,
              })
            }
          />
        ),
      },
      {
        id: "profile-overview",
        title: "Как мой профиль видят клиенты",
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-positiveStatus">
            <EyeIcon color="white" />
          </div>
        ),
      },
      {
        id: "notifications",
        title: "Уведомления",
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange">
            <BellNotificationIcon color="white" />
          </div>
        ),
      },
      {
        id: "confidentiality",
        title: "Настройки конфиденциальности",
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark">
            <SettingOutlinedIcon color="white" />
          </div>
        ),
      },
      {
        id: "language",
        title: "Язык",
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red">
            <WorldIcon color="white" />
          </div>
        ),
      },
      {
        id: "logout",
        title: "Выйти из аккаунта",
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightNegative">
            <LogoutIcon color="black" />
          </div>
        ),
      },
    ],
    [doctorProfile?.id, isDoctorOnDuty, updateDutyDoctorStatus]
  );

  const handleOptionClick = useCallback(
    (optionName: string | number) => {
      switch (optionName) {
        case "profile-overview": {
          router.push("/myDoctor/viewProfile");
          break;
        }
        case "notifications": {
          setOpenDialogId("notifications");
          setOpen(true);
          break;
        }
        case "language": {
          setOpenDialogId("language");
          setOpen(true);
          break;
        }
        case "logout": {
          removeAuthToken();
          removeRefreshToken();
          router.push("/login");
        }
      }
    },
    [router]
  );

  return (
    <div className="bg-gray-0">
      <Island className="mb-3 rounded-t-none">
        <Navbar
          title="Настройки"
          leftButtonOnClick={() => router.back()}
          buttonIcon={<ArrowLeftIcon />}
        />
      </Island>
      <Island className="h-full">
        <InteractiveList
          list={doctorProfileOptionsList}
          listItemWrapperClassNames="!py-3"
          onClick={handleOptionClick}
        />
      </Island>
      <Dialog isOpen={open} setIsOpen={setOpen} className="h-fit !p-0">
        {renderedDialog}
      </Dialog>
    </div>
  );
}

export default DoctorSettings;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
