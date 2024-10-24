import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import { SpecializationsDialog, ClinicsDialog } from "@/entities/dutyDoctor";
import { patientClinicsApi, type ClinicsFilter } from "@/shared/api/patientContent/clinics";
import { Button, Chips, Dialog, Island, Toggle } from "@/shared/components";

export const defaultFilter: ClinicsFilter = {
  is_nearby: false,
  is_24hour_working: false,
  is_working: false,
  clinic_ids: [],
  speciality_ids: [],
};

export const ClinicsFilterDialog = ({
  isOpen,
  setIsOpen,
  onFiltersChange,
}) => {
  const { control: filterControl, watch, setValue, reset } = useForm();

  const formData = watch();

  const { data: clinicsFilter } = useQuery(
    ["getDoctors", formData],
    () =>
      patientClinicsApi.getClinicsFilter(formData).then((res) => res.data),
    { enabled: isOpen }
  );

  const handleReset = () => {
    reset(defaultFilter);
  };

  const t = useTranslations("Common");

  const [specialitiesDialogOpen, setSpecialitiesDialogOpen] =
    useState<boolean>(false);
  const [clinicsDialogOpen, setClinicsDialogOpen] = useState<boolean>(false);

  const clinics = useMemo(() => clinicsFilter?.clinics || [], [clinicsFilter]);
  const specializations = useMemo(
    () => clinicsFilter?.specialities || [],
    [clinicsFilter]
  );

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="!bg-gray-0 !p-0">
      {/* <div className="h-screen bg-gray-0"> */}
      <Island className="mb-3">
        <div className="flex items-center justify-between">
          <div
            className="flex cursor-pointer rounded-2xl bg-gray-2 px-5 py-2 text-Bold20"
            onClick={() => setIsOpen(false)}
          >
            <ArrowLeftOutlined />
          </div>
          <div className="text-Bold16">Фильтр</div>
          <div className="text-Regular14 text-red" onClick={handleReset}>
            Сбросить
          </div>
        </div>
        <div className="mb-2 mt-5 text-Bold20">Местоположение</div>
        <div className="flex items-center justify-between py-4">
          <div className="mt-1 text-Regular16">Рядом со мной</div>
          <Controller
            control={filterControl}
            defaultValue={false}
            name="is_nearby"
            render={({ field }) => (
              <Toggle
                checked={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("is_nearby", value);
                }}
              />
            )}
          />
        </div>
      </Island>
      <Island className="mb-3">
        <div className="my-3 text-Bold20">Время работы</div>
        <div className="flex justify-between">
          <Controller
            control={filterControl}
            name="is_working"
            defaultValue={false}
            render={({ field }) => (
              <Chips
                onChange={(value) => {
                  field.onChange(value);
                  const isOnline = value.includes("Открыто сейчас");
                  const works24Hours = value.includes("Круглосуточно");

                  setValue("is_working", isOnline);
                  setValue("is_24hour_working", works24Hours);
                }}
                chipLabels={["Открыто сейчас", "Круглосуточно"]}
                type="multiselect"
                isCarousel={false}
                className="mb-0"
              />
            )}
          />
        </div>
      </Island>
      <Island className="mb-3">
        <div className="flex items-center justify-between">
          <div className="my-3 text-Bold20">Клиника</div>
          <Button
            size="s"
            variant="tinted"
            className="flex items-center rounded-full bg-gray-2 text-Medium12"
            onClick={() => setClinicsDialogOpen(true)}
          >
            Все
            <ArrowRightOutlined />
          </Button>
        </div>

        <div className="flex justify-between">
          <Controller
            control={filterControl}
            name="clinic_ids"
            defaultValue={[]}
            render={({ field }) => (
              <Chips
                onChange={(value) => {
                  field.onChange(value);

                  const selectedClincIds = clinics
                    .filter((clinic) => value.includes(clinic.name))
                    .map((clinic) => clinic.id);

                  setValue("clinic_ids", selectedClincIds);
                }}
                chipLabels={clinics.slice(0, 10).map((clinic) => clinic.name)}
                type="multiselect"
                isCarousel={false}
                className="mb-0"
              />
            )}
          />
        </div>
      </Island>

      <Island className="mb-3">
        <div className="flex items-center justify-between">
          <div className="my-3 text-Bold20">Специальность</div>
          <Button
            size="s"
            variant="tinted"
            className="flex items-center rounded-full bg-gray-2 text-Medium12"
            onClick={() => setSpecialitiesDialogOpen(true)}
          >
            <ArrowRightOutlined />
          </Button>
        </div>
        <div className="flex justify-between">
          <Controller
            control={filterControl}
            name="speciality_ids"
            defaultValue={[]}
            render={({ field }) => (
              <Chips
                onChange={(value) => {
                  field.onChange(value);

                  const selectedSpecialitiesIds = specializations
                    .filter((speciality) => value.includes(speciality.name))
                    .map((speciality) => speciality.id);

                  setValue("speciality_ids", selectedSpecialitiesIds);
                }}
                chipLabels={specializations
                  .slice(0, 10)
                  .map((specialization) => specialization.name)}
                type="multiselect"
                isCarousel={false}
                className="mb-0"
              />
            )}
          />
        </div>
      </Island>
      <Island className="rounded-b-none">
        <div className="sticky bg-white px-2">
          <Button
            variant="primary"
            className="my-3 w-full"
            onClick={() => {
              onFiltersChange(formData);
              setIsOpen(false);
            }}
            //   disabled={!time}
          >
            Показать
          </Button>
        </div>
      </Island>

      <SpecializationsDialog
        specializations={specializations}
        setSpecializations={setValue}
        openSpecializationsDialog={specialitiesDialogOpen}
        setOpenSpecializationsDialog={setSpecialitiesDialogOpen}
      />
      <ClinicsDialog
        clinicsDialogOpen={clinicsDialogOpen}
        setClinicsDialogOpen={setClinicsDialogOpen}
        clinics={clinics}
        setClinics={setValue}
      />
    </Dialog>
  );
};
