import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { AppointmentPatientsDialogProps } from "@/entities/appointments";
import {
  AppointmentFillPatient,
  AppointmentPatient,
} from "@/entities/appointments";
import type { MyProfileForm } from "@/entities/myProfile";
import { Button, Island } from "@/shared/components";
// import { AppointmentOffer } from "./AppointmentOffer";
import { patientProfileApi } from "@/shared/api/patient/profile";
import { FamilyMember, patientFamilyApi } from "@/shared/api/patient/family";

export const AppointmentChoosePatient: FC<AppointmentPatientsDialogProps> = ({
  handleGoNext,
  handleBack,
}) => {
  const t = useTranslations("Common");
  const [addNew, setAddNew] = useState<boolean>(false);
  const [isAddRelative, setIsAddRelative] = useState<boolean>(true);
  // const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: myProfileData, refetch: refetchMyProfile } = useQuery(["getMyProfile"], () =>
    patientProfileApi?.getMyProfile()
  );

  const { data: myFamilyData, refetch: refetchFamily } = useQuery(["getMyFamilyForAppointment"], () =>
    patientFamilyApi?.getFamily()
  );

  const handleMyProfileGoNextClick = useCallback(() => {
    if (myProfileData?.data?.name) {
      handleGoNext?.(myProfileData?.data?.id);
    } else {
      setIsAddRelative(false);
      setAddNew(true);
    }
  }, [handleGoNext, myProfileData?.data]);

  // const handleAddRelativeSubmit = useCallback(
  //   (data) => {
  //     isAddRelative
  //       ? createFamilyMember({
  //           ...data,
  //           birth_date: data?.birth_date?.split(".").reverse().join("-"),
  //           isMine: false,
  //         })
  //       : updateMyProfile({
  //           ...data,
  //           id: myId,
  //           birth_date: data?.birth_date?.split(".").reverse().join("-"),
  //         });
  //     setAddNew(false);
  //     setIsAddRelative(true);
  //   },
  //   [createFamilyMember, isAddRelative, myId, updateMyProfile]
  // );

  return addNew ? (
    <AppointmentFillPatient
      handleBack={() => setAddNew(false)}
      isMyProfile={!isAddRelative}
      refetch={refetchFamily}
      refetchMyProfile={refetchMyProfile}
      // onSubmit={handleAddRelativeSubmit}
    />
  ) : (
    <Island className="flex flex-col !p-0">
      <div className="mb-2 flex items-center justify-start">
        <div
          className="flex cursor-pointer rounded-2xl bg-gray-2 px-5 py-2 text-Bold20"
          onClick={handleBack}
        >
          <ArrowLeftOutlined />
        </div>
        <div className="ml-9 text-Bold16"> {t("WhoWillBeAtTheReception")}</div>
      </div>
      {myFamilyData?.data?.family_members?.map((myFamilyProfile) => (
        <AppointmentPatient
          key={myFamilyProfile.id}
          relativeInfo={myFamilyProfile}
          handleGoNext={myFamilyProfile?.is_mine ? handleMyProfileGoNextClick :  handleGoNext}
        />
      ))}
      <Button
        className="flex cursor-pointer items-center justify-start"
        variant="tertiary"
        onClick={() => {
          setAddNew(true);
        }}
      >
        <PlusOutlined className="ml-4 text-Medium14" />
        <div className="ml-8">{t("AddFamilyMember")}</div>
      </Button>

      <div className="w-full py-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            handleGoNext?.();
            // setIsOpen(true);
          }}
        >
          {t("Next")}
        </Button>
      </div>
      {/* <AppointmentOffer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLoading={false}
        handleGoToNextPage={() => handleGoNext?.()}
      /> */}
    </Island>
  );
};
