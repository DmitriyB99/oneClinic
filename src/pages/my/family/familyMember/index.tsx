import type { FC, ReactElement } from "react";
import { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { PatientInfoFillDialogProps } from "@/entities/appointments";
import {
  ArrowLeftIcon,
  Button,
  CloseIcon,
  DataPickerInputText,
  InputText,
  Island,
  Navbar,
  SegmentedControl,
  ShareIcon,
  SpinnerWithBackdrop,
} from "@/shared/components";
import { systemDateWithoutTime } from "@/shared/config";
import { FamilyMember, patientFamilyApi } from "@/shared/api/patient/family";
import { MainLayout } from "@/shared/layout";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Input } from "antd";
import { InputSelect } from "@/shared/components/molecules/input/InputSelect";
import { useMutation, useQuery } from "react-query";
import { dictionaryApi } from "@/shared/api/dictionary";

export default function AddFamilyMember() {
  const t = useTranslations("Common");
  const router = useRouter();
  const { control, handleSubmit } = useForm<FamilyMember>();

  const { mutate: createFamilyMember } = useMutation(
    ["createFamilyMember"],
    (data: FamilyMember) =>
      patientFamilyApi.createFamilyMember(data).then(() => {
        router.push(`/my/family`);
      })
  );

  const onSubmit = (data: FamilyMember) => {
    createFamilyMember(data);
  };

  const handleOnSubmit = useCallback(() => {
    handleSubmit(onSubmit, (errors) => {
      console.log("Validation errors: ", errors);
    })();
  }, [handleSubmit, onSubmit]);

  const { data: familyMembers } = useQuery(["getFamilyMembers"], () =>
    dictionaryApi.getFamilyMembers().then((response) =>
      response.data.result.map(
        (familyMemberType: { code: string; name: string }) => ({
          id: familyMemberType.code,
          name: familyMemberType.name ?? "No name",
        })
      )
    )
  );

  if (!familyMembers) {
    return <SpinnerWithBackdrop />;
  }

  return (
    <div>
      <Navbar
        title={"Добавить члена семьи"}
        leftButtonOnClick={() => router?.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="!m-0"
      />
      <Island className="rounded-t-none">
        <div className="text-Bold20 py-2">Поделитесь ссылкой</div>

        <div className="my-2 px-4 py-4 flex items-center justify-between rounded-xl bg-gray-2">
          <Input
            className="!border-none bg-gray-2 shadow-none	!text-Regular16 !text-black text-ellipsis overflow-hidden whitespace-nowrap"
            value={"http://localhost:3000/my/family/familyMember"}
          />
          <div
            onClick={() =>
              navigator.share({
                title: "Поделитесь ссылкой",
                text: "Так ваш близкий может самостоятельно присоедениться к вашей семье",
                url: window.location.href,
              })
            }
          >
            <ShareIcon className="mr-2" />
          </div>
        </div>
        <div className="text-Regular12 mt-2">
          Поделитесь ссылкой на приглашение, так ваш близкий может
          самостоятельно присоединиться к вашей семье
        </div>
      </Island>
      <Island className="mt-3 mb-3">
        <div className="flex items-center justify-start">
          <div className="ml-2 text-Bold24">Укажите данные</div>
        </div>
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
          rules={{
            required: t("FillInIIN"),
          }}
          render={({ field }) => (
            <InputText
              type="number"
              label={t("IIN")}
              name="iin"
              value={field.value}
              wrapperClassName="mb-6"
              showAsterisk={false}
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
          rules={{ required: t("FillInLastName") }}
          render={({ field }) => (
            <InputText
              label={t("LastName")}
              name="surname"
              value={field.value}
              wrapperClassName="mb-6"
              showAsterisk={false}
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
              value={field.value}
              wrapperClassName="mb-6"
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
              label={"Отчество"}
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
          render={({ field }) => (
            <InputText
              label="Номер телефона"
              isPhone
              showAsterisk={false}
              wrapperClassName="mb-6"
              {...field}
            />
          )}
          name="phone"
        />

        <Controller
          control={control}
          render={({ field }) => (
            <DataPickerInputText
              format={systemDateWithoutTime}
              onChange={(dateString) =>
                field.onChange(dateString?.format(systemDateWithoutTime))
              }
              value={
                field?.value ? dayjs(field.value, systemDateWithoutTime) : null
              }
              className="mb-6"
              onFocus={() => {
                // to hide the keyboard when the input is selected
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement) {
                  activeElement.blur();
                }
              }}
            />
          )}
          name="birth_date"
        />

        <Controller
          control={control}
          name="family_member_code"
          rules={{ required: t("FillInByWho") }}
          render={({ field }) => (
            <InputSelect
              wrapperClassName="mb-6"
              label="Кем приходится?"
              name="relation"
              value={field.value}
              options={familyMembers || []}
              showAsterisk={false}
              onChange={(value) => {
                const selectedFamilyMember = familyMembers.find(
                  (member) => member.id === value.target.value
                );
                field.onChange(selectedFamilyMember?.id);
              }}
              readOnly
            />
          )}
        />

        <Controller
          control={control}
          render={({ field }) => (
            <InputText
              label="Вес"
              name="weight"
              value={field.value ? String(field.value) : ""}
              onChange={(event) => {
                const numericValue = Number(
                  event.target.value.replace(/\D/g, "")
                );
                field.onChange(numericValue);
              }}
              showAsterisk={false}
              wrapperClassName="mb-6"
            />
          )}
          name="weight"
        />
        <Controller
          control={control}
          render={({ field }) => (
            <InputText
              label="Рост"
              name="height"
              value={field.value ? String(field.value) : ""}
              onChange={(event) => {
                const numericValue = Number(
                  event.target.value.replace(/\D/g, "")
                );
                field.onChange(numericValue);
              }}
              showAsterisk={false}
            />
          )}
          name="height"
        />
      </Island>

      <Island className="rounded-t-none">
        <Button variant="primary" className="w-full" onClick={handleOnSubmit}>
          Добавить
        </Button>
      </Island>
    </div>
  );
}

AddFamilyMember.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="!bg-gray h-full">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
