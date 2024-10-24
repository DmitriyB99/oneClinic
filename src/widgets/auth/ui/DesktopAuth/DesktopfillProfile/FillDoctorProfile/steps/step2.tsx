import type { FC } from "react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";

import { Button as AntButton } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";

import type { DoctorClinicModel } from "@/entities/desktopDrawer";
import { DesktopAddDoctorWorkPlaceDrawer } from "@/entities/desktopDrawer";
import { UploadAvatar } from "@/entities/desktopFillProfile";
import { WorkplaceCard } from "@/entities/desktopSetting";
import { doctorsApi } from "@/shared/api";
import { dictionaryApi } from "@/shared/api/dictionary";
import {
  Button,
  DatePicker,
  DesktopInputText,
  PlusIcon,
  Select,
  UserLoginIcon,
} from "@/shared/components";
import type {
  DoctorDataFillModel,
  RegistrationStepModel,
} from "@/widgets/auth";

const setWorkPlacesData = (workPlaces: DoctorClinicModel[]) =>
  workPlaces.map((workPlace) => ({
    clinicId: workPlace.clinicId?.value,
    cityId: workPlace.cityId?.value,
    workPeriod: workPlace.workPeriod,
  }));

export const Step2FillDoctorProfile: FC<
  RegistrationStepModel<DoctorDataFillModel>
> = ({ next, reset }) => {
  const [workExperience, setWorkExperience] = useState<number>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [workPlaces, setWorkPlaces] = useState<DoctorClinicModel[]>([]);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");

  const {
    control,
    handleSubmit,
    reset: resetDoctorData,
    setValue,
    register,
    formState: { errors },
  } = useForm<DoctorDataFillModel>();

  register("clinics", {
    required: tDesktop("SpecifyPlaceOfWork"),
  });

  const { data: specialities } = useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((res) =>
      res.data.result.map(({ code, name }) => ({
        value: code,
        label: name,
      }))
    )
  );

  const { data: DoctorProfileData } = useQuery(
    ["getDoctorProfileInfo"],
    () =>
      doctorsApi.getMyDoctorProfile().then(({ data }) => ({
        iin: data.iin,
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        specialityCodes: data.specialityCodes,
        photoUrl: data.photoUrl,
      })),
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSuccess: ({ photoUrl, ...data }) => {
        resetDoctorData?.(data);
      },
    }
  );

  const setWorkExperienceData = useCallback(
    (year: Dayjs | null, yearString: string | null) => {
      if (!yearString) {
        setWorkExperience(undefined);
        return resetDoctorData?.((formValues) => ({
          ...formValues,
          workExperience: undefined,
        }));
      }
      const workExperienceCalculation = dayjs().year() - parseInt(yearString);
      setWorkExperience(workExperienceCalculation);
      setValue?.("workExperience", workExperienceCalculation);
    },
    [setValue, resetDoctorData]
  );

  const addData = useCallback(
    (workPlace: DoctorClinicModel) => {
      setWorkPlaces((prev) => [...prev, workPlace]);
      setValue?.("clinics", setWorkPlacesData([...workPlaces, workPlace]));
    },
    [workPlaces, setValue]
  );

  const removeData = useCallback(
    (id?: string) => {
      const newWorkPlace = workPlaces.filter(
        (workPlace) => workPlace.clinicId?.value !== id
      );
      setWorkPlaces(newWorkPlace);
      setValue?.("clinics", setWorkPlacesData(newWorkPlace));
    },
    [workPlaces, setValue]
  );

  const onSubmit = useCallback(
    (data: DoctorDataFillModel) => {
      reset?.(data);
      next?.();
    },
    [reset, next]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-2 text-gray-4">
        {tDesktop("SpecifyYourselfAndExperienceInfo")}
      </div>
      <UploadAvatar title={t("Photo")} imgUrl={DoctorProfileData?.photoUrl} />
      <div className="mt-6 text-Regular14 ">{t("LastName")}</div>
      <Controller
        control={control}
        name="lastName"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-2"
            label={tDesktop("EnterYourSurname")}
            desktopDrawer
            icon={<UserLoginIcon size="sm" />}
            isError={!!errors?.lastName}
            bottomText={errors?.lastName?.message}
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <div className="mt-6 text-Regular14 ">{t("FirstName")}</div>
      <Controller
        control={control}
        name="firstName"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-2"
            label={tDesktop("EnterYourName")}
            desktopDrawer
            icon={<UserLoginIcon size="sm" />}
            showAsterisk={false}
            isError={!!errors?.firstName}
            bottomText={errors?.firstName?.message}
            {...field}
          />
        )}
      />
      <div className="mt-6 text-Regular14 ">{t("PatronymicName")}</div>
      <Controller
        control={control}
        name="fatherName"
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-2"
            label={tDesktop("EnterYourFatherName")}
            desktopDrawer
            icon={<UserLoginIcon size="sm" />}
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <div className="mt-6 text-Regular14 ">{tDesktop("YourIIN")}</div>
      <Controller
        control={control}
        name="iin"
        rules={{
          required: t("RequiredField"),
          minLength: {
            value: 12,
            message: t("RequiredIINLength"),
          },
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-2"
            type="number"
            maxLength={12}
            inputClassName="pl-3"
            label={tDesktop("EnterYourIIN")}
            desktopDrawer
            readOnly
            showAsterisk={false}
            isError={!!errors?.iin}
            bottomText={errors?.iin?.message}
            {...field}
          />
        )}
      />
      <div className="mt-6 text-Regular14 ">{t("SinceWhatYearWorking")}</div>
      <Controller
        control={control}
        name="workExperience"
        rules={{
          required: t("RequiredField"),
        }}
        render={() => (
          <DatePicker
            onChange={setWorkExperienceData}
            className="mt-2 w-full"
            size="large"
            picker="year"
            isError={!!errors?.workExperience}
            bottomText={errors?.workExperience?.message}
          />
        )}
      />
      {workExperience && (
        <div className="mt-1 text-Regular14 text-secondaryText">
          {t("WorkExperienceYears", { workExperience })}
        </div>
      )}
      <div className="mt-6 text-Bold20">{t("PlaceOfWork")}</div>
      {workPlaces.map((workPlace) => (
        <WorkplaceCard
          key={workPlace.clinicId?.value}
          address={workPlace.cityId?.label}
          title={workPlace.clinicId?.label}
          trashClick={() => removeData(workPlace.clinicId?.value)}
        />
      ))}
      <AntButton
        className="mt-4 flex h-fit items-center gap-1 rounded-2xl bg-brand-light px-3 py-2 text-Regular14"
        onClick={() => setOpenDrawer(true)}
      >
        {t("Add")} <PlusIcon size="xs" />
      </AntButton>
      <div className="mt-1 text-Regular14 text-red">
        {errors.clinics?.message}
      </div>
      <div className="mt-6 text-Bold20">{tDesktop("YourSpecializations")}</div>
      <Controller
        control={control}
        name="specialityCodes"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <Select
            mode="multiple"
            className="mt-2 w-full"
            placeholder={t("SelectSpecialties")}
            size="large"
            options={specialities ?? []}
            isError={!!errors?.specialityCodes}
            bottomText={errors?.specialityCodes?.message}
            {...field}
          />
        )}
      />
      {/* TODO: add when Bizhan add service */}
      {/* <div className="mt-6 text-Bold20">Контакты</div>
        <DesktopInputText
          wrapperClassName="text-Regular16 mt-5"
          inputClassName="pl-3"
          label="Введите ваш номер"
          desktopDrawer
          showAsterisk={false}
          isPhone
          name="phone"
          onChange={(event) => setPhoneNumbers(event.target.value)}
        />
        <div className="mt-1 text-Regular14 text-secondaryText">
          Отправим ссылку на регистрацию и скачивание мобильного приложения
        </div> */}
      <Button className="mb-20 mt-11 !h-10 w-full rounded-lg" htmlType="submit">
        {t("Next")}
      </Button>
      <DesktopAddDoctorWorkPlaceDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        addData={addData}
      />
    </form>
  );
};
