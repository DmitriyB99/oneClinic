import type { FC } from "react";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

import { notification } from "antd";
import dayjs from "dayjs";

import { dictionaryApi } from "@/shared/api/dictionary";
import { medicalCardApi } from "@/shared/api/medicalCard";
import {
  ArrowLeftIcon,
  Button,
  DataPickerInputText,
  Dialog,
} from "@/shared/components";
import { InputSelect } from "@/shared/components/molecules/input/InputSelect";
import { systemDateWithoutTime } from "@/shared/config";
import { useLazySearchOptions } from "@/shared/hooks/useLazySearchOptions";
import { useScrollFetch } from "@/shared/hooks/useScrollFetch";
import { useSearchInput } from "@/shared/hooks/useSearchInput";

import { ConfirmationDialog } from "../ConfirmationDialog/component";
import type { InfectionsDialogProps } from "../VaccinesDialog";

export const MyCardInfectionDialog: FC<InfectionsDialogProps> = ({
  infectionsDialogVisible,
  setInfectionsDialogVisible,
  currentMedicalCard,
  refetchMyCard,
  isEdit,
  recordData,
}) => {
  const [selectedOption, setSelectedOption] =
    useState<{ id: string; title: string } | null>(null);
  const [dateInputValue, setDateInputValue] = useState<string>("");
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const { searchValue, setSearchValue } = useSearchInput(
    infectionsDialogVisible
  );

  useEffect(() => {
    if (isEdit && recordData) {
      setSelectedOption({
        id: recordData.infection_id,
        title: recordData.infection,
      });
      setDateInputValue(recordData.infection_date);
    } else {
      setSelectedOption(null);
      setDateInputValue("");
    }
  }, [isEdit, recordData]);

  const { memoizedOptions, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLazySearchOptions(
      dictionaryApi.getInfections,
      searchValue,
      // !!takeMedicinesDialogVisible
      true
    );

  const { handleScroll } = useScrollFetch(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  );

  const { mutate: createInfection } = useMutation(
    ["createInfection"],
    (data: unknown) =>
      medicalCardApi.createInfection(data).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: updateInfection } = useMutation(
    ["updateInfection"],
    (infectionInfo: {
      medical_card_id: string;
      infection_id: string;
      infection_date: string;
      id: string;
    }) =>
      medicalCardApi.updateInfection(infectionInfo).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: deleteInfection } = useMutation(
    ["deleteInfection"],
    (infectionInfo: { medical_card_id: string; id: string }) =>
      medicalCardApi.deleteInfection(infectionInfo).then(() => {
        refetchMyCard();
      })
  );

  const handleSave = () => {
    if (selectedOption && currentMedicalCard) {
      updateInfection({
        medical_card_id: currentMedicalCard?.medical_card?.id,
        infection_id: selectedOption.id,
        infection_date: dateInputValue,
        id: recordData?.id,
      });
      setInfectionsDialogVisible(false);
      notification?.success({
        message: "Информация добавлена",
      });
    }
  };

  return (
    <Dialog
      isOpen={infectionsDialogVisible}
      setIsOpen={setInfectionsDialogVisible}
    >
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col justify-start">
          <div className="flex items-center justify-between">
            <Button
              size="s"
              variant="tinted"
              className="bg-gray-2"
              onClick={() => {
                setInfectionsDialogVisible(false);
                setSelectedOption(null);
                setDateInputValue("");
              }}
            >
              <ArrowLeftIcon />
            </Button>
            <div className="mr-12 text-Bold16">Болезни и инфекции</div>
            <div className="w-7" />
          </div>
          <InputSelect
            wrapperClassName="mt-6"
            label="Тип или название болезней и инфекций"
            name="Тип или название болезней и инфекций"
            value={isEdit ? recordData?.infection_id : selectedOption?.id}
            options={memoizedOptions || []}
            onChange={(event) => {
              const selectedId = event.target.value;
              const selected = memoizedOptions?.find(
                (option) => option.id === selectedId
              );
              if (selected) {
                setSelectedOption(selected);
              }
            }}
            onSearch={(searchValue) => setSearchValue(searchValue)}
            onScroll={handleScroll}
          />
          {memoizedOptions.length === 0 && searchValue && (
            <div className="mt-4 text-center text-gray-500">
              Поиск не дал результата
            </div>
          )}
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
        </div>
        <div>
          {isEdit ? (
            <>
              <Button
                className="w-full"
                onClick={handleSave}
                disabled={!selectedOption && !dateInputValue}
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
                createInfection({
                  infection_date: dateInputValue,
                  medical_card_id: currentMedicalCard?.medical_card?.id,
                  infection_id: selectedOption.id,
                });
                setInfectionsDialogVisible(false);
                setSelectedOption(null);
                setDateInputValue("");
                notification?.success({
                  message: "Информация добавлена",
                });
              }}
              disabled={!selectedOption && !dateInputValue}
            >
              Готово
            </Button>
          )}
        </div>
      </div>
      <ConfirmationDialog
        openConfirmDeleteDialog={openConfirmDeleteDialog}
        setOpenConfirmDeleteDialog={setOpenConfirmDeleteDialog}
        deleteMutation={deleteInfection}
        deletionInfo={{
          medical_card_id: currentMedicalCard?.medical_card?.id,
          id: recordData?.id,
        }}
        refetch={refetchMyCard}
        closeMainDialog={() => setInfectionsDialogVisible(false)}
      />
    </Dialog>
  );
};
