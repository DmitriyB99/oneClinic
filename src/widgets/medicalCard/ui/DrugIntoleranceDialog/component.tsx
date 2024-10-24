import type { FC } from "react";
import { useState, useMemo, useEffect } from "react";
import { useMutation, useInfiniteQuery } from "react-query";

import { notification } from "antd";

import { dictionaryApi } from "@/shared/api/dictionary";
import { medicalCardApi } from "@/shared/api/medicalCard";
import { ArrowLeftIcon, Button, Dialog } from "@/shared/components";
import { InputSelect } from "@/shared/components/molecules/input/InputSelect";
import type { DrugIntoleranceDialogProps } from "@/widgets/medicalCard";

import { ConfirmationDialog } from "../ConfirmationDialog/component";
import { useLazySearchOptions } from "@/shared/hooks/useLazySearchOptions";
import { useSearchInput } from "@/shared/hooks/useSearchInput";
import { useScrollFetch } from "@/shared/hooks/useScrollFetch";

export const DrugIntoleranceDialog: FC<DrugIntoleranceDialogProps> = ({
  drugIntoleranceDialogVisible,
  setDrugIntoleranceDialogVisible,
  currentMedicalCard,
  refetchMyCard,
  isEdit,
  recordData,
}) => {
  const [selectedOption, setSelectedOption] =
    useState<{ id: string; title: string } | null>(null);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const { searchValue, setSearchValue } = useSearchInput(
    drugIntoleranceDialogVisible
  );

  const { memoizedOptions, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLazySearchOptions(
      dictionaryApi.getMedications,
      searchValue,
      // !!drugIntoleranceDialogVisible
      true
    );

  const { handleScroll } = useScrollFetch(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  );

  const { mutate: createDrugIntolerance } = useMutation(
    ["createDrugIntolerance"],
    (medicationInfo: { medical_card_id: string; medication_id: string }) =>
      medicalCardApi.createDrugIntolerance(medicationInfo).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: updateDrugIntolerance } = useMutation(
    ["updateDrugIntolerance"],
    (medicationInfo: {
      medical_card_id: string;
      medication_id: string;
      id: string;
    }) =>
      medicalCardApi.updateDrugIntolerance(medicationInfo).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: deleteDrugIntolerance } = useMutation(
    ["deleteDrugIntolerance"],
    (medicationInfo: { medical_card_id: string; id: string }) =>
      medicalCardApi.deleteDrugIntolerance(medicationInfo).then(() => {
        refetchMyCard();
      })
  );

  const handleSave = () => {
    if (selectedOption && currentMedicalCard) {
      updateDrugIntolerance({
        medical_card_id: currentMedicalCard?.medical_card?.id,
        medication_id: selectedOption.id,
        id: recordData?.id,
      });
      setDrugIntoleranceDialogVisible(false);
      notification?.success({
        message: "Информация добавлена",
      });
    }
  };

  const handleDialogClose = () => {
    setDrugIntoleranceDialogVisible(false);
    setSelectedOption(null);
    setSearchValue("");
  };

  return (
    <Dialog
      isOpen={drugIntoleranceDialogVisible}
      setIsOpen={setDrugIntoleranceDialogVisible}
    >
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col justify-start">
          <div className="flex items-center justify-between">
            <Button
              size="s"
              variant="tinted"
              className="bg-gray-2"
              onClick={handleDialogClose}
            >
              <ArrowLeftIcon />
            </Button>
            <div className="mr-12 text-Bold16">Непереносимость Лекарств</div>
            <div />
          </div>
          <InputSelect
            wrapperClassName="mt-6"
            label="Тип или название лекарства"
            name="Тип или название лекарства"
            value={isEdit ? recordData?.medication_id : selectedOption?.id}
            options={memoizedOptions || []}
            onChange={(event) => {
              const selectedId = event.target.value;
              const selected = memoizedOptions.find(
                (option) => option.id === selectedId
              );
              if (selected) setSelectedOption(selected);
            }}
            onSearch={(searchValue) => setSearchValue(searchValue)}
            onScroll={handleScroll}
          />

          {memoizedOptions.length === 0 && searchValue && (
            <div className="text-center text-gray-500 mt-4">
              Поиск не дал результата
            </div>
          )}
        </div>
        <div>
          {isEdit ? (
            <>
              <Button
                className="w-full"
                onClick={handleSave}
                disabled={!selectedOption}
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
                createDrugIntolerance({
                  medical_card_id: currentMedicalCard?.medical_card?.id,
                  medication_id: selectedOption.id,
                });
                handleDialogClose();
                notification?.success({
                  message: "Информация добавлена",
                });
              }}
              disabled={!selectedOption}
            >
              Готово
            </Button>
          )}
        </div>
      </div>
      <ConfirmationDialog
        openConfirmDeleteDialog={openConfirmDeleteDialog}
        setOpenConfirmDeleteDialog={setOpenConfirmDeleteDialog}
        deleteMutation={deleteDrugIntolerance}
        deletionInfo={{
          medical_card_id: currentMedicalCard?.medical_card?.id,
          id: recordData?.id,
        }}
        refetch={refetchMyCard}
        closeMainDialog={handleDialogClose}
      />
    </Dialog>
  );
};
