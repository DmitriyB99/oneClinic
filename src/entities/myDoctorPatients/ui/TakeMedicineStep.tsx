import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import type { AddNewRecordDialogStepModel } from "@/entities/myDoctorPatients";
import { TakeMedicineInputDropdown } from "@/entities/myDoctorPatients";
import type { MedicationPrescriptionModel } from "@/shared/api/medicalPrescription";
import {
  ArrowLeftIcon,
  Button,
  InputText,
  Island,
  Navbar,
  SpinnerWithBackdrop,
} from "@/shared/components";
import { useQuery } from "react-query";
import { dictionaryApi } from "@/shared/api/dictionary";

export const TakeMedicineStep: FC<AddNewRecordDialogStepModel> = ({
  back,
  next,
  medicalPrescription,
  setMedicalPrescription,
}) => {
  const { data: dosages, isLoading: isDosagesLoagind } = useQuery(
    ["getDosages"],
    () =>
      dictionaryApi.getDosages()?.then((response) =>
        response?.data?.result?.map((dose: { code: string; name: string }) => ({
          id: dose.code,
          title: dose.name ?? "No name",
        }))
      )
  );

  const { data: frequencies, isLoading: isFrequenciesLoading } = useQuery(
    ["getMedicationFrequencies"],
    () =>
      dictionaryApi.getMedicationFrequencies().then((response) =>
        response.data.result.map(
          (frequency: { code: string; name: string }) => ({
            id: frequency.code,
            title: frequency.name ?? "No name",
          })
        )
      )
  );

  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MedicalCard");

  const [medications, setMedications] = useState<
    Partial<MedicationPrescriptionModel>[]
  >([
    {
      name: "",
      frequency: "",
      dose: "",
      doseType: "Таблетка",
      frequencyType: "Раз в день",
      durationDays: 0,
    },
  ]);

  useEffect(() => {
    const initialMedications = medicalPrescription?.medications?.map(
      ({ name, frequency, dose, durationDays }) => ({
        name,
        frequency: frequency.split(" ")[0],
        frequencyType: frequency.substring(frequency.indexOf(" ") + 1),
        dose: dose.split(" ")[0],
        doseType: dose.substring(dose.indexOf(" ") + 1),
        durationDays,
      })
    );
    if (initialMedications) {
      setMedications(initialMedications as MedicationPrescriptionModel[]);
    }
  }, [medicalPrescription]);

  const handleNext = useCallback(() => {
    const newMedications = medications?.map(
      ({ name, frequencyType, frequency, doseType, dose, durationDays }) => ({
        name,
        durationDays,
        frequency: `${frequency} ${frequencyType}`,
        dose: `${dose} ${doseType}`,
      })
    );
    setMedicalPrescription?.((prev) => ({
      ...prev,
      medications: newMedications as MedicationPrescriptionModel[],
    }));
    next();
  }, [medications, next, setMedicalPrescription]);

  const handleInputChange = useCallback(
    (value: string | number, index: number, fieldName: string) => {
      setMedications((prev) => {
        const newMedications = [...prev];
        newMedications[index] = {
          ...newMedications[index],
          [fieldName]: value,
        };
        return newMedications;
      });
    },
    []
  );

  if (isDosagesLoagind || isFrequenciesLoading) {
    return <SpinnerWithBackdrop />;
  }

  return (
    <div className="mb-20 bg-gray-2">
      <Navbar
        title={t("TakingMedications")}
        description={tMob("StepThreeOfFour")}
        leftButtonOnClick={() => back()}
        buttonIcon={<ArrowLeftIcon />}
      />
      {medications?.map((medication, index) => (
        <Island key={index} className="rounded-t-none">
          <InputText
            label={tMob("NameOfMedicine")}
            name="medicineName"
            value={String(medication.name)}
            onChange={(event) =>
              handleInputChange(event.target.value, index, "name")
            }
            showAsterisk={false}
          />
          <InputText
            label={tMob("SingleDose")}
            name="dose"
            value={String(medication.dose)}
            onChange={(event) =>
              handleInputChange(event.target.value, index, "dose")
            }
            wrapperClassName="mt-6"
            showAsterisk={false}
            icon={
              <TakeMedicineInputDropdown
                activeItem={medication.doseType}
                isShortened
                setActiveItem={(value) => {
                  handleInputChange(value, index, "doseType");
                }}
                items={dosages}
              />
            }
          />
          <InputText
            label={tMob("ConsumptionSchedule")}
            name="frequency"
            value={String(medication.frequency)}
            onChange={(event) => {
              handleInputChange(event.target.value, index, "frequency");
            }}
            wrapperClassName="mt-6"
            showAsterisk={false}
            icon={
              <TakeMedicineInputDropdown
                activeItem={medication.frequencyType}
                setActiveItem={(value) => {
                  handleInputChange(value, index, "frequencyType");
                }}
                items={frequencies}
              />
            }
          />
          <InputText
            label={tMob("DurationOfTreatmentDays")}
            name="treatmentDuration"
            showAsterisk={false}
            value={String(medication.durationDays)}
            onChange={(event) => {
              handleInputChange(
                parseInt(event?.target.value || "0"),
                index,
                "durationDays"
              );
            }}
            wrapperClassName="mt-6"
          />
        </Island>
      ))}
      <Island className="mt-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() =>
            setMedications((prev) => [
              ...prev,
              {
                name: "",
                frequency: "",
                dose: "",
                doseType: dosages[0].title ?? "",
                frequencyType: frequencies[0].title ?? "",
                durationDays: 0,
              },
            ])
          }
        >
          Добавить лекарство
        </Button>
      </Island>
      <div className="fixed bottom-0 z-50 flex w-full justify-between bg-white pb-5 pt-2">
        <Button className="ml-4 mr-2 w-1/2" variant="tertiary" onClick={next}>
          {t("Skip")}
        </Button>
        <Button className="ml-2 mr-4 w-1/2" onClick={handleNext}>
          {t("Next")}
        </Button>
      </div>
    </div>
  );
};
