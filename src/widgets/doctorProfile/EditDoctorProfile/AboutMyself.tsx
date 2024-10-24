import type { FC } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import dayjs from "dayjs";

import type { EditDoctorProfileForm } from "@/pages/myDoctor/editProfile";
import { DataPickerInputText, InputText, Island } from "@/shared/components";
import { systemDateWithoutTime } from "@/shared/config";

interface AboutMyselfProps {
  control: Control<EditDoctorProfileForm>;
}

export const AboutMyself: FC<AboutMyselfProps> = ({ control }) => (
  <Island className="mt-2">
    <div className="mb-3 text-Bold20">Данные</div>
    <Controller
      control={control}
      render={({ field }) => (
        <InputText
          label="Фамилия"
          showAsterisk={false}
          wrapperClassName="my-4"
          {...field}
        />
      )}
      name="lastName"
    />
    <Controller
      control={control}
      render={({ field }) => (
        <InputText
          label="Имя"
          showAsterisk={false}
          wrapperClassName="my-4"
          {...field}
        />
      )}
      name="firstName"
    />
    <Controller
      control={control}
      render={({ field }) => (
        <InputText
          label="Отчество"
          showAsterisk={false}
          wrapperClassName="my-4"
          {...field}
        />
      )}
      name="fatherName"
    />
    <Controller
      control={control}
      rules={{
        required: "Заполните ИИН",
      }}
      render={({ field }) => (
        <InputText
          type="number"
          label="ИИН"
          name="iin"
          wrapperClassName="mb-6"
          showAsterisk={false}
          value={field.value}
          onChange={(event) => {
            if (event.target.value.length <= 12) {
              field.onChange((event?.target as HTMLInputElement).value);
            }
          }}
        />
      )}
      name="iin"
    />
    <Controller
      control={control}
      render={({ field }) => (
        <DataPickerInputText
          clearIcon={false}
          format={systemDateWithoutTime}
          onChange={(dateString) =>
            field.onChange(dateString?.format(systemDateWithoutTime))
          }
          value={
            field?.value
              ? dayjs(field.value, systemDateWithoutTime)
              : dayjs("2001-01-01", systemDateWithoutTime)
          }
        />
      )}
      name="birthDate"
    />
    <Controller
      control={control}
      render={({ field }) => (
        <InputText
          label="Номер телефона"
          isPhone
          showAsterisk={false}
          wrapperClassName="my-4"
          {...field}
        />
      )}
      name="phoneNumber"
    />
  </Island>
);
