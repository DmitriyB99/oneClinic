import type { ReactElement } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import type { GetServerSidePropsContext } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  Button,
  CloseIcon,
  Dialog,
  DividerSaunet,
  InputText,
  Island,
  MobileDialog,
  Popover,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";
import { AmbulanceOrderMap } from "@/widgets/ambulance";
import { patientAddressesApi } from "@/shared/api/patient/address";

export default function ChangeMyAddressPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.CallAmbulance");

  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get("id");
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);

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

  const {
    data: myAddress,
    refetch,
    isLoading,
  } = useQuery(["getAddresses"], () => patientAddressesApi?.getAddress(addressId), {
    enabled: !!addressId,
  });

  useEffect(() => {
    if (myAddress?.data) {
      setValue("address", myAddress.data.address);
      setValue("entrance", myAddress.data.entrance);
      setValue("floor", myAddress.data.floor);
      setValue("apartment", myAddress.data.apartment);
      setValue("comment", myAddress.data.comment);
      setAddressInfo("location_point", myAddress.data.location_point);
      setAddressInfo("city_id", "62633ab4-ebeb-47c4-9d51-94340f7f44e2");
    }
  }, [myAddress, setValue, setAddressInfo]);

  const { userCoordinates, getLocationNative } = useContext(UserContext);

  useEffect(() => {
    getLocationNative();
  }, [getLocationNative]);

  const [selectedMap, setSelectedMap] = useState<boolean | undefined>(true);

  const { mutate: deleteAddress } = useMutation(
    ["deleteAddress"],
    (addressId: string) =>
      patientAddressesApi.deleteAddress(addressId).then(() => {
        router.push(
          `/my/addresses?message=${encodeURIComponent("Адрес удален")}`
        );
      })
  );

  const { mutate: updateAddress } = useMutation(["updateAddress"], (data) =>
    patientAddressesApi.updateAddress(addressId, data).then(() => {
      router.push(
        `/my/addresses?message=${encodeURIComponent("Адрес изменен")}`
      );
    })
  );

  const onSubmit = useCallback(
    async (addressData) => {
      console.log(addressData); // comment and latitude longitude
      let addressValues = getAddressValues();
      console.log(addressValues);
      try {
        updateAddress({
          ...addressData,
          ...addressValues,
        });
      } catch (err: unknown) {
        console.log(err);
      }
    },
    [updateAddress, getAddressValues]
  );

  const onDelete = useCallback(
    async (id: string) => {
      try {
        await deleteAddress(id);
      } catch (err: unknown) {
        console.log(err);
      }
    },
    [deleteAddress, refetch]
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
                  name="entrance"
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
            control={addressControl}
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
              variant="tertiary"
              className="mr-3 flex w-full items-center justify-center px-4 text-Medium16 text-red"
              onClick={() => {
                setOpenConfirmDeleteDialog(true);
              }}
            >
              <div>Удалить адрес</div>
            </Button>
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
      {/* <Dialog isOpen={step !== Steps.chooseLocation} className="!p-0">
        <div className="bg-gray-0">{renderDialogChildren()}</div>
      </Dialog> */}
      <Dialog
        isOpen={openConfirmDeleteDialog}
        setIsOpen={setOpenConfirmDeleteDialog}
        className="!p-0"
      >
        <div className="relative bg-gray-1">
          <Island className="mb-2">
            <div className="flex justify-end">
              <Button
                size="s"
                variant="tertiary"
                onClick={() => setOpenConfirmDeleteDialog(false)}
              >
                <CloseIcon />
              </Button>
            </div>

            <div className="px-12 text-center">
              <div className="text-Bold24 mb-6">
                Вы уверены, что хотите удалить адрес?
              </div>
            </div>

            <Button
              variant="primary"
              className="flex w-full items-center justify-center px-4 text-Medium16 mb-4"
              onClick={() => {
                onDelete(addressId);
              }}
            >
              <div>Да, удалить</div>
            </Button>
            <Button
              variant="tertiary"
              className="mr-3 flex w-full items-center justify-center px-4 text-Medium16"
              onClick={() => {
                setOpenConfirmDeleteDialog(false);
              }}
            >
              <div>Отмена</div>
            </Button>
          </Island>
        </div>
      </Dialog>
    </div>
  );
}

ChangeMyAddressPage.getLayout = function getLayout(page: ReactElement) {
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

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
