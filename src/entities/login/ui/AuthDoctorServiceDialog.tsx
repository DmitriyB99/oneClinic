import type { FC } from "react";
import { useCallback, useState } from "react";

import { useTranslations } from "next-intl";

import type { AuthDoctorServiceDialogModel } from "@/entities/login";
import { Button, CloseIcon, Dialog, InputText } from "@/shared/components";

export const AuthDoctorServiceDialog: FC<AuthDoctorServiceDialogModel> = ({
  openServiceDialog,
  setOpenServiceDialog,
  setServices,
  currentService,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Login");

  const [firstConsultationPrice, setFirstConsultationPrice] =
    useState<string>("");
  const [followUpConsultationPrice, setFollowUpConsultationPrice] =
    useState<string>("");

  const handleServiceClick = useCallback(
    (isDenied: boolean) => {
      setServices((prev) => {
        const newServices = [...prev];
        const serviceIndex = newServices.findIndex(
          (service) => service.id === currentService?.id
        );
        if (isDenied) {
          newServices[serviceIndex].price = null;
        } else {
          newServices[serviceIndex].price = {
            firstPrice: parseInt(firstConsultationPrice),
            secondPrice: parseInt(followUpConsultationPrice),
          };
        }
        return newServices;
      });
      setOpenServiceDialog(false);
    },
    [
      currentService?.id,
      firstConsultationPrice,
      followUpConsultationPrice,
      setOpenServiceDialog,
      setServices,
    ]
  );

  return (
    <Dialog isOpen={openServiceDialog} setIsOpen={setOpenServiceDialog}>
      <div className="my-2 flex w-full justify-between">
        <div className="text-Bold24">
          {tMob("SpecifyCostOfTheServiceSearchResults")} {currentService?.title}
        </div>
        <Button
          variant="tertiary"
          className="!p-0"
          onClick={() => setOpenServiceDialog(false)}
        >
          <CloseIcon />
        </Button>
      </div>
      <InputText
        label={t("FirstConsultationT")}
        name="firstConsultation"
        value={firstConsultationPrice}
        onChange={(event) => {
          setFirstConsultationPrice(event.target.value);
        }}
        showAsterisk={false}
        wrapperClassName="my-3"
      />
      <InputText
        label={t("RepeatedConsultationT")}
        name="followUpConsultation"
        value={followUpConsultationPrice}
        onChange={(event) => {
          setFollowUpConsultationPrice(event.target.value);
        }}
        showAsterisk={false}
        wrapperClassName="my-3"
      />
      <Button
        className="my-4"
        onClick={() => {
          handleServiceClick(false);
        }}
      >
        {t("Next")}
      </Button>
      <Button
        variant="tertiary"
        className="mb-4"
        onClick={() => {
          handleServiceClick(true);
        }}
      >
        {tMob("IDoNotProvideThisService")}
      </Button>
    </Dialog>
  );
};
