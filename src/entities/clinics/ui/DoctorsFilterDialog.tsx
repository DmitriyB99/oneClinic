import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import { SpecializationsDialog, ClinicsDialog } from "@/entities/dutyDoctor";
import {
  ExperienceYears,
  patientDoctorsApi,
} from "@/shared/api/patientContent/doctors";
import {
  Button,
  Chips,
  Dialog,
  DividerSaunet,
  InputText,
  Island,
  Toggle,
} from "@/shared/components";
import { DoctorConsultationTypeEnum } from "@/widgets/auth";

import { DatePickDialog } from "./DatePickDialog";

export const defaultFilter = {
  is_nearby: false,
  is_online: false,
  is_working: false,
  weekends: false,
  cost: {
    min: 0,
    max: 0,
  },
  appointment_date: [],
  services: [],
  clinic_ids: [],
  speciality_ids: [],
  experiences: [],
  location: [],
};

export const DoctorsFilterDialog = ({ isOpen, setIsOpen, onFiltersChange }) => {
  const { control: filterControl, watch, setValue, reset } = useForm();

  const formData = watch();
  const filterParams = useMemo(() => {
    const {
      is_nearby,
      is_online = false,
      is_working,
      weekends = false,
      cost_min,
      cost_max,
      appointment_date,
      services,
      clinic_ids,
      speciality_ids,
      experiences,
    } = formData;

    const appointmentDateChips = appointment_date || [];
    const formated_appointment_date = appointmentDateChips
      .map((dateOption) => {
        if (dateOption === "Сегодня") {
          return new Date().toISOString().split("T")[0];
        } else if (dateOption === "Завтра") {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.toISOString().split("T")[0];
        } else if (dateOption !== "Указать дату") {
          return dateOption;
        }
        return null;
      })
      .filter(Boolean);

    return {
      is_nearby,
      is_online,
      is_working,
      weekends,
      cost: {
        min: Number(cost_min) || 0,
        max: Number(cost_max) || 0,
      },
      appointment_date: formated_appointment_date,
      services,
      clinic_ids,
      speciality_ids,
      experiences,
    };
  }, [formData]);

  const { data: doctorsFilter } = useQuery(
    ["getDoctors", formData],
    () =>
      patientDoctorsApi.getDoctorsFilter(filterParams).then((res) => res.data),
    { enabled: isOpen }
  );

  const handleReset = () => {
    reset(defaultFilter);
  };

  const t = useTranslations("Common");

  const [specialitiesDialogOpen, setSpecialitiesDialogOpen] =
    useState<boolean>(false);
  const [clinicsDialogOpen, setClinicsDialogOpen] = useState<boolean>(false);
  const [datePickDialogOpen, setDatePickDialogOpen] = useState<boolean>(false);

  const clinics = useMemo(() => doctorsFilter?.clinics || [], [doctorsFilter]);
  const specializations = useMemo(
    () => doctorsFilter?.specialties || [],
    [doctorsFilter]
  );

  const handleDateSelected = (selectedDate) => {
    setValue("appointment_date", selectedDate);
  };

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
        <div className="my-3 text-Bold20">Стоимость</div>
        <div className="flex justify-between pt-3">
          <Controller
            control={filterControl}
            name="cost_min"
            render={({ field }) => (
              <InputText
                label={"от"}
                value={field.value}
                name="cost_min"
                onChange={(value) => {
                  field.onChange(value);
                }}
                wrapperClassName={"mr-3"}
                showAsterisk={false}
              />
            )}
          />
          <Controller
            control={filterControl}
            name="cost_max"
            render={({ field }) => (
              <InputText
                label={"до"}
                value={field.value}
                name="cost_max"
                onChange={(value) => {
                  field.onChange(value);
                }}
                wrapperClassName={"ml-3"}
                showAsterisk={false}
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
                  const worksOnWeekends = value.includes("Работает в выходные");

                  setValue("is_working", isOnline);
                  setValue("weekends", worksOnWeekends);
                }}
                chipLabels={["Открыто сейчас", "Работает в выходные"]}
                type="multiselect"
                isCarousel={false}
                className="mb-0"
              />
            )}
          />
        </div>
      </Island>
      <Island className="mb-3">
        <div className="my-3 text-Bold20">Дата приема</div>
        <div className="flex justify-between">
          <Controller
            control={filterControl}
            name="appointment_date"
            defaultValue={[]}
            render={({ field }) => (
              <Chips
                onChange={(value) => {
                  field.onChange(value);
                  setValue("appointment_date", value);
                  value.includes("Указать дату") && setDatePickDialogOpen(true);
                }}
                chipLabels={["Сегодня", "Завтра", "Указать дату"]}
                type="multiselect"
                isCarousel={false}
                className="mb-0"
              />
            )}
          />
        </div>
      </Island>
      <Island className="mb-3">
        <div className="my-3 text-Bold20">Услуги</div>
        <div className="flex justify-between">
          <Controller
            control={filterControl}
            name="services"
            defaultValue={[]}
            render={({ field }) => (
              <Chips
                onChange={(value: string[]) => {
                  field.onChange(value);

                  const isOnline = value.includes("Онлайн-консультация");
                  setValue("is_online", isOnline);

                  const mappedServices = value
                    .map((service) => {
                      switch (service) {
                        case "Онлайн-консультация":
                          return DoctorConsultationTypeEnum.ONLINE;
                        case "Прием в клинике":
                          return DoctorConsultationTypeEnum.OFFLINE;
                        case "Выезд на дом":
                          return DoctorConsultationTypeEnum.AWAY;
                        default:
                          return null;
                      }
                    })
                    .filter(Boolean);

                  setValue("services", mappedServices);
                }}
                chipLabels={[
                  "Онлайн-консультация",
                  "Прием в клинике",
                  "Выезд на дом",
                ]}
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
        <div className="my-3 text-Bold20">Опыт</div>
        <div className="mb-2 flex justify-between">
          <Controller
            control={filterControl}
            name="experiences"
            defaultValue={[]}
            render={({ field }) => (
              <Chips
                onChange={(value: string[]) => {
                  const mappedExperience = value
                    .map((experience) => {
                      switch (experience) {
                        case t(ExperienceYears.OneToThree):
                          return ExperienceYears.OneToThree;
                        case t(ExperienceYears.SixPlus):
                          return ExperienceYears.SixPlus;
                        default:
                          return ExperienceYears.ThreeToSix;
                      }
                    })
                    .filter(Boolean);

                  field.onChange(value);
                  setValue("experiences", mappedExperience);
                }}
                chipLabels={[
                  t(ExperienceYears.OneToThree),
                  t(ExperienceYears.ThreeToSix),
                  t(ExperienceYears.SixPlus),
                ]}
                type="single"
                isCarousel={false}
                className="mb-0"
              />
            )}
          />
        </div>
        <DividerSaunet className="my-3" />
        <div className="sticky bg-white px-2">
          <Button
            variant="primary"
            className="my-3 w-full"
            onClick={() => {
              onFiltersChange(filterParams);
              setIsOpen(false);
            }}
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
      <DatePickDialog
        datePickDialogOpen={datePickDialogOpen}
        setDatePickDialogOpen={setDatePickDialogOpen}
        onDateSelected={handleDateSelected}
      />
    </Dialog>
  );
};
