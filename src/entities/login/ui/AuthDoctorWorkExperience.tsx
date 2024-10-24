import type { FC } from "react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import { PlusOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import type {
  AuthDoctorWorkExperienceModel,
  SpecializationsListType,
  WorkplaceModel,
} from "@/entities/login";
import {
  AuthDoctorSpecializationsDialog,
  AuthDoctorWorkPlaceDialog,
  AuthDoctorWorkplaceScheduleDialog,
  specialties,
} from "@/entities/login";
import {
  ArrowLeftIcon,
  Button,
  CloseIcon,
  DefaultCell,
  DividerSaunet,
  IconPlaceholder,
  InputText,
  Island,
  Navbar,
} from "@/shared/components";

export const AuthDoctorWorkExperience: FC<AuthDoctorWorkExperienceModel> = ({
  back,
  next,
  isUsedInAuth = true,
  control,
  setValue,
  specialityCodes,
  clinics,
  clinicsData,
}) => {
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");

  const [openSpecializationsDialog, setOpenSpecializationsDialog] =
    useState<boolean>(false);
  const [openWorkPlaceDialog, setOpenWorkPlaceDialog] =
    useState<boolean>(false);
  const [activeWorkplaceId, setActiveWorkplaceId] = useState<string>("");
  const [openWorkplaceScheduleDialog, setOpenWorkplaceScheduleDialog] =
    useState<boolean>(false);
  const [workPlaces, setWorkPlaces] = useState<WorkplaceModel[]>([]);

  useEffect(() => {
    setWorkPlaces(
      clinicsData?.map((clinic) => {
        const actualClinic = clinics?.find(
          (profileClinic) => profileClinic?.clinicId === clinic?.clinicId
        );

        return {
          ...clinic,
          workPeriods: actualClinic?.workPeriod ?? [],
          checked:
            clinics?.some(
              (workClinic) => workClinic?.clinicId === clinic?.clinicId
            ) ?? false,
        };
      }) ?? []
    );
  }, [clinics, clinicsData]);

  const [specializations, setSpecializations] = useState<
    SpecializationsListType[]
  >(
    specialties.map((speciality, index) => ({
      speciality,
      checked: false,
      id: index,
    }))
  );

  useEffect(() => {
    setSpecializations((prev) => {
      const newSpecialties = (specialityCodes ?? [])?.map(
        (speciality, index) => ({
          speciality,
          checked: true,
          id: prev.length + index + 1,
        })
      ) as SpecializationsListType[];
      return [...prev, ...newSpecialties];
    });
  }, [specialityCodes]);

  const activeWorkplace = useMemo(
    () =>
      workPlaces?.find(
        (workPlace) => workPlace?.clinicId === activeWorkplaceId
      ),
    [activeWorkplaceId, workPlaces]
  );

  const checkedWorkplaces = useMemo(
    () => workPlaces?.filter((workPlace) => workPlace.checked),
    [workPlaces]
  );

  const handleNextClick = useCallback(
    (updatedWorkplace?: WorkplaceModel) => {
      const response = checkedWorkplaces?.map((workPlace) => {
        const clinicData = clinics?.find(
          (clinic) => clinic?.clinicId === workPlace?.clinicId
        );

        if (workPlace?.clinicId === updatedWorkplace?.clinicId) {
          return {
            ...clinicData,
            cityId: workPlace?.cityId ?? "",
            clinicId: workPlace?.clinicId ?? "",
            workPeriod: updatedWorkplace?.workPeriods ?? [],
          };
        }

        return {
          ...clinicData,
          cityId: workPlace?.cityId ?? "",
          clinicId: workPlace?.clinicId ?? "",
          workPeriod: workPlace?.workPeriods ?? [],
        };
      });

      setWorkPlaces((prev) =>
        prev.map((place) => {
          if (place?.clinicId === updatedWorkplace?.clinicId) {
            return updatedWorkplace;
          }

          return place;
        })
      );

      setValue?.("clinics", response);
      setValue?.(
        "specialityCodes",
        specializations
          ?.filter((speciality) => speciality?.checked)
          ?.map((speciality) => speciality?.speciality)
      );
      next?.();
    },
    [checkedWorkplaces, clinics, next, setValue, specializations]
  );

  return (
    <>
      <Island
        className={clsx("mb-2 bg-white", {
          "mt-2": !isUsedInAuth,
        })}
      >
        {isUsedInAuth ? (
          <Navbar
            title={t("WorkExperience")}
            className="mb-4"
            description="Шаг 1 из 6"
            buttonIcon={<ArrowLeftIcon />}
            leftButtonOnClick={back}
          />
        ) : (
          <div className="mb-6 text-Bold20">{t("WorkExperience")}</div>
        )}
        <Controller
          control={control}
          name="workExperience"
          rules={{
            required: tMob("EnterWorkExperience"),
          }}
          render={({ field }) => (
            <InputText
              type="number"
              label={tMob("WhatYearHaveYouBeenWorkingSince")}
              showAsterisk={false}
              wrapperClassName="my-6"
              {...field}
              value={String(field.value ?? "")}
              onChange={(event) => {
                const value = parseInt(event.target.value ?? "");
                field.onChange(isNaN(value) ? "" : value);
              }}
            />
          )}
        />
      </Island>
      <Island className="mb-2">
        <div className="mb-4 text-Bold20">{t("PlaceOfWork")}</div>
        {checkedWorkplaces?.map((workPlace) => (
          <Fragment key={workPlace.clinicId}>
            <DefaultCell
              hideMainIcon
              title={workPlace?.name}
              subheading="10:00 - 18:00"
              caption={workPlace?.address ?? ""}
              rightElement={<IconPlaceholder color="gray-icon" />}
              className="cursor-pointer"
              onClick={() => {
                setActiveWorkplaceId(workPlace?.clinicId);
                setOpenWorkplaceScheduleDialog(true);
              }}
            />
            <DividerSaunet className="my-2" />
          </Fragment>
        ))}
        <Button
          variant="tertiary"
          className="h-fit !p-0"
          onClick={() => setOpenWorkPlaceDialog(true)}
        >
          <div className="mt-3 flex h-8 w-fit items-center rounded-2xl bg-lightRed px-3 py-2 text-Medium14 text-crimson">
            <div className="mr-1">{t("Add")}</div> <PlusOutlined />
          </div>
        </Button>
      </Island>
      <Island className="rounded-b-none">
        <div className="text-Bold20">{tMob("YourSpecializations")}</div>
        <div className="flex flex-wrap">
          {specializations
            .filter((specialization) => specialization.checked)
            .map((specialization) => (
              <div
                key={specialization.id}
                className="mr-2 mt-3 flex h-8 w-fit items-center rounded-xl bg-pink px-3 py-2 text-Medium14"
              >
                <div className="mr-1 text-darkPurple">
                  {specialization.speciality}
                </div>
                <Button
                  variant="tertiary"
                  className="h-fit w-fit !p-0"
                  onClick={() => {
                    setSpecializations(
                      specializations.filter(
                        (item) => item?.id !== specialization?.id
                      )
                    );
                  }}
                >
                  <CloseIcon
                    size="xs"
                    className="cursor-pointer text-darkPurple"
                  />
                </Button>
              </div>
            ))}
          <Button
            variant="tertiary"
            className="h-fit !p-0"
            onClick={() => setOpenSpecializationsDialog(true)}
          >
            <div className="mt-3 flex h-8 w-fit items-center rounded-2xl bg-lightRed px-3 py-2 text-Medium14 text-crimson">
              <div className="mr-1">{t("Add")}</div> <PlusOutlined />
            </div>
          </Button>
        </div>
      </Island>
      {isUsedInAuth && (
        <div className="absolute bottom-5 w-full px-4">
          <Button className="w-full" onClick={() => handleNextClick()}>
            Далее
          </Button>
        </div>
      )}
      <AuthDoctorSpecializationsDialog
        openSpecializationsDialog={openSpecializationsDialog}
        setOpenSpecializationsDialog={setOpenSpecializationsDialog}
        setSpecializations={setSpecializations}
        specializations={specializations}
      />
      <AuthDoctorWorkPlaceDialog
        workPlaces={workPlaces}
        setWorkPlaces={setWorkPlaces}
        openWorkPlaceDialog={openWorkPlaceDialog}
        setOpenWorkPlaceDialog={(isOpen) => {
          // if (!isOpen) handleNextClick();
          setOpenWorkPlaceDialog(isOpen);
        }}
      />
      <AuthDoctorWorkplaceScheduleDialog
        openWorkplaceScheduleDialog={openWorkplaceScheduleDialog}
        setOpenWorkplaceScheduleDialog={setOpenWorkplaceScheduleDialog}
        activeWorkplace={activeWorkplace}
        workHereButton
        onWorkPeriodChanged={handleNextClick}
      />
    </>
  );
};
