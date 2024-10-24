import type { ChangeEvent, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { notification } from "antd";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type {
  MyProfileForm,
  MyProfilePhotoUpdateModel,
} from "@/entities/myProfile";
import {
  ArrowLeftIcon,
  Avatar,
  Button,
  CameraIcon,
  DataPickerInputText,
  InputText,
  Island,
  Navbar,
  SegmentedControl,
} from "@/shared/components";
import { formatKazakhstanPhoneNumber } from "@/shared/utils";
import { MainLayout } from "@/shared/layout";
import { patientProfileApi } from "@/shared/api/patient/profile";

export default function ProfileEdit() {
  const t = useTranslations("Common");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, reset } = useForm<MyProfileForm>();
  const {
    data: myProfileData,
    refetch,
    isLoading,
  } = useQuery(["getMyProfile"], () => patientProfileApi?.getMyProfile());
  const {
    surname,
    name,
    phone,
    photo_url,
    gender,
    father_name,
    birth_date,
    iin,
    id,
  } = useMemo(() => myProfileData?.data ?? {}, [myProfileData?.data]);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true); // состояние для индикатора загрузки

  const { mutate: updateMyProfile } = useMutation(
    ["updateMyProfile"],
    (updatedProfile: MyProfileForm) =>
      patientProfileApi.updateMyProfile(updatedProfile),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const { mutate: updateMyProfilePhoto } = useMutation(
    ["updateMyProfilePhoto"],
    (updateProfilePhoto: MyProfilePhotoUpdateModel) =>
      patientProfileApi?.updateMyPhoto(updateProfilePhoto).then(() => {
        refetch();
      })
  );

  const onSubmit = useCallback(
    async (inputs: MyProfileForm) => {
      try {
        await updateMyProfile({
          ...inputs,
          id: id ?? "",
          birth_date: inputs?.birth_date?.split(".").reverse().join("-"),
          phone: formatKazakhstanPhoneNumber(String(inputs?.phone)),
        });
        router.back();
      } catch (err: unknown) {
        notification?.error({
          message: t("Error"),
        });
      }
    },
    [id, router, t, updateMyProfile]
  );
  const handleOnSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  useEffect(() => {
    if (photo_url) {
      setAvatar(photo_url);
      setIsLoadingAvatar(false); 
    }
  }, [photo_url]);

  useEffect(() => {
    reset({
      name: name ?? "",
      surname: surname ?? "",
      gender: gender ?? "male",
      father_name: father_name ?? "",
      birth_date: birth_date
        ? dayjs(birth_date)?.format("DD.MM.YYYY")
        : undefined,
      phone: phone ?? "",
      id: id ?? "",
      iin: iin ?? "",
    });
  }, [birth_date, id, iin, gender, name, father_name, phone, reset, surname]);

  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      await updateMyProfilePhoto({
        id: id ?? "",
        file: event.target.files?.item(0),
      });
      setAvatar(URL.createObjectURL(event.target.files?.item(0)));
      setIsLoadingAvatar(false); 
    },
    [id, updateMyProfilePhoto]
  );

  return (
    <div className="bg-gray-0">
      <Island className="mb-2 !px-0 pb-6">
        <Navbar
          title={t("MyProfile")}
          leftButtonOnClick={() => router?.back()}
          buttonIcon={<ArrowLeftIcon />}
          className="!p-0"
        />
        <div
          className="mt-2 flex cursor-pointer justify-center"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          <Avatar
            size="xl"
            src={
              avatar ?? (
                <div className="bg-gray-0">
                  <CameraIcon
                    color="gray-icon"
                    width={100}
                    height={100}
                    className="mt-10"
                  />
                </div>
              )
            }
          />
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileUpload}
        />
      </Island>
      <Island>
        <div className="text-Bold20">{t("Data")}</div>
        <Controller
          control={control}
          defaultValue={"male"}
          render={({ field }) => (
            <div className="my-6">
              <SegmentedControl
                options={[t("Man"), t("Woman")]}
                size="l"
                value={field?.value === "male" ? t("Man") : t("Woman")}
                onChange={(value) => {
                  field.onChange(value === t("Man") ? "male" : "female");
                }}
              />
            </div>
          )}
          name="gender"
        />
        <Controller
          control={control}
          rules={{ required: t("FillInLastName") }}
          render={({ field }) => (
            <InputText
              label={t("LastName")}
              name="lastName"
              wrapperClassName="mb-6"
              showAsterisk={false}
              value={field.value}
              onChange={(event) => {
                field.onChange((event?.target as HTMLInputElement).value);
              }}
            />
          )}
          name="surname"
        />
        <Controller
          control={control}
          rules={{ required: t("FillInFirstName") }}
          render={({ field }) => (
            <InputText
              label={t("FirstName")}
              name="firstName"
              wrapperClassName="mb-6"
              value={field.value}
              showAsterisk={false}
              onChange={(event) => {
                field.onChange((event?.target as HTMLInputElement).value);
              }}
            />
          )}
          name="name"
        />
        <Controller
          control={control}
          rules={{ required: t("FillPatronymicName") }}
          render={({ field }) => (
            <InputText
              label={t("PatronymicName")}
              name="patronymicName"
              value={field.value}
              wrapperClassName="mb-6"
              showAsterisk={false}
              onChange={(event) => {
                field.onChange((event?.target as HTMLInputElement).value);
              }}
            />
          )}
          name="father_name"
        />
        <Controller
          control={control}
          rules={{
            required: t("FillInIIN"),
          }}
          render={({ field }) => (
            <InputText
              type="number"
              label={t("IIN")}
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
              format="DD.MM.YYYY"
              onChange={(dateString) =>
                field.onChange(dateString?.format("DD.MM.YYYY"))
              }
              value={field?.value ? dayjs(field.value, "DD.MM.YYYY") : null}
              className="mb-6"
            />
          )}
          name="birth_date"
        />
        <Controller
          control={control}
          rules={{ required: t("FillInYourphone") }}
          render={({ field }) => (
            <InputText
              label={t("phone")}
              isPhone
              name="phone"
              wrapperClassName="mb-6"
              value={formatKazakhstanPhoneNumber(field.value ?? "")}
              showAsterisk={false}
              onChange={(event) => {
                field.onChange((event?.target as HTMLInputElement).value);
              }}
            />
          )}
          name="phone"
        />
        <Button variant="primary" className="w-full" onClick={handleOnSubmit}>
          {t("Ready")}
        </Button>
      </Island>
    </div>
  );
}

ProfileEdit.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="bg-white">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
