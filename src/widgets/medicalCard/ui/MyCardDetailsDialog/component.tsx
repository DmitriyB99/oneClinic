import type { ChangeEvent, FC } from "react";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";

import { medicalCardApi } from "@/shared/api/medicalCard";
import {
  ArrowLeftIcon,
  Button,
  DataPickerInputText,
  Dialog,
  InputText,
} from "@/shared/components";
import dayjs from "dayjs";

import type { MyCardDetailsDialogProps } from "./props";
import { InputSelect } from "@/shared/components/molecules/input/InputSelect";
import { useForm } from "react-hook-form";
import { systemDateWithoutTime } from "@/shared/config";

export const MyCardDetailsDialog: FC<MyCardDetailsDialogProps> = ({
  cardDetailsDialogVisible,
  setCardDetailsDialogVisible,
  topInputLabel,
  topText,
  bottomInputLabel,
  currentMedicalCard,
  fieldName,
  refetchMyCard,
  isTopInputDate = false,
  dropdownOptions,
  recordData,
  isEditing
}) => {
  const [topInputValue, setTopInputValue] = useState<string>("");
  const [dateInputValue, setDateInputValue] = useState<string>("");
  const [bottomInputValue, setBottomInputValue] = useState<string>("");

  const { handleSubmit, reset } = useForm();

  const mutations = {
    createAllergy: useMutation(medicalCardApi.createAllergy, {
      onSuccess: refetchMyCard,
    }),
    createDrugIntolerance: useMutation(medicalCardApi.createDrugIntolerance, {
      onSuccess: refetchMyCard,
    }),
    createInfection: useMutation(medicalCardApi.createInfection, {
      onSuccess: refetchMyCard,
    }),
    createMedication: useMutation(medicalCardApi.createMedication, {
      onSuccess: refetchMyCard,
    }),
    createVaccine: useMutation(medicalCardApi.createVaccine, {
      onSuccess: refetchMyCard,
    }),
  };

  const onSubmit = useCallback(
    async (data) => {
      try {
        const medical_card_id = currentMedicalCard?.medical_card?.id;
        const id = topInputValue;
        const description = bottomInputValue;
        const date = dateInputValue;

        let apiCall;
        let apiData;

        switch (fieldName) {
          case "allergies":
            apiCall = mutations.createAllergy.mutate;
            apiData = { medical_card_id, allergy_id: id, description };
            break;
          case "vaccinesToDate":
            apiCall = mutations.createVaccine.mutate;
            apiData = { medical_card_id, vaccine_id: id, vacide_date: date };
            break;
          case "infectionsToDate":
            apiCall = mutations.createInfection.mutate;
            apiData = { medical_card_id, infection_id: id, infection_date: date };
            break;
          case "drugsToDate":
            apiCall = mutations.createDrugIntolerance.mutate;
            apiData = { medical_card_id, drug_intolerance_id: id };
            break;
          case "medicinesToDate":
            apiCall = mutations.createMedication.mutate;
            apiData = {
              dose: 1,
              dose_id: "string",
              medical_card_id,
              medication_id: "string",
              medication_schedule: 2,
              medication_schedule_id: "312",
              treatment_days: 321,
            };
            break;
          default:
            throw new Error("Unknown field name");
        }

        await apiCall(apiData);
        reset();
        setCardDetailsDialogVisible(false);
      } catch (err) {
        console.error("Error while submitting data:", err);
      }
    },
    [
      currentMedicalCard,
      setCardDetailsDialogVisible,
      mutations,
      fieldName,
      reset,
    ]
  );

  return (
    <Dialog
      isOpen={cardDetailsDialogVisible}
      setIsOpen={setCardDetailsDialogVisible}
    >
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col justify-start">
          <div className="flex items-center justify-between">
            <Button
              size="s"
              variant="tinted"
              className="bg-gray-2"
              onClick={() => {
                setCardDetailsDialogVisible(false);
              }}
            >
              <ArrowLeftIcon />
            </Button>
            <div className="mr-12 text-Bold16">{topText}</div>
          </div>
          {dropdownOptions && (
            <InputSelect
              wrapperClassName="mt-6"
              label={topInputLabel}
              name={topInputLabel}
              value={topInputValue}
              options={dropdownOptions.map((option) => ({
                id: option.id,
                title: option.title,
              }))}
              onChange={(event) => {
                const selectedLabel = event.target.value;
                const selectedOption = dropdownOptions.find(
                  (option) => option.title === selectedLabel
                );
                if (selectedOption) {
                  setTopInputValue(selectedOption.id);
                }
              }}
            />
          )}

          {isTopInputDate && (
            <DataPickerInputText
              format={systemDateWithoutTime}
              onChange={(dateString) => {
                setDateInputValue(dateString?.format(systemDateWithoutTime));
              }}
              value={
                dateInputValue
                  ? dayjs(dateInputValue, systemDateWithoutTime)
                  : null
              }
              className="mt-6"
              onFocus={() => {
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement) {
                  activeElement.blur();
                }
              }}
            />
          )}

          {bottomInputLabel && (
            <InputText
              label={bottomInputLabel}
              name={bottomInputLabel}
              value={bottomInputValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setBottomInputValue(event.target.value);
              }}
              wrapperClassName="mt-6"
            />
          )}
        </div>
        <Button className="w-full" onClick={handleSubmit(onSubmit)}>
          Готово
        </Button>
      </div>
    </Dialog>
  );
};
