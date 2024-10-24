import type { FC } from "react";
import { useState, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";

import { useTranslations } from "next-intl";

import type {
  DesktopAddDoctorWorkPlaceDrawerProps,
  DoctorClinicModel,
} from "@/entities/desktopDrawer";
import type { WorkTimeCheckModel } from "@/entities/desktopSetting";
import { WorkTimeCheck } from "@/entities/desktopSetting";
import { clinicsApi } from "@/shared/api/clinics";
import { Button, Drawer, Select } from "@/shared/components";
import { allDays, getWorkDaysForm } from "@/shared/utils";
import { dictionaryApi } from "@/shared/api/dictionary";

export const DesktopAddDoctorWorkPlaceDrawer: FC<DesktopAddDoctorWorkPlaceDrawerProps> =
  ({ onClose, open, addData, WorkPlaceData }) => {
    const [workDays, setWorkDays] = useState<WorkTimeCheckModel[]>(allDays);
    const { control, handleSubmit, setValue, reset } =
      useForm<DoctorClinicModel>();
    const t = useTranslations("Common");
    const tDesktop = useTranslations("Desktop.FillProfile");

    useEffect(() => {
      if (WorkPlaceData) {
        reset({
          clinicId: {
            value: WorkPlaceData.clinicId,
            label: WorkPlaceData.name,
          },
          cityId: {
            value: WorkPlaceData.cityId,
            label: WorkPlaceData.cityName,
          },
          workPeriod: WorkPlaceData.workPeriod,
        });
      }
    }, [WorkPlaceData, reset]);

    const { data: citiesList } = useQuery(["getCities"], () =>
      dictionaryApi.getCities()?.then(
        (res) =>
          res?.data?.result?.map(({ id, name }) => ({
            value: id,
            label: name,
          })) ?? []
      )
    );

    const { data: clinicList } = useQuery(["getClinics"], () =>
      clinicsApi.getClinics()?.then(
        (res) =>
          res?.data?.content?.map(({ id, name }) => ({
            value: id,
            label: name,
          })) ?? []
      )
    );

    const onSubmit = useCallback(
      (data: DoctorClinicModel) => {
        setValue?.("workPeriod", getWorkDaysForm(workDays));
        addData(
          { ...data, workPeriod: getWorkDaysForm(workDays) },
          WorkPlaceData?.clinicId
        );
      },
      [setValue, workDays, addData, WorkPlaceData]
    );

    return (
      <Drawer onClose={onClose} open={open} title={t("Service")}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>{t("City")}</div>
          <Controller
            control={control}
            name="cityId"
            rules={{
              required: t("RequiredField"),
            }}
            render={({ field }) => (
              <Select
                size="large"
                labelInValue
                className="mt-2 w-full"
                placeholder={tDesktop("ChooseCity")}
                options={citiesList ?? []}
                {...field}
              />
            )}
          />
          <div className="mt-6">{tDesktop("MedInstitutionName")}</div>
          <Controller
            control={control}
            name="clinicId"
            rules={{
              required: t("RequiredField"),
            }}
            render={({ field }) => (
              <Select
                size="large"
                labelInValue
                className="mt-2 w-full"
                placeholder={tDesktop("SpecifyYourMedicalInstitution")}
                options={clinicList ?? []}
                {...field}
              />
            )}
          />
          <div className="mb-16 mt-7 px-4">
            {workDays?.map((day) => (
              <WorkTimeCheck
                key={day?.day}
                setWorkDays={setWorkDays}
                {...day}
              />
            ))}
          </div>
          <div className="fixed bottom-0 flex w-[470px] justify-end gap-4 bg-white py-6">
            <Button
              className="!h-10 rounded-lg !border px-4"
              variant="outline"
              onClick={onClose}
            >
              {t("Abolish")}
            </Button>
            <Button className="!h-10 rounded-lg px-4" htmlType="submit">
              {t("Add")}
            </Button>
          </div>
        </form>
      </Drawer>
    );
  };
