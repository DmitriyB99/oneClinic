import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { notification, Spin } from "antd";
import { useTranslations } from "next-intl";

import { dictionaryApi } from "@/shared/api/dictionary";
import type { Medication } from "@/shared/api/medicalCard";
import { medicalCardApi } from "@/shared/api/medicalCard";
import {
  ArrowLeftIcon,
  Button,
  Dialog,
  InputText,
  Island,
} from "@/shared/components";
import { InputSelect } from "@/shared/components/molecules/input/InputSelect";
import { useLazySearchOptions } from "@/shared/hooks/useLazySearchOptions";
import { useScrollFetch } from "@/shared/hooks/useScrollFetch";
import { useSearchInput } from "@/shared/hooks/useSearchInput";

import { ConfirmationDialog } from "../ConfirmationDialog/component";

export const MedicinesDialog = ({
  takeMedicinesDialogVisible,
  setTakeMedicinesDialogVisible,
  refetchMyCard,
  currentMedicalCard,
  isEdit,
  recordData,
}) => {
  const [medicationInputValue, setMedicationInputValue] =
    useState<{ id: string; name: string } | null>(null);
  const [dosagesInputValue, setDosagesInputValue] =
    useState<{ id: string; name: string } | null>(null);
  const [frequenciesInputValue, setFrequenciesInputValue] =
    useState<{ id: string; name: string } | null>(null);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const { searchValue, setSearchValue } = useSearchInput(
    takeMedicinesDialogVisible
  );

  const { memoizedOptions, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLazySearchOptions(
      dictionaryApi.getMedications,
      searchValue,
      // !!takeMedicinesDialogVisible
      true
    );

  const { handleScroll } = useScrollFetch(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  );

  const { data: dosages } = useQuery(
    ["getDosages"],
    () =>
      dictionaryApi.getDosages()?.then((response) =>
        response?.data?.result?.map((dose: { id: string; name: string }) => ({
          id: dose.id,
          name: dose.name ?? "No name",
        }))
      ),
    { enabled: !!takeMedicinesDialogVisible }
  );

  const { data: frequencies } = useQuery(
    ["getMedicationFrequencies"],
    () =>
      dictionaryApi.getMedicationFrequencies().then((response) =>
        response.data.result.map((frequency: { id: string; name: string }) => ({
          id: frequency.id,
          name: frequency.name ?? "No name",
        }))
      ),
    { enabled: !!takeMedicinesDialogVisible }
  );

  const tMob = useTranslations("Mobile.MedicalCard");

  const [medications, setMedications] = useState<Partial<Medication>>({
    medical_card_id: currentMedicalCard?.id,
    medication_id: "",
    dose: 0,
    dose_id: "",
    medication_schedule: 0,
    medication_schedule_id: "",
    treatment_days: 0,
  });

  useEffect(() => {
    if (recordData) {
      setMedications({
        medical_card_id: currentMedicalCard?.id || "",
        medication_id: recordData.medication_id || "",
        dose: recordData.dose || 0,
        dose_id: recordData.dose_id || "",
        medication_schedule: recordData.medication_schedule || 0,
        medication_schedule_id: recordData.medication_schedule_id || "",
        treatment_days: recordData.treatment_days || 0,
      });
      setMedicationInputValue({
        id: recordData.medication_id,
        name: recordData.medication,
      });
      setDosagesInputValue({
        id: recordData.dose_id,
        name: recordData.dose_name,
      });
      setFrequenciesInputValue({
        id: recordData.medication_schedule_id,
        name: recordData.medication_schedule_name,
      });
    }
  }, [recordData, currentMedicalCard]);

  useEffect(() => {
    if (currentMedicalCard?.id) {
      setMedications((prev) => ({
        ...prev,
        medical_card_id: currentMedicalCard.id,
      }));
    }
  }, [currentMedicalCard]);

  const resetValues = () => {
    setMedicationInputValue(null);
    setDosagesInputValue(null);
    setFrequenciesInputValue(null);
    setMedications({
      medical_card_id: currentMedicalCard?.id || "",
      medication_id: "",
      dose: 0,
      dose_id: "",
      medication_schedule: 0,
      medication_schedule_id: "",
      treatment_days: 0,
    });
  };

  const { mutate: createMedication } = useMutation(
    ["createMedication"],
    (data: Medication) =>
      medicalCardApi.createMedication(data).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: updateMedication } = useMutation(
    ["updateMedication"],
    (medicationInfo: Medication & { id: string }) =>
      medicalCardApi.updateMedication(medicationInfo).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: deleteMedication } = useMutation(
    ["deleteMedication"],
    (medicationInfo: { medical_card_id: string; id: string }) =>
      medicalCardApi.deleteMedication(medicationInfo).then(() => {
        refetchMyCard();
      })
  );

  const handleInputChange = useCallback(
    (value: string | number, fieldName: keyof Medication) => {
      setMedications((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    },
    []
  );

  const handleSave = () => {
    if (medicationInputValue && currentMedicalCard) {
      updateMedication({ ...(medications as Medication), id: recordData?.id });
      setTakeMedicinesDialogVisible(false);
      resetValues();
      notification?.success({
        message: "Информация добавлена",
      });
    }
  };

  return (
    <Dialog
      isOpen={takeMedicinesDialogVisible}
      setIsOpen={setTakeMedicinesDialogVisible}
      className="h-screen"
    >
      {!memoizedOptions || !dosages || !frequencies ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spin />
        </div>
      ) : (
        <div className="flex h-screen flex-col justify-between">
          <div className="flex flex-col justify-start">
            <div className="flex items-center justify-between">
              <Button
                size="s"
                variant="tinted"
                className="bg-gray-2"
                onClick={() => {
                  setTakeMedicinesDialogVisible(false);
                  resetValues();
                }}
              >
                <ArrowLeftIcon />
              </Button>
              <div className="mr-12 text-Bold16">Принимаемые лекарства</div>
              <div className="w-4" />
            </div>

            <Island className="mt-4 rounded-none !p-0">
              <InputSelect
                wrapperClassName="mt-6"
                label={tMob("NameOfMedicine")}
                name="medicineName"
                value={
                  isEdit ? recordData.medication_id : medicationInputValue?.id
                }
                options={memoizedOptions || []}
                onChange={(event) => {
                  const selectedId = event.target.value;
                  const selected = memoizedOptions?.find(
                    (option) => option.id === selectedId
                  );
                  if (selected) {
                    handleInputChange(selected.id, "medication_id");
                    setMedicationInputValue({
                      id: selected.id,
                      name: selected.name,
                    });
                  }
                }}
                onSearch={(searchValue) => setSearchValue(searchValue)}
                onScroll={handleScroll}
                showAsterisk={true}
              />
              {memoizedOptions.length === 0 && searchValue && (
                <div className="mt-4 text-center text-gray-500">
                  Поиск не дал результата
                </div>
              )}
              <InputText
                label={tMob("SingleDose")}
                name="dose"
                value={String(medications.dose)}
                onChange={(event) =>
                  handleInputChange(Number(event.target.value), "dose")
                }
                wrapperClassName="mt-6"
                showAsterisk={false}
                icon={
                  <InputSelect
                    wrapperClassName="ml-2"
                    label="табл."
                    name="doseType"
                    readOnly
                    value={isEdit ? recordData.dose_id : dosagesInputValue?.id}
                    options={dosages || []}
                    onChange={(event) => {
                      const selectedId = event.target.value;
                      const selected = dosages?.find(
                        (option) => option.id === selectedId
                      );
                      if (selected) {
                        handleInputChange(selected.id, "dose_id");
                        setDosagesInputValue({
                          id: selected.id,
                          name: selected.name,
                        });
                      }
                    }}
                    showAsterisk={true}
                  />
                }
              />
              <InputText
                label={tMob("ConsumptionSchedule")}
                name="frequency"
                value={String(medications.medication_schedule)}
                onChange={(event) =>
                  handleInputChange(
                    Number(event.target.value),
                    "medication_schedule"
                  )
                }
                wrapperClassName="mt-6"
                showAsterisk={false}
                icon={
                  <InputSelect
                    wrapperClassName="ml-2"
                    label="раз в день"
                    name="scheduleType"
                    readOnly
                    value={
                      isEdit
                        ? recordData.medication_schedule_id
                        : frequenciesInputValue?.id
                    }
                    options={frequencies || []}
                    onChange={(event) => {
                      const selectedId = event.target.value;
                      const selected = frequencies?.find(
                        (option) => option.id === selectedId
                      );
                      if (selected) {
                        handleInputChange(
                          selected.id,
                          "medication_schedule_id"
                        );
                        setMedicationInputValue({
                          id: selected.id,
                          name: selected.name,
                        });
                      }
                    }}
                    showAsterisk={true}
                  />
                }
              />
              <InputText
                label={tMob("DurationOfTreatmentDays")}
                name="treatmentDuration"
                showAsterisk={false}
                value={String(medications.treatment_days)}
                onChange={(event) =>
                  handleInputChange(
                    Number(event.target.value),
                    "treatment_days"
                  )
                }
                wrapperClassName="mt-6"
              />
            </Island>
          </div>
          <div>
            {isEdit ? (
              <>
                <Button
                  className="w-full"
                  onClick={handleSave}
                  // disabled={!medicationInputValue}
                >
                  Готово
                </Button>
                <Button
                  className="mt-4 w-full text-Medium16 text-red"
                  variant="tertiary"
                  onClick={() => {
                    setOpenConfirmDeleteDialog(true);
                  }}
                >
                  Удалить
                </Button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  createMedication(medications as Medication);
                  setTakeMedicinesDialogVisible(false);
                  resetValues();
                  notification?.success({
                    message: "Информация добавлена",
                  });
                }}
                // disabled={!medicationInputValue}
              >
                Готово
              </Button>
            )}
          </div>
        </div>
      )}
      <ConfirmationDialog
        openConfirmDeleteDialog={openConfirmDeleteDialog}
        setOpenConfirmDeleteDialog={setOpenConfirmDeleteDialog}
        deleteMutation={deleteMedication}
        deletionInfo={{
          medical_card_id: currentMedicalCard?.medical_card?.id,
          id: recordData?.id,
        }}
        refetch={refetchMyCard}
        closeMainDialog={() => setTakeMedicinesDialogVisible(false)}
      />
    </Dialog>
  );
};
