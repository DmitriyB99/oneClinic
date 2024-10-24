import type { FC } from "react";
import { useCallback, useState } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "react-query";

import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { dictionaryApi } from "@/shared/api/dictionary";
import {
  Button,
  DatePicker,
  DesktopInputText,
  InputCopy,
  Select,
  UserLoginIcon,
} from "@/shared/components";
import type {
  ClinicDoctorDataFillModel,
  RegistrationStepModel,
} from "@/widgets/auth";

export const Step2ClinicFillDoctorProfile: FC<
  RegistrationStepModel<ClinicDoctorDataFillModel>
> = ({ next, setValue, control }) => {
  const [workExperience, setWorkExperience] = useState<number>();

  const { data: specialities } = useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((res) =>
      res.data.result.map(({ code, name }) => ({
        value: code,
        label: name,
      }))
    )
  );

  const setWorkExperienceData = useCallback(
    (year: Dayjs | null, yearString: string) => {
      const workExperienceCalculation = dayjs().year() - parseInt(yearString);
      setWorkExperience(workExperienceCalculation);
      setValue?.("workExperience", workExperienceCalculation);
    },
    [setValue]
  );

  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Staff");

  return (
    <>
      <div className="mt-2 text-gray-4">
        {tDesktop("ProvideInformationAboutDoctorAndHisExperience")}
      </div>
      <div className="mb-2 mt-6 text-Regular14">
        {tDesktop("ShareLinkAndInviteDoctorToDownloadApp")}
      </div>
      <InputCopy content="https://invite.oneclinic.com/@oneclinic-invite" />
      <div className="mt-6 text-Bold20">{t("PersonalInfo")}</div>
      <Controller
        control={control}
        name="lastName"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-6"
            label={t("LastName")}
            desktopDrawer
            icon={<UserLoginIcon size="sm" />}
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="firstName"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-6"
            label={t("FirstName")}
            desktopDrawer
            icon={<UserLoginIcon size="sm" />}
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="fatherName"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-6"
            label={t("PatronymicName")}
            desktopDrawer
            icon={<UserLoginIcon size="sm" />}
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="iin"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-6"
            type="number"
            maxLength={12}
            inputClassName="pl-3"
            label={tDesktop("DoctorIIN")}
            desktopDrawer
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <DatePicker
        onChange={setWorkExperienceData}
        className="mt-6 w-full"
        size="large"
        picker="year"
        placeholder={tDesktop("SinceWhatYearWorkingDoctorWorkExperience")}
      />
      {workExperience && (
        <div className="mt-1 text-Regular14 text-secondaryText">
          {t("WorkExperienceYears", { workExperience })}
        </div>
      )}
      <div className="mt-6 text-Bold20">{t("Specialty")}</div>
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
            {...field}
          />
        )}
      />
      <div className="mt-6 text-Bold20">{t("Contacts")}</div>
      <Controller
        control={control}
        name="email"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-5"
            inputClassName="pl-3"
            label={t("Email")}
            desktopDrawer
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="phoneNumber"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-5"
            isPhone
            inputClassName="pl-3"
            label={tDesktop("DoctorPhoneNumber")}
            placeholder={tDesktop("DoctorPhoneNumber")}
            desktopDrawer
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <div className="mt-0.5 text-Regular14 text-gray-4">
        {tDesktop("WillSendLinkToRegister")}
      </div>
      <Button
        className="mb-20 mt-11 !h-10 w-full rounded-lg"
        onClick={() => next?.()}
      >
        {t("Next")}
      </Button>
    </>
  );
};
