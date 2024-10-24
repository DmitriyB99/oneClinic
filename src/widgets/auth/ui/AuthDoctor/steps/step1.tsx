import type { FC } from "react";
import { useMemo } from "react";
import { Controller } from "react-hook-form";

import { useTranslations } from "next-intl";

import { ArrowLeftIcon, Button, InputText, Navbar } from "@/shared/components";
import type {
  DoctorRegistrationModel,
  RegistrationStepModel,
} from "@/widgets/auth/models";

export const Step1DoctorAuth: FC<
  RegistrationStepModel<DoctorRegistrationModel>
> = ({ back, next, control, watch }) => {
  const t = useTranslations("Common");

  const lastName = watch?.("lastName");
  const firstName = watch?.("firstName");
  const isEnabled = useMemo(() => lastName && firstName, [firstName, lastName]);
  //TODO check hookForm
  return (
    <div className="p-4">
      <Navbar
        title={t("Registration")}
        description={t("StepSomeOfSome", { step: 1, allStep: 2 })}
        className="px-0"
        buttonIcon={<ArrowLeftIcon />}
        leftButtonOnClick={back}
      />
      <div>
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: t("InsertSurname"),
          }}
          render={({ field }) => (
            <InputText
              label={t("LastName")}
              wrapperClassName="my-6"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: t("InsertName"),
          }}
          render={({ field }) => (
            <InputText
              label={t("FirstName")}
              wrapperClassName="my-6"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="fatherName"
          // rules={{
          //   required: t("FillPatronymicName"),
          // }}
          render={({ field }) => (
            <InputText
              label={t("PatronymicInPresenceOf")}
              wrapperClassName="my-6"
              showAsterisk={false}
              {...field}
            />
          )}
        />
        <div className="absolute bottom-0 left-0 my-5 w-full px-4">
          <Button
            block
            variant="secondary"
            className="w-full"
            onClick={next}
            disabled={!isEnabled}
          >
            {t("Next")}
          </Button>
        </div>
      </div>
    </div>
  );
};
