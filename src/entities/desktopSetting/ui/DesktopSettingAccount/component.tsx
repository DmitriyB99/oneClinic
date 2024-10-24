import type { FC, MouseEvent } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "react-query";

import { Spin } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { DoctorClinicModel } from "@/entities/desktopDrawer";
import { DesktopAddDoctorWorkPlaceDrawer } from "@/entities/desktopDrawer";
import { UploadAvatar } from "@/entities/desktopFillProfile";
import type { DesktopSettingPageProps } from "@/entities/desktopSetting";
import { doctorsApi } from "@/shared/api";
import { clinicsApi } from "@/shared/api/clinics";
import { dictionaryApi } from "@/shared/api/dictionary";
import {
  Button,
  DatePicker,
  DesktopInputText,
  DividerSaunet,
  PlusIcon,
  Select,
  UserLoginIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import type { ClinicModel } from "@/widgets/auth";

import { WorkplaceCard } from "./workplaceCard";

export const DesktopSettingAccount: FC<DesktopSettingPageProps> = ({
  control,
  reset,
  setValue,
}) => {
  const { user } = useContext(UserContext);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Settings");
  const [open, setOpen] = useState(false);
  const [workStartYear, setWorkStartYear] = useState(0);
  const [currentWorkPlaceData, setCurrentWorkPlaceData] =
    useState<ClinicModel>();
  const [allWorkPlaceData, setAllWorkPlaceData] = useState<ClinicModel[]>([]);
  const { isLoading: isDoctorLoading } = useQuery(
    ["getDoctorProfileInfo"],
    () =>
      doctorsApi
        .getDoctorProfileInfoById(user?.role_id ?? "")
        .then(({ data }) => ({
          lastName: data?.lastName,
          firstName: data?.firstName,
          fatherName: data?.fatherName,
          iin: data.iin,
          email: data.email,
          phoneNumber: data.phoneNumber,
          workExperience: data.workExperience,
          clinicInfos: data.clinicInfos,
          specialityCodes: data.specialityCodes,
          photoUrl: data.photoUrl,
        })),
    {
      enabled: user?.role === "doctor",
      onSuccess: ({ clinicInfos, workExperience, ...data }) => {
        reset(data);
        setAllWorkPlaceData(clinicInfos ?? []);
        setWorkStartYear(dayjs().year() - (workExperience ?? 0));
      },
    }
  );

  useEffect(() => {
    if (user?.role === "doctor") {
      setValue?.("clinics", allWorkPlaceData);
    }
  }, [allWorkPlaceData, setValue, user]);

  const { data: DoctorProfilePhoto } = useQuery(
    ["getDoctorProfilePhoto"],
    () => doctorsApi.getMyDoctorProfile().then(({ data }) => data.photoUrl),
    {
      enabled: user?.role === "doctor",
    }
  );

  const { data: ClinicProfile, isLoading: isManagerLoading } = useQuery(
    ["getClinicProfileInfo"],
    () =>
      clinicsApi.getClinicMe().then(({ data }) => ({
        bin: data?.bin,
        email: data?.email,
        phoneNumbers: data?.phoneNumbers,
        iconUrl: data?.iconUrl,
      })),
    {
      enabled: user?.role === "clinic",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSuccess: ({ iconUrl, ...rest }) => {
        reset((formValues) => ({
          ...formValues,
          ...rest,
        }));
      },
    }
  );

  const { isLoading: isManagerNameLoading } = useQuery(
    ["getClinicInfoById"],
    () =>
      clinicsApi
        .getClinicInfoById(user?.role_id ?? "")
        .then((res) => res.data?.managerFullname?.split(" ")),
    {
      enabled: user?.role === "clinic",
      onSuccess: (data) => {
        reset((formValues) => ({
          ...formValues,
          lastName: data?.[0],
          firstName: data?.[1] ?? "",
          fatherName: data?.[2],
        }));
      },
    }
  );

  const accountHeader = useMemo(() => {
    if (user?.role === "doctor") {
      return <div className="text-Bold24">{t("MyAccount")}</div>;
    } else {
      return (
        <>
          <div className="text-Bold24">{tDesktop("AboutMe")}</div>
          <DividerSaunet />
        </>
      );
    }
  }, [user, t, tDesktop]);

  const DoctorClinicInfo = useMemo(
    () =>
      allWorkPlaceData.map((clinicInfo) => ({
        clinicName: clinicInfo.name,
        clinicCity: clinicInfo.city ? clinicInfo.city + " " : "",
        clinicStreet: clinicInfo.street ?? "",
        clinicInfo: clinicInfo,
      })),
    [allWorkPlaceData]
  );

  const { data: specialities } = useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((res) =>
      res.data.result.map(({ code, name }) => ({
        value: code,
        label: name,
      }))
    )
  );

  const addData = useCallback(
    (data: DoctorClinicModel, oldClinicId?: string) => {
      setCurrentWorkPlaceData(undefined);
      setOpen(false);
      if (oldClinicId) {
        return setAllWorkPlaceData((prev) => {
          const newList = prev.filter(
            (clinic) => clinic.clinicId !== oldClinicId
          );
          return [
            ...newList,
            {
              clinicId: data.clinicId?.value,
              name: data.clinicId?.label,
              cityId: data.cityId?.value,
              workPeriod: data.workPeriod,
              city: data.cityId?.label,
            },
          ];
        });
      }
      const isClinicExist = allWorkPlaceData.some(
        (clinic) => clinic.clinicId === data.clinicId?.value
      );
      if (isClinicExist) {
        return;
      }
      setAllWorkPlaceData((prev) => [
        ...prev,
        {
          clinicId: data.clinicId?.value,
          name: data.clinicId?.label,
          cityId: data.cityId?.value,
          workPeriod: data.workPeriod,
          city: data.cityId?.label,
        },
      ]);
    },
    [allWorkPlaceData]
  );

  return (
    <div className="w-full overflow-y-scroll pr-4">
      {isDoctorLoading || isManagerLoading || isManagerNameLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {accountHeader}
          <UploadAvatar
            imgUrl={ClinicProfile?.iconUrl ?? DoctorProfilePhoto}
            title={user?.role_id === "doctor" ? t("Photo") : t("Logo")}
          />
          <div className="mt-6 flex gap-4">
            <div className="w-full">
              <div>{t("LastName")}</div>
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <DesktopInputText
                    label={t("LastName")}
                    wrapperClassName="text-Regular16 mt-2"
                    desktopDrawer
                    innerClassName="!h-10"
                    icon={<UserLoginIcon size="sm" />}
                    showAsterisk={false}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <div>{t("FirstName")}</div>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <DesktopInputText
                    label={t("FirstName")}
                    wrapperClassName="text-Regular16 mt-2"
                    desktopDrawer
                    innerClassName="!h-10"
                    icon={<UserLoginIcon size="sm" />}
                    showAsterisk={false}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <div>{t("PatronymicName")}</div>
              <Controller
                control={control}
                name="fatherName"
                render={({ field }) => (
                  <DesktopInputText
                    label={t("PatronymicName")}
                    wrapperClassName="text-Regular16 mt-2"
                    desktopDrawer
                    innerClassName="!h-10"
                    icon={<UserLoginIcon size="sm" />}
                    showAsterisk={false}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <div className="w-full">
              <div>{user?.role === "doctor" ? t("IIN") : tDesktop("BIN")}</div>
              <Controller
                control={control}
                name={user?.role === "doctor" ? "iin" : "bin"}
                render={({ field }) => (
                  <DesktopInputText
                    label={user?.role === "doctor" ? t("IIN") : tDesktop("BIN")}
                    wrapperClassName="text-Regular16 mt-2"
                    inputClassName="pl-3"
                    desktopDrawer
                    innerClassName="!h-10"
                    maxLength={12}
                    type="number"
                    showAsterisk={false}
                    {...field}
                  />
                )}
              />
            </div>
            {user?.role === "doctor" && (
              <div className="w-full">
                <div>{t("SinceWhatYearWorking")}</div>
                <DatePicker
                  className="mt-2 w-full"
                  size="large"
                  picker="year"
                  value={dayjs().year(workStartYear)}
                  onChange={(value) => {
                    setWorkStartYear(value?.year() ?? 0);
                    setValue?.(
                      "workExperience",
                      dayjs().year() - (value?.year() ?? 0)
                    );
                  }}
                  placeholder={tDesktop("SpecifyWorkStartYear")}
                />
              </div>
            )}
          </div>
          {user?.role === "doctor" && (
            <>
              <div className="mt-10 text-Bold20">{t("PlaceOfWork")}</div>
              <div className="grid grid-cols-2 gap-5">
                {DoctorClinicInfo?.map((clinicInfo) => (
                  <WorkplaceCard
                    key={clinicInfo.clinicName}
                    address={`${clinicInfo?.clinicCity} ${clinicInfo.clinicStreet}`}
                    title={clinicInfo.clinicName}
                    onClick={() => {
                      setCurrentWorkPlaceData(clinicInfo.clinicInfo);
                      setOpen(true);
                    }}
                    trashClick={(event?: MouseEvent<HTMLDivElement>) => {
                      setAllWorkPlaceData((prev) =>
                        prev.filter(
                          (clinic) =>
                            clinic.clinicId !== clinicInfo.clinicInfo.clinicId
                        )
                      );
                      return event?.stopPropagation();
                    }}
                  />
                ))}
              </div>
              <Button
                className="mt-4 flex h-fit items-center gap-1 px-3 py-2"
                onClick={() => setOpen(true)}
              >
                {t("Add")} <PlusIcon size="xs" color="" />
              </Button>
              <div className="mt-10 text-Bold20">{t("Specialization")}</div>
              <Controller
                control={control}
                name="specialityCodes"
                render={({ field }) => (
                  <Select
                    className="mt-5 w-full"
                    size="large"
                    mode="multiple"
                    options={specialities ?? []}
                    {...field}
                  />
                )}
              />
            </>
          )}
          <div className="mt-10 text-Bold20">{t("Contacts")}</div>
          <div className="mb-6 mt-4 flex gap-3">
            <div className="w-full">
              <div>{t("Email")}</div>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <DesktopInputText
                    label={t("Email")}
                    wrapperClassName="text-Regular16 mt-2"
                    desktopDrawer
                    innerClassName="!h-10"
                    icon={<UserLoginIcon size="sm" />}
                    showAsterisk={false}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <div>{t("PhoneNumber")}</div>
              <Controller
                control={control}
                name={user?.role === "doctor" ? "phoneNumber" : "phoneNumbers"}
                render={({ field }) => (
                  <DesktopInputText
                    isPhone
                    label={t("PhoneNumber")}
                    wrapperClassName="text-Regular16 mt-2"
                    desktopDrawer
                    innerClassName="!h-10"
                    icon={<UserLoginIcon size="sm" />}
                    showAsterisk={false}
                    name={field.name}
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : field.value?.[0]?.phoneNumber
                    }
                    onChange={(event) =>
                      user?.role === "doctor"
                        ? field.onChange(event)
                        : field.onChange([{ phoneNumber: event.target.value }])
                    }
                  />
                )}
              />
              <DesktopAddDoctorWorkPlaceDrawer
                open={open}
                onClose={() => {
                  setOpen(false);
                  setCurrentWorkPlaceData(undefined);
                }}
                addData={addData}
                WorkPlaceData={currentWorkPlaceData}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
