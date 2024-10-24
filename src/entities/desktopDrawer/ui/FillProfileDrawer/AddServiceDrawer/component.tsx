import type { FC } from "react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";

import { Radio } from "antd";
import { useTranslations } from "next-intl";

import type { DesktopFillClinicDrawerProps } from "@/entities/desktopDrawer";
import { dictionaryApi } from "@/shared/api/dictionary";
import {
  Button,
  DesktopInputText,
  Drawer,
  RadioSaunet,
  Select,
} from "@/shared/components";
import { ServiceTypeEnum } from "@/widgets/auth";
import type { ServiceDataModel } from "@/widgets/auth";

export const DesktopAddServiceDrawer: FC<DesktopFillClinicDrawerProps> = ({
  onClose,
  open,
  addData,
}) => {
  const [serviceType, setServiceType] = useState<ServiceTypeEnum>(
    ServiceTypeEnum.ANALYSIS
  );

  const { control, handleSubmit } = useForm<ServiceDataModel>();

  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");

  const handleAddData = useCallback(
    (data: ServiceDataModel) => {
      const { type, analysis } = data;
      const id = serviceType + type.key + analysis.key;
      addData({ ...data, serviceType, id });
    },
    [addData, serviceType]
  );

  const { data: analysisTypes } = useQuery(["getAnalysisTypes"], () =>
    dictionaryApi.getAnalysisTypes().then((response) =>
      response.data.result.map(({ id, name }) => ({
        value: id,
        label: name,
      }))
    )
  );

  const { data: serviceDirectory } = useQuery(["getServiceDirectory"], () =>
    dictionaryApi.getServicesDirectory().then((response) =>
      response.data.result.map(({ id, name }) => ({
        value: id,
        label: name,
      }))
    )
  );

  return (
    <Drawer onClose={onClose} open={open} title="Услуга">
      <div>{tDesktop("TypeOfService")}:</div>
      <Radio.Group
        className="mt-4"
        onChange={(event) => setServiceType(event.target.value)}
        value={serviceType}
      >
        <RadioSaunet value={ServiceTypeEnum.ANALYSIS}>
          {t("Analysis")}
        </RadioSaunet>
        <RadioSaunet value={ServiceTypeEnum.DIAGNOSTIC}>
          {t("Diagnostics")}
        </RadioSaunet>
      </Radio.Group>
      <div className="mt-6">{tDesktop("TypeOfService")}</div>
      <Controller
        control={control}
        name="type"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <Select
            size="large"
            className="mt-2 w-full"
            labelInValue
            placeholder={tDesktop("ForExampleGeneralReserch")}
            options={analysisTypes ?? []}
            {...field}
          />
        )}
      />
      <div className="mt-6">{t("Service")}</div>
      <Controller
        control={control}
        name="analysis"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <Select
            size="large"
            labelInValue
            placeholder={tDesktop("ForExampleBloodTest")}
            className="mt-2 w-full"
            options={serviceDirectory ?? []}
            {...field}
          />
        )}
      />
      <div className="mt-6">{t("Price")}, ₸</div>
      <Controller
        control={control}
        name="price"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            label={t("SpecifyCost")}
            wrapperClassName="mt-2 mb-16"
            type="number"
            showAsterisk={false}
            inputClassName="pl-3"
            desktopDrawer
            {...field}
          />
        )}
      />
      <div className="fixed bottom-0 flex w-[470px] justify-end gap-4 bg-white py-6">
        <Button
          className="!h-10 rounded-lg !border px-4"
          variant="outline"
          onClick={onClose}
        >
          {t("Abolish")}
        </Button>
        <Button
          className="!h-10 rounded-lg px-4"
          onClick={handleSubmit(handleAddData)}
        >
          {t("Add")}
        </Button>
      </div>
    </Drawer>
  );
};
