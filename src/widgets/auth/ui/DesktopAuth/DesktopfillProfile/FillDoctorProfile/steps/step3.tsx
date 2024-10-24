import type { FC } from "react";
import { useCallback, useState } from "react";

import { useTranslations } from "next-intl";

import { Button, Checkbox, DesktopInputText } from "@/shared/components";
import type {
  DoctorDataFillModel,
  DoctorServicePriceModel,
  RegistrationStepModel,
} from "@/widgets/auth";
import { DoctorConsultationTypeEnum } from "@/widgets/auth";

export const Step3FillDoctorProfile: FC<
  RegistrationStepModel<DoctorDataFillModel>
> = ({ next, setValue }) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Staff");
  const [consultations, setConsultations] = useState<DoctorServicePriceModel[]>(
    [
      {
        consultationType: DoctorConsultationTypeEnum.ONLINE,
        firstPrice: "",
        secondPrice: "",
      },
      {
        consultationType: DoctorConsultationTypeEnum.OFFLINE,
        firstPrice: "",
        secondPrice: "",
      },
      {
        consultationType: DoctorConsultationTypeEnum.AWAY,
        firstPrice: "",
        secondPrice: "",
      },
    ]
  );

  const [checkOffline, setCheckOffline] = useState(true);
  const [checkAway, setCheckAway] = useState(true);

  const handleEducationChange = useCallback(
    (
      consultationType: string,
      key: "firstPrice" | "secondPrice",
      value: string
    ) => {
      setConsultations((prev) =>
        prev.map((consultation) =>
          consultation.consultationType === consultationType
            ? { ...consultation, [key]: value }
            : consultation
        )
      );
    },
    []
  );

  const handleNextClick = useCallback(() => {
    let consultationForm = [...consultations];
    if (!checkOffline) {
      consultationForm = consultationForm.filter(
        (consultation) =>
          consultation.consultationType !== DoctorConsultationTypeEnum.OFFLINE
      );
    }
    if (!checkAway) {
      consultationForm = consultationForm.filter(
        (consultation) =>
          consultation.consultationType !== DoctorConsultationTypeEnum.AWAY
      );
    }
    setValue?.("servicePrices", consultationForm);
    next?.();
  }, [next, setValue, checkAway, checkOffline, consultations]);

  return (
    <>
      <div className="mt-2 text-gray-4">
        {tDesktop("ProvideInfoAboutDoctorServices")}
      </div>
      <div className="mt-6 text-Bold20">{t("OnlineConsultation")}</div>
      <div className="mt-5 text-Regular14 ">{t("FirstConsultationT")}</div>
      <DesktopInputText
        wrapperClassName="text-Regular16 mt-2"
        inputClassName="pl-3"
        label={tDesktop("EnterPrice")}
        desktopDrawer
        showAsterisk={false}
        name="onlineFirst"
        type="number"
        onChange={(event) =>
          handleEducationChange("ONLINE", "firstPrice", event.target.value)
        }
      />
      <div className="mt-5 text-Regular14 ">{t("RepeatedConsultationT")}</div>
      <DesktopInputText
        wrapperClassName="text-Regular16 mt-2"
        inputClassName="pl-3"
        label={tDesktop("EnterPrice")}
        desktopDrawer
        showAsterisk={false}
        name="onlineSecond"
        type="number"
        onChange={(event) =>
          handleEducationChange("ONLINE", "secondPrice", event.target.value)
        }
      />
      <div className="mt-6 text-Bold20">{t("ClinicAdmission")}</div>
      <div className="mt-5 text-Regular14 ">{t("FirstConsultationT")}</div>
      <DesktopInputText
        wrapperClassName="text-Regular16 mt-2"
        inputClassName="pl-3"
        label={tDesktop("EnterPrice")}
        desktopDrawer
        showAsterisk={false}
        name="offlineFirst"
        type="number"
        onChange={(event) =>
          handleEducationChange("OFFLINE", "firstPrice", event.target.value)
        }
      />
      <div className="mt-5 text-Regular14 ">{t("RepeatedConsultationT")}</div>
      <DesktopInputText
        wrapperClassName="text-Regular16 mt-2"
        inputClassName="pl-3"
        label={tDesktop("EnterPrice")}
        desktopDrawer
        showAsterisk={false}
        name="offlineSecond"
        type="number"
        onChange={(event) =>
          handleEducationChange("OFFLINE", "secondPrice", event.target.value)
        }
      />
      <Checkbox
        desktop
        className="mt-5"
        onChange={() => setCheckOffline(!checkOffline)}
      >
        {tDesktop("NotProvidedThisService")}
      </Checkbox>
      <div className="mt-6 text-Bold20">{t("HouseCall")}</div>
      <div className="mt-5 text-Regular14 ">{t("FirstConsultationT")}</div>
      <DesktopInputText
        wrapperClassName="text-Regular16 mt-2"
        inputClassName="pl-3"
        label={tDesktop("EnterPrice")}
        desktopDrawer
        showAsterisk={false}
        name="awayFirst"
        type="number"
        onChange={(event) =>
          handleEducationChange("AWAY", "firstPrice", event.target.value)
        }
      />
      <div className="mt-5 text-Regular14 ">{t("RepeatedConsultationT")}</div>
      <DesktopInputText
        wrapperClassName="text-Regular16 mt-2"
        inputClassName="pl-3"
        label={tDesktop("EnterPrice")}
        desktopDrawer
        showAsterisk={false}
        name="awaySecond"
        type="number"
        onChange={(event) =>
          handleEducationChange("AWAY", "secondPrice", event.target.value)
        }
      />
      <Checkbox
        desktop
        className="mt-5"
        onChange={() => setCheckAway(!checkAway)}
      >
        {tDesktop("NotProvidedThisService")}
      </Checkbox>
      <Button
        onClick={handleNextClick}
        className="mb-20 mt-11 !h-10 w-full rounded-lg"
      >
        {t("Next")}
      </Button>
    </>
  );
};
