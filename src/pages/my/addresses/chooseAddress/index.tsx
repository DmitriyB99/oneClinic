import type { ReactElement } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type { MyAddressModel } from "@/entities/myProfile";
import {
  ArrowLeftIcon,
  Button,
  Dialog,
  DividerSaunet,
  InputText,
  Island,
  MobileDialog,
  Popover,
} from "@/shared/components";
import { timeFormat } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";
import { AmbulanceOrderMap } from "@/widgets/ambulance";
import { patientAddressesApi } from "@/shared/api/patient/address";

export default function ChooseMyAddressPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.CallAmbulance");

  const router = useRouter();
  const {
    control,
    handleSubmit,
    getValues,
    setValue: setAddressInfo,
  } = useForm();
  const {
    control: addressControl,
    getValues: getAddressValues,
    setValue,
  } = useForm();

  const { userCoordinates, user, getLocationNative } = useContext(UserContext);

  useEffect(() => {
    getLocationNative();
  }, [getLocationNative]);

  const [selectedMap, setSelectedMap] = useState<boolean | undefined>(true);

  const { mutate: address } = useMutation(
    ["createAddress"],
    (data: Partial<MyAddressModel>) =>
      patientAddressesApi.addAddress(data, user?.user_id).then(() => {
        router.push( `/my/addresses?message=${encodeURIComponent('Адрес добавлен')}`);
      })
  );

  const onSubmit = useCallback(
    async (addressData) => {
      console.log(addressData); // comment and latitude longitude
      let addressValues = getAddressValues();
      console.log(addressValues); // address entrance flat floor
      try {
        address({
          ...addressData,
          ...addressValues,
        });
      } catch (err: unknown) {
        console.log(err);
      }
    },
    [address, getAddressValues, user?.role_id, user?.user_id]
  );

  const handleOnSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const setAddressData = useCallback(
    (streetAddress: string, coords: number[], city_id: string) => {
      setValue("address", streetAddress);
      setAddressInfo("location_point", coords);
      setAddressInfo("city_id", city_id);
    },
    [setValue, setAddressInfo]
  );

  return (
    <div className="relative flex h-screen flex-col bg-gray-2">
      <div className="h-full">
        <Button
          size="s"
          variant="tinted"
          className="absolute left-4 top-2 z-50 bg-gray-2"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon />
        </Button>
        <AmbulanceOrderMap
          userCoordinates={userCoordinates}
          setAddressData={setAddressData}
          setSelectedMap={setSelectedMap}
        />
      </div>
      <MobileDialog
        hide={selectedMap}
        onHideChange={setSelectedMap}
        height="fit-content"
      >
        <Island className="!px-4 !pt-8">
          <div className="mb-5 text-Bold20 text-dark">
            {tMob("WhereAreYouAt")}
          </div>
          <Controller
            control={addressControl}
            name="address"
            render={({ field }) => (
              <InputText
                label={t("Address")}
                name="address"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                onFocus={() => {
                  setSelectedMap(false);
                }}
                showAsterisk={false}
              />
            )}
          />
        </Island>
        <Island className="mt-2">
          <div className="mb-3 flex justify-between">
            <Controller
              control={addressControl}
              name="entrance"
              render={({ field }) => (
                <InputText
                  label={t("Entrance")}
                  name="entry"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  showAsterisk={false}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="floor"
              render={({ field }) => (
                <InputText
                  label={t("Floor")}
                  name="floor"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  wrapperClassName={"mx-3"}
                  showAsterisk={false}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="apartment"
              render={({ field }) => (
                <InputText
                  label={t("Apartment")}
                  name="apartment"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  showAsterisk={false}
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="comment"
            render={({ field }) => (
              <InputText
                label={t("Comment")}
                name="comment"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                showAsterisk={false}
              />
            )}
          />
          <DividerSaunet className="my-3" />
          <div className="flex items-center justify-between">
            <Button
              variant="primary"
              className="flex w-full items-center justify-center px-4 text-Medium16"
              onClick={() => {
                handleOnSubmit();
              }}
            >
              <div>{t("IsReady")}</div>
            </Button>
          </div>
        </Island>
      </MobileDialog>
    </div>
  );
}

ChooseMyAddressPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
