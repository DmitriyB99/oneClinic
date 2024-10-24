import type { FC } from "react";
import { useState, useContext, useCallback } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "react-query";

import { Input, Button as AntButton } from "antd";
import { useTranslations } from "next-intl";

import { UploadAvatar } from "@/entities/desktopFillProfile";
import { clinicsApi } from "@/shared/api/clinics";
import {
  Button,
  DesktopInputText,
  PlusIcon,
  TrashBucketIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { AmbulanceOrderMap } from "@/widgets/ambulance";
import type {
  ClinicDataFillModel,
  ClinicPhoneNumbersModel,
  RegistrationStepModel,
} from "@/widgets/auth";

const { TextArea } = Input;

export const Step2FillClinicProfile: FC<
  RegistrationStepModel<ClinicDataFillModel>
> = ({ next, control, setValue, reset }) => {
  const { userCoordinates } = useContext(UserContext);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");
  const [phoneNumbers, setPhoneNumbers] = useState<
    { phoneNumber: string; id: number }[]
  >([
    {
      id: 1,
      phoneNumber: "",
    },
  ]);
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>("");

  useQuery(
    ["getClinicProfileInfo"],
    () =>
      clinicsApi.getClinicMe().then(({ data }) => ({
        bin: data?.bin,
        email: data?.email,
        name: data?.name,
        phoneNumber: data?.phoneNumbers[0]?.phoneNumber,
      })),
    {
      onSuccess: ({ phoneNumber, ...rest }) => {
        reset?.(rest);
        setPhoneNumbers([
          {
            id: 1,
            phoneNumber: phoneNumber,
          },
        ]);
      },
    }
  );

  const addPhoneNumber = useCallback(() => {
    const newPhoneNumber = {
      id: phoneNumbers.length + 1,
      phoneNumber: "",
    };
    setPhoneNumbers((prevPhoneNumbers) => [
      ...prevPhoneNumbers,
      newPhoneNumber,
    ]);
  }, [phoneNumbers]);

  const handlePhoneNumberChange = useCallback((value: string, id: number) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.map((phoneNumber) =>
        phoneNumber.id === id
          ? { ...phoneNumber, phoneNumber: value }
          : phoneNumber
      )
    );
  }, []);

  const removePhoneNumber = useCallback(
    (id: number) => {
      const isLastNumber = phoneNumbers.length === 1;
      if (!isLastNumber) {
        setPhoneNumbers((prevPhoneNumbers) =>
          prevPhoneNumbers.filter((phoneNumber) => phoneNumber.id !== id)
        );
      }
    },
    [phoneNumbers]
  );

  const handleNextClick = useCallback(() => {
    const defaultPhoneNumbers = phoneNumbers
      .map(({ phoneNumber }) => {
        if (Boolean(phoneNumber)) {
          return {
            phoneNumber,
            type: "DEFAULT",
          };
        }
      })
      .filter(Boolean) as ClinicPhoneNumbersModel[];

    const whatsAppPhoneNumber: ClinicPhoneNumbersModel = {
      phoneNumber: whatsAppNumber,
      type: "WHATSAPP",
    };

    if (whatsAppNumber) {
      defaultPhoneNumbers.push(whatsAppPhoneNumber);
    }

    setValue?.("phoneNumbers", [...defaultPhoneNumbers]);
    next?.();
  }, [next, setValue, phoneNumbers, whatsAppNumber]);

  const setAddressData = useCallback(
    (streetAddress: string, coords: number[]) => {
      setValue?.("address", {
        street: streetAddress,
        cityId: null,
        buildNumber: "",
      });
      setValue?.("latitude", coords[0]);
      setValue?.("longitude", coords[1]);
    },
    [setValue]
  );

  return (
    <>
      <div className="mt-2 text-gray-4">
        {tDesktop("ProvideInfoAboutClinic")}
      </div>
      <div className="mt-4 text-Bold20">{t("AboutClinic")}</div>
      <UploadAvatar title={t("Logo")} />
      <div className="mt-6 text-Regular14 ">{t("ClinicName")}</div>
      <Controller
        control={control}
        name="name"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-2"
            inputClassName="pl-3"
            label={tDesktop("EnterClinicName")}
            desktopDrawer
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <TextArea className="mt-6" placeholder="О клинике" {...field} />
        )}
      />
      <div className="mt-8 text-Bold20">{t("Address")}</div>
      <Controller
        control={control}
        name="address"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 my-6"
            inputClassName="pl-3"
            label={tDesktop("StreetBuildingNumber")}
            desktopDrawer
            showAsterisk={false}
            value={field?.value?.street ?? ""}
            onChange={(event) => field.onChange(event)}
            name={field.name}
          />
        )}
      />
      <AmbulanceOrderMap
        userCoordinates={userCoordinates}
        setAddressData={setAddressData}
        desktop
        width="100%"
        height="300px"
      />
      <div className="mt-8 text-Bold20">{tDesktop("ClinicContacts")}</div>
      <div className="mt-6 text-Regular14">{t("PhoneNumber")}</div>
      {phoneNumbers.map((phoneNumber) => (
        <div key={phoneNumber.id} className="mt-2 flex items-center gap-3">
          <DesktopInputText
            wrapperClassName="text-Regular16 "
            inputClassName="pl-3"
            label=""
            isPhone
            value={phoneNumbers[phoneNumber.id - 1].phoneNumber}
            desktopDrawer
            showAsterisk={false}
            name="phoneNumber"
            onChange={(event) =>
              handlePhoneNumberChange(event.target.value, phoneNumber.id)
            }
          />
          <div
            className="cursor-pointer"
            onClick={() => removePhoneNumber(phoneNumber.id)}
          >
            <TrashBucketIcon color="gray-4" />
          </div>
        </div>
      ))}
      <AntButton
        className="mt-4 flex h-fit items-center gap-1 rounded-2xl bg-brand-light px-3 py-2 text-Regular14"
        onClick={addPhoneNumber}
      >
        {t("Add")} <PlusIcon size="xs" color="" />
      </AntButton>
      <DesktopInputText
        wrapperClassName="text-Regular16 mt-6"
        inputClassName="pl-3"
        label={tDesktop("WhatsAppPhoneNumber")}
        placeholder={tDesktop("WhatsAppPhoneNumber")}
        desktopDrawer
        isPhone
        showAsterisk={false}
        name="whatsAppNumber"
        onChange={(event) => setWhatsAppNumber(event.target.value)}
      />
      <div className="mt-6 text-Regular14 ">{tDesktop("ClinicEmail")}</div>
      <Controller
        control={control}
        name="email"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-2"
            inputClassName="pl-3"
            label={tDesktop("EnterClinicEmail")}
            desktopDrawer
            showAsterisk={false}
            readOnly
            {...field}
          />
        )}
      />
      <div className="mt-6 text-Regular14 ">{t("ClinicBIN")}</div>
      <Controller
        control={control}
        name="bin"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-2"
            type="number"
            maxLength={12}
            inputClassName="pl-3"
            label={tDesktop("EnterClinicBIN")}
            desktopDrawer
            showAsterisk={false}
            readOnly
            {...field}
          />
        )}
      />
      <Button
        className="mb-20 mt-11 !h-10 w-full rounded-lg"
        onClick={handleNextClick}
      >
        {t("Continue")}
      </Button>
    </>
  );
};
