import { useCallback, useEffect, useState } from "react";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";

import { Radio } from "antd";
import { useTranslations } from "next-intl";

import { GetShortByValue, SearchByInfo } from "@/entities/desktopDrawer";
import type {
  FindUserByShortModel,
  NewBookingDataSearchProps,
} from "@/entities/desktopDrawer";
import { myProfileApi } from "@/shared/api/myProfile";
import {
  AutoComplete,
  DesktopInputText,
  RadioSaunet,
} from "@/shared/components";

export const NewBookingDataSearch: FC<NewBookingDataSearchProps> = ({
  setSearchSubmit,
  setSubmit,
  setUserDataForm,
  setIsLoading,
}) => {
  const { control, handleSubmit } = useForm<FindUserByShortModel>();
  const [value, setValue] = useState<SearchByInfo>(SearchByInfo.IIN);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Bookings");

  const { isLoading, data: allUsersNames } = useQuery(
    ["getAllUsersNames"],
    () =>
      myProfileApi.getUserDataByShort().then((data) =>
        data.data.content.map(({ fullname, userId }) => ({
          label: fullname,
          value: fullname,
          key: userId,
        }))
      )
  );

  useEffect(() => setIsLoading(isLoading), [isLoading, setIsLoading]);

  const getUserDataSubmit = useCallback(
    async ({ searchData }: FindUserByShortModel) => {
      const { data: UserData } = await myProfileApi.getUserDataByShort(
        GetShortByValue[value],
        searchData
      );
      setSearchSubmit(true);
      if (UserData.content[0]) {
        setUserDataForm(UserData.content[0]);
        setSubmit(true);
      }
    },
    [value, setSubmit, setSearchSubmit, setUserDataForm]
  );

  const handleOnSubmit = useCallback(() => {
    handleSubmit(getUserDataSubmit)();
  }, [handleSubmit, getUserDataSubmit]);

  return (
    <>
      <Radio.Group
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        <RadioSaunet value={SearchByInfo.IIN}>
          {tDesktop("SearchByIIN")}
        </RadioSaunet>
        <RadioSaunet value={SearchByInfo.PhoneNumber}>
          {t("PhoneNumber")}
        </RadioSaunet>
        <RadioSaunet value={SearchByInfo.Fullname}>
          {t("PatientFullName")}
        </RadioSaunet>
      </Radio.Group>
      <div className="mb-2 mt-6 text-Regular14 capitalize">
        {t(value)} {t("Patient's")}
      </div>
      {value !== SearchByInfo.Fullname ? (
        <Controller
          control={control}
          rules={{ required: tDesktop("EnterPatientDetails") }}
          render={({ field }) => (
            <DesktopInputText
              label="patientSearch"
              desktopDrawer
              isPhone={value === SearchByInfo.PhoneNumber}
              type="number"
              maxLength={12}
              placeholder={tDesktop("EnterPatientValue", { value: t(value) })}
              showAsterisk={false}
              inputClassName="pl-3"
              {...field}
              enterBtnClick={handleOnSubmit}
            />
          )}
          name="searchData"
        />
      ) : (
        <Controller
          control={control}
          rules={{ required: tDesktop("EnterPatientDetails") }}
          render={({ field }) => (
            <AutoComplete
              className="w-full"
              onChange={(value) => field.onChange(value)}
              options={allUsersNames}
              onSelect={handleOnSubmit}
            />
          )}
          name="searchData"
        />
      )}
    </>
  );
};
