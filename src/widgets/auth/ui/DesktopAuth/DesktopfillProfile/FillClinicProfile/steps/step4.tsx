import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";

import { Button as AntButton } from "antd";
import { useTranslations } from "next-intl";

import { DesktopAddServiceDrawer } from "@/entities/desktopDrawer";
import { Button, CardOneClinic, PlusIcon } from "@/shared/components";
import { ServiceTypeEnum } from "@/widgets/auth";
import type {
  ServiceDataModel,
  ClinicDataFillModel,
  RegistrationStepModel,
} from "@/widgets/auth";

export const Step4FillClinicProfile: FC<
  RegistrationStepModel<ClinicDataFillModel>
> = ({ next, setValue }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [allServicesData, setAllServicesData] = useState<ServiceDataModel[]>(
    []
  );

  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");

  const addData = useCallback((serviceData: ServiceDataModel) => {
    setAllServicesData((prev) => [...prev, serviceData]);
  }, []);

  const removeData = useCallback(
    (id?: string) => {
      const newServicesData = allServicesData.filter(
        (service) => service.id !== id
      );
      setAllServicesData(newServicesData);
    },
    [allServicesData]
  );

  const [analysis, diagnostic] = useMemo(() => {
    const analysisCount = allServicesData.filter(
      (service) => service.serviceType === ServiceTypeEnum.ANALYSIS
    );
    const diagnosticCount = allServicesData.filter(
      (service) => service.serviceType === ServiceTypeEnum.DIAGNOSTIC
    );
    return [analysisCount, diagnosticCount];
  }, [allServicesData]);

  const handleNextClick = useCallback(() => {
    const allDataForm = allServicesData.map((data) => ({
      type: data.serviceType,
      analysisTypeId: data.analysis.value,
      serviceDirectoryId: data.type.value,
      price: parseInt(data.price),
    }));

    setValue?.("clinicServices", allDataForm);
    next?.();
  }, [next, setValue, allServicesData]);

  return (
    <>
      <div className="mt-6 text-Bold20">
        {tDesktop("SpecifyClinicServices")}
      </div>
      {analysis.length !== 0 && (
        <>
          <div className="mt-6 text-Bold16">{t("Analyzes")}</div>
          <div className="mt-4 grid w-full grid-cols-2 gap-6">
            {analysis.map((data) => (
              <CardOneClinic
                key={data.id}
                id={data.id}
                title={data.analysis.label}
                topText={data.type.label}
                bottomText={tDesktop("PriceAmount", { price: data.price })}
                removeCard={removeData}
              />
            ))}
          </div>
        </>
      )}
      {diagnostic.length !== 0 && (
        <>
          <div className="mt-6 text-Bold16">{t("Diagnostics")}</div>
          <div className="mt-4 grid w-full grid-cols-2 gap-6">
            {diagnostic.map((data) => (
              <CardOneClinic
                key={data.id}
                id={data.id}
                title={data.analysis.label}
                topText={data.type.label}
                bottomText={tDesktop("PriceAmount", { price: data.price })}
                removeCard={removeData}
              />
            ))}
          </div>
        </>
      )}
      <AntButton
        className="mt-4 flex h-fit items-center gap-1 rounded-2xl bg-brand-light px-3 py-2 text-Regular14"
        onClick={() => setOpenDrawer(true)}
      >
        {t("Add")} <PlusIcon size="xs" color="" />
      </AntButton>
      <Button
        onClick={handleNextClick}
        className="mb-20 mt-11 !h-10 w-full rounded-lg"
      >
        {t("IsReady")}
      </Button>
      <DesktopAddServiceDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        addData={addData}
      />
    </>
  );
};
