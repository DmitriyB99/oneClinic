import type { FC } from "react";
import { Fragment, useCallback, useMemo, useState } from "react";

import { RightOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import type {
  AuthDoctorProfileSetupStepModel,
  DoctorServiceModel,
} from "@/entities/login";
import { AuthDoctorServiceDialog } from "@/entities/login";
import {
  ArrowLeftIcon,
  Button,
  DefaultCell,
  DividerSaunet,
  Island,
  Navbar,
} from "@/shared/components";

export const AuthDoctorServices: FC<AuthDoctorProfileSetupStepModel> = ({
  next,
  back,
  setValue,
}) => {
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");

  const [activeServiceId, setActiveServiceId] = useState<string>();
  const [openServicePriceDialog, setOpenServicePriceDialog] =
    useState<boolean>(false);
  const [services, setServices] = useState<DoctorServiceModel[]>([
    {
      id: "onlineConsultation",
      title: "Онлайн-консультация",
    },
    {
      id: "receptionHome",
      title: "Прием у себя",
    },
    {
      id: "homeVisit",
      title: "Выезд на дом",
    },
  ]);
  const currentService = useMemo(
    () => services.find((service) => service.id === activeServiceId),
    [activeServiceId, services]
  );

  const handleNextClick = useCallback(() => {
    setValue?.("servicePrices", [
      {
        consultationType: "ONLINE",
        firstPrice: services[0]?.price?.firstPrice?.toString() ?? "0",
        secondPrice: services[0]?.price?.secondPrice?.toString() ?? "0",
      },
      {
        consultationType: "OFFLINE",
        firstPrice: services[1]?.price?.firstPrice?.toString() ?? "0",
        secondPrice: services[1]?.price?.secondPrice?.toString() ?? "0",
      },
      {
        consultationType: "AWAY",
        firstPrice: services[2]?.price?.firstPrice?.toString() ?? "0",
        secondPrice: services[2]?.price?.secondPrice?.toString() ?? "0",
      },
    ]);
    next?.();
  }, [next, services, setValue]);

  const getCaption = useCallback(
    (price: DoctorServiceModel["price"]) => {
      switch (price) {
        case null:
          return tMob("YouDoNotProvideThisService");
        case undefined:
          return tMob("PriceNotSpecified");
        default:
          return tMob("FirstAndSecondConsultationPrice", {
            firstPrice: price.firstPrice,
            secondPrice: price.secondPrice,
          });
      }
    },
    [tMob]
  );
  return (
    <div className="h-screen bg-gray-2">
      <Navbar
        title={t("Services")}
        className="!p-4"
        description={t("StepSomeOfSome", { step: 2, allStep: 6 })}
        buttonIcon={<ArrowLeftIcon />}
        leftButtonOnClick={back}
      />
      <Island className="!mb-0">
        <div className="mb-2 text-Bold20">
          {tMob("IndicateTheCostOfYourServices")}
        </div>
        {services.map((service, index) => (
          <Fragment key={service.id}>
            <DefaultCell
              hideMainIcon
              title={service.title}
              caption={getCaption(service.price)}
              className="h-10 cursor-pointer py-3"
              onClick={() => {
                setActiveServiceId(service.id);
                setOpenServicePriceDialog(true);
              }}
              captionClasses={clsx({
                "!text-blue": !!service?.price?.firstPrice,
              })}
              rightElement={<RightOutlined />}
            />
            {index !== services.length - 1 && (
              <DividerSaunet className="m-0 p-0" />
            )}
          </Fragment>
        ))}
      </Island>
      <div className="absolute bottom-0 w-full bg-white p-4">
        <Button className="w-full" onClick={handleNextClick}>
          {t("Next")}
        </Button>
      </div>
      <AuthDoctorServiceDialog
        openServiceDialog={openServicePriceDialog}
        setOpenServiceDialog={setOpenServicePriceDialog}
        setServices={setServices}
        currentService={currentService}
      />
    </div>
  );
};
