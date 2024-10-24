import type { ReactElement } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type {
  AddressDetails,
  CreateAmbulanceCallModel,
} from "@/entities/ambulance";
import { AmbulanceOnRoute } from "@/entities/ambulance";
import { MyAddresses } from "@/entities/myProfile";
import { PaymentsChoosePaymentType } from "@/entities/payments";
import { callAmbulanceApi } from "@/shared/api/callAmbulance";
import {
  ArrowLeftIcon,
  Button,
  Dialog,
  DividerSaunet,
  InputText,
  Island,
  LocationPoint,
  MobileDialog,
} from "@/shared/components";
import { timeFormat } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";
import { AmbulanceOrderMap } from "@/widgets/ambulance";

export enum Steps {
  chooseLocation = 0,
  choosePaymentType = 1,
  ambulanceCalled = 2,
}

export default function CallAmbulancePage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.CallAmbulance");

  const router = useRouter();
  const {
    control,
    handleSubmit,
    getValues,
    setValue: setAmbulanceCallModel,
  } = useForm<CreateAmbulanceCallModel>();
  const {
    control: addressControl,
    getValues: getAddressValues,
    setValue,
  } = useForm<AddressDetails>();

  const { data: myAmbulanceCalls, refetch: refetchMyAmbulanceCalls } = useQuery(
    ["getMyAmbulanceCalls"],
    () => callAmbulanceApi.getMyAmbulanceCalls(0, 3)
  );

  useEffect(() => {
    if (
      myAmbulanceCalls?.data?.content &&
      myAmbulanceCalls?.data?.content?.length > 0
    ) {
      setStep(Steps.ambulanceCalled);
    }
  }, [
    myAmbulanceCalls?.data?.content,
    myAmbulanceCalls?.data?.content?.length,
  ]);

  const { userCoordinates, user, getLocationNative } = useContext(UserContext);

  useEffect(() => {
    getLocationNative();
  }, [getLocationNative]);

  const [step, setStep] = useState<Steps>(Steps.chooseLocation);
  const [selectedMap, setSelectedMap] = useState<boolean | undefined>(true);
  const [isMyAddressDialogOpen, setIsMyAddressDialogOpen] =
    useState<boolean>(false);

  const renderDialogChildren = useCallback(() => {
    switch (step) {
      case Steps.ambulanceCalled:
        return (
          <AmbulanceOnRoute
            userProfileId={user?.role_id ?? ""}
            handleBack={() => {
              setStep(Steps.chooseLocation);
            }}
            handleAmbulanceCancellation={() => {
              setStep(Steps.chooseLocation);
            }}
            address={getAddressValues()}
            comment={getValues().comment}
            callTime={dayjs(
              myAmbulanceCalls?.data?.content?.[0]?.created
            ).format(timeFormat)}
            price={myAmbulanceCalls?.data?.content?.[0]?.price ?? 5000}
          />
        );
      case Steps.choosePaymentType:
        return (
          <PaymentsChoosePaymentType
            handleClose={() => {
              setStep(Steps.chooseLocation);
            }}
            handleNext={() => {
              setStep(Steps.ambulanceCalled);
            }}
          />
        );
      default:
        return <div />;
    }
  }, [
    getAddressValues,
    getValues,
    myAmbulanceCalls?.data?.content,
    step,
    user?.role_id,
  ]);

  const { mutate: callAmbulance } = useMutation(
    ["createCallAmbulance"],
    (data: CreateAmbulanceCallModel) =>
      callAmbulanceApi.createAmbulanceCall(data).then(() => {
        refetchMyAmbulanceCalls();
      })
  );

  const onSubmit = useCallback(
    async (callAmbulanceData: CreateAmbulanceCallModel) => {
      try {
        callAmbulance({
          ...callAmbulanceData,
          userProfileId: user?.role_id ?? "",
          userId: user?.user_id ?? "",
          phoneNumber: "87071234567",
          address: getAddressValues(),
        });
      } catch (err: unknown) {
        console.log(err);
      }
    },
    [callAmbulance, getAddressValues, user?.role_id, user?.user_id]
  );

  const handleOnSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const setAddressData = useCallback(
    (streetAddress: string, coords: number[]) => {
      setValue("address", streetAddress);
      const map = { latitude: coords[0], longitude: coords[1] };
      setAmbulanceCallModel("map", map);
    },
    [setValue, setAmbulanceCallModel]
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
        height="50%"
      >
        <Island className="!px-4 !pt-8">
          <div className="flex justify-between">
            <div className="mb-5 text-Bold24 text-dark">
              {tMob("WhereAreYouAt")}
            </div>
            <div
              className="z-[50]"
              onClick={() => setIsMyAddressDialogOpen(true)}
            >
              <LocationPoint />
            </div>
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
              name="flat"
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
                label={tMob("CommentForAmbulance")}
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
          <Button
            variant="primary"
            className="flex w-full items-center justify-between px-4 text-Medium16"
            onClick={() => {
              handleOnSubmit();
              setStep(Steps.ambulanceCalled);
            }}
          >
            <div>{tMob("CallAnAmbulance")}</div>
            <div>5000 ₸</div>
          </Button>
        </Island>
      </MobileDialog>
      <Dialog isOpen={step !== Steps.chooseLocation} className="!p-0">
        <div className="bg-gray-0">{renderDialogChildren()}</div>
      </Dialog>
      <Dialog isOpen={isMyAddressDialogOpen} className="!p-0">
        <MyAddresses onClose={() => setIsMyAddressDialogOpen(false)} />
      </Dialog>
    </div>
  );
}

CallAmbulancePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
