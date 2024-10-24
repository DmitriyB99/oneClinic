import { useCallback, useContext, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  MyAddresses,
  MyChooseLangauge,
  MyNotifications,
  MyPromocode,
} from "@/entities/myProfile";
import type { LanguageCode } from "@/shared/api";
import { patientProfileApi } from "@/shared/api/patient/profile";
import { patientSettingsApi } from "@/shared/api/patient/settings";
import { walletApi } from "@/shared/api/wallet";
import {
  Avatar,
  Dialog,
  InteractiveList,
  Island,
  SettingOutlinedIcon,
  SandClockIcon,
  LikeIcon,
  BellNotificationIcon,
  WorldIcon,
  LogoutIcon,
  WalletOutlinedIcon,
  LocationWhiteIcon,
  WhiteHeartIcon,
} from "@/shared/components";
import { FamilyIcon } from "@/shared/components/atoms/Icons/Family";
import { UserContext } from "@/shared/contexts/userContext";
import { formatKazakhstanPhoneNumber } from "@/shared/utils";

function MyProfile() {
  const t = useTranslations("Common");
  const router = useRouter();
  const { logout } = useContext(UserContext);
  const [open, setOpen] = useState<boolean>(false);
  const { data: myProfileData } = useQuery(["getMyProfile"], () =>
    patientProfileApi?.getMyProfile()
  );

  const { data: walletBalance } = useQuery(["getWalletBalance"], () =>
    walletApi.getWalletBalance()
  );

  const isProfileFilled = useMemo(
    () => !!myProfileData?.data?.name,
    [myProfileData?.data?.name]
  );

  const { surname, name, phone, photo_url } = useMemo(
    () => myProfileData?.data ?? {},
    [myProfileData?.data]
  );

  const { mutate: updatePatientLanguage } = useMutation(
    ["updatePatientLanguage"],
    (newPatientLanguageLocale: LanguageCode) =>
      patientSettingsApi.updateMyLanguage(newPatientLanguageLocale)
  );

  const myProfileOptionsList = useCallback(
    (isProfileFilled?: boolean) => [
      {
        id: "/medicalCard",
        title: t("ServiceHistory"),
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutralStatus">
            <SandClockIcon color="white" />
          </div>
        ),
      },
      {
        id: "/my/family",
        title: "Моя семья",
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-2">
            <FamilyIcon color="gray-icon" />
          </div>
        ),
      },
      // {
      //   id: 2,
      //   title: "Промокод",
      //   startIcon: (
      //     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-1">
      //       <IconPlaceholder color="gray-icon" />
      //     </div>
      //   ),
      // },
      // {
      //   id: 3,
      //   title: "Мои видео",
      //   startIcon: (
      //     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-1">
      //       <IconPlaceholder color="gray-icon" />
      //     </div>
      //   ),
      // },
      {
        id: "/my/favourites",
        title: "Избранное",
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson">
            <WhiteHeartIcon color="white" />
          </div>
        ),
      },
      {
        id: "/my/reviews",
        title: t("MyReviews"),
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-secondary">
            <LikeIcon color="white" />
          </div>
        ),
      },
      // {
      //   id: "/my/paymentMethods",
      //   title: "Методы оплаты",
      //   startIcon: (
      //     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-1">
      //       <IconPlaceholder color="gray-icon" />
      //     </div>
      //   ),
      // },
      ...(isProfileFilled
        ? [
            {
              id: "/my/addresses",
              title: "Мои адреса",
              startIcon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-darkGreenChart">
                  <LocationWhiteIcon color="white" />
                </div>
              ),
            },
          ]
        : []),

      {
        id: "/my/notifications",
        title: t("Notifications"),
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightOrange2">
            <BellNotificationIcon color="white" />
          </div>
        ),
      },
      ...(isProfileFilled
        ? [
            {
              id: "/my/confidentialitySettings",
              title: t("PrivacySettings"),
              startIcon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black">
                  <SettingOutlinedIcon color="white" />
                </div>
              ),
            },
            {
              id: 8,
              title: t("Language"),
              startIcon: (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutralStatus">
                  <WorldIcon color="white" />
                </div>
              ),
            },
          ]
        : []),
      {
        id: 7,
        title: t("LeaveAccount"),
        startIcon: (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightNegative">
            <LogoutIcon color="black" />
          </div>
        ),
      },
    ],
    [t]
  );
  const [openDialogId, setOpenDialogId] = useState<number>(-1);
  const handleMyProfileListClick = useCallback(
    (myProfileListEntryId: number | string) => {
      if (typeof myProfileListEntryId === "string") {
        router.push(myProfileListEntryId);
      } else {
        if (myProfileListEntryId === 7) {
          logout();
          router.push("/login");
          if (window) {
            window.AndroidInterface?.shareData?.("logout");
          }
          if (window?.webkit) {
            window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.(
              "logout"
            );
          }
          return;
        }
        setOpenDialogId(myProfileListEntryId);
        setOpen(true);
      }
    },
    [logout, router]
  );

  const handleLanguageChange = useCallback(
    (loc: string) => {
      updatePatientLanguage(loc as LanguageCode);
      router.push("/my/profile", "/my/profile", { locale: loc });
    },
    [router, updatePatientLanguage]
  );

  const handleDialogClose = useCallback(() => {
    setOpenDialogId(-1);
    setOpen(false);
  }, []);

  const renderDialog = useCallback(() => {
    if (openDialogId === 2) {
      return <MyPromocode onClose={handleDialogClose} />;
    }
    if (openDialogId === 6) {
      return <MyNotifications onClose={handleDialogClose} />;
    }
    if (openDialogId === 8) {
      return (
        <MyChooseLangauge
          onClose={handleDialogClose}
          onSelectLanguage={handleLanguageChange}
        />
      );
    }
    if (openDialogId === 9) {
      return <MyAddresses onClose={handleDialogClose} />;
    }

    return <div />;
  }, [handleDialogClose, handleLanguageChange, openDialogId]);

  return (
    <div className="bg-gray-0">
      <Island
        className="mb-3 cursor-pointer"
        onClick={() => {
          handleMyProfileListClick("/my/profileEdit");
        }}
      >
        <div className="mb-2 flex items-center justify-center text-Bold16">
          {t("MyProfile")}
        </div>
        <div className="flex items-center justify-start">
          <div className="mr-4">
            <Avatar
              size="l"
              text={
                photo_url
                  ? undefined
                  : `${surname?.[0] ?? ""}${name?.[0] ?? ""}`
              }
              src={photo_url}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-Bold20">
              {surname && name
                ? `${surname} ${name}`
                : t("CompleteYourProfile")}
            </div>
            <div className="text-Regular14">
              {phone
                ? formatKazakhstanPhoneNumber(phone)
                : t("CompleteYourProfile")}
            </div>
          </div>
        </div>
      </Island>
      {isProfileFilled && (
        <Island
          className="my-3 flex items-center justify-between"
          onClick={() => router.push("/my/wallet")}
        >
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson">
              <WalletOutlinedIcon color="white" />
            </div>
            <div className="ml-3">{t("Balance")}</div>
          </div>
          <div className="flex items-center">
            <div className="mr-2">{walletBalance?.data?.balance ?? 0} ₸</div>
          </div>
        </Island>
      )}
      <Island className="h-full">
        <div>
          <InteractiveList
            list={myProfileOptionsList(isProfileFilled)}
            listItemWrapperClassNames="!py-3"
            onClick={handleMyProfileListClick}
          />
        </div>
      </Island>
      <Dialog isOpen={open} setIsOpen={setOpen} className="h-fit !p-0">
        {renderDialog()}
      </Dialog>
    </div>
  );
}

export default MyProfile;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
