import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

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
import type { VaccinesDialogProps } from "../InfectionsDialog";

export const MyCardVaccineDialog: FC<VaccinesDialogProps> = ({
  vaccinesDialogVisible,
  setVaccinesDialogVisible,
  currentMedicalCard,
  refetchMyCard,
  isEdit,
  recordData,
}) => {
  const [selectedOption, setSelectedOption] =
    useState<{ id: string; name: string } | null>(null);
  const [dateInputValue, setDateInputValue] = useState<string>("");
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const { searchValue, setSearchValue } = useSearchInput(vaccinesDialogVisible);

  const { memoizedOptions, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLazySearchOptions(dictionaryApi.getVaccines, searchValue, true);

  const { handleScroll } = useScrollFetch(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  );

  useEffect(() => {
    if (isEdit && recordData) {
      setSelectedOption({
        id: recordData.vaccine_id,
        name: recordData.vaccine,
      });
      setDateInputValue(recordData.vaccine_date);
    } else {
      setSelectedOption(null);
      setDateInputValue("");
    }
  }, [isEdit, recordData]);

  const { mutate: createVaccine } = useMutation(
    ["createVaccine"],
    (data: unknown) =>
      medicalCardApi.createVaccine(data).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: updateVaccine } = useMutation(
    ["updateVaccine"],
    (vaccineInfo: {
      medical_card_id: string;
      vaccine_id: string;
      vaccine_date: string;
      id: string;
    }) =>
      medicalCardApi.updateVaccine(vaccineInfo).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: deleteVaccine } = useMutation(
    ["deleteVaccine"],
    (vaccineInfo: { medical_card_id: string; id: string }) =>
      medicalCardApi.deleteVaccine(vaccineInfo).then(() => {
        refetchMyCard();
      })
  );

  const handleSave = () => {
    if (selectedOption && currentMedicalCard) {
      updateVaccine({
        medical_card_id: currentMedicalCard?.medical_card?.id,
        vaccine_id: selectedOption.id,
        vaccine_date: dateInputValue,
        id: recordData?.id,
      });
      setVaccinesDialogVisible(false);
      notification?.success({
        message: "Информация добавлена",
      });
    }
  };

  return (
    <Dialog isOpen={vaccinesDialogVisible} setIsOpen={setVaccinesDialogVisible}>
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col justify-start">
          <div className="flex items-center justify-between">
            <Button
              size="s"
              variant="tinted"
              className="bg-gray-2"
              onClick={() => {
                setVaccinesDialogVisible(false);
                setSelectedOption(null);
                setDateInputValue("");
              }}
            >
              <ArrowLeftIcon />
            </Button>
            <div className="mr-12 text-Bold16">Вакцины</div>
            <div className="w-7" />
          </div>
          <InputSelect
            wrapperClassName="mt-6"
            label="Тип или название вакцины"
            name="Тип или название вакцины"
            value={isEdit ? recordData?.vaccine_id : selectedOption?.id}
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
                createVaccine({
                  vaccine_date: dateInputValue,
                  medical_card_id: currentMedicalCard?.medical_card?.id,
                  vaccine_id: selectedOption.id,
                });
                setVaccinesDialogVisible(false);
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
        deleteMutation={deleteVaccine}
        deletionInfo={{
          medical_card_id: currentMedicalCard?.medical_card?.id,
          id: recordData?.id,
        }}
        refetch={refetchMyCard}
        closeMainDialog={() => setVaccinesDialogVisible(false)}
      />
    </Dialog>
  );
};
