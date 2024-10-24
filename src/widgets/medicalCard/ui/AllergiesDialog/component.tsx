import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { notification } from "antd";

import { dictionaryApi } from "@/shared/api/dictionary";
import { medicalCardApi } from "@/shared/api/medicalCard";
import { ArrowLeftIcon, Button, Dialog, InputText } from "@/shared/components";
import { InputSelect } from "@/shared/components/molecules/input/InputSelect";
import { useLazySearchOptions } from "@/shared/hooks/useLazySearchOptions";
import { useScrollFetch } from "@/shared/hooks/useScrollFetch";
import { useSearchInput } from "@/shared/hooks/useSearchInput";

import type { AllergiesDialogProps } from "./props";
import { ConfirmationDialog } from "../ConfirmationDialog/component";

export const MyCardAllergyDialog: FC<AllergiesDialogProps> = ({
  allergiesDialogVisible,
  setAllergiesDialogVisible,
  currentMedicalCard,
  refetchMyCard,
  isEdit,
  recordData,
}) => {
  const [selectedOption, setSelectedOption] =
    useState<{ id: string; name: string } | null>(null);
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    useState<boolean>(false);
  const { searchValue, setSearchValue } = useSearchInput(
    allergiesDialogVisible
  );

  const { memoizedOptions, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLazySearchOptions(
      dictionaryApi.getAllergies,
      searchValue,
      // !!allergiesDialogVisible
      true
    );

  const { handleScroll } = useScrollFetch(
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  );

  useEffect(() => {
    if (isEdit && recordData) {
      setSelectedOption({
        id: recordData.allergy_id,
        name: recordData.allergy,
      });
      setDescriptionValue(recordData.description);
    } else {
      setSelectedOption(null);
      setDescriptionValue("");
    }
  }, [isEdit, recordData]);

  const { mutate: createAllergy } = useMutation(
    ["createAllergy"],
    (data: unknown) =>
      medicalCardApi.createAllergy(data).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: updateAllergy } = useMutation(
    ["updateAllergy"],
    (allergyInfo: {
      medical_card_id: string;
      allergy_id: string;
      id: string;
      description: string;
    }) =>
      medicalCardApi.updateAllergy(allergyInfo).then(() => {
        refetchMyCard();
      })
  );

  const { mutate: deleteAllergy } = useMutation(
    ["deleteAllergy"],
    (allergyInfo: { medical_card_id: string; id: string }) =>
      medicalCardApi.deleteAllergy(allergyInfo).then(() => {
        refetchMyCard();
      })
  );

  const handleSave = () => {
    if (selectedOption && currentMedicalCard) {
      updateAllergy({
        medical_card_id: currentMedicalCard?.medical_card?.id,
        allergy_id: selectedOption.id,
        id: recordData?.id,
        description: descriptionValue,
      });
      setAllergiesDialogVisible(false);
      notification?.success({
        message: "Информация добавлена",
      });
    }
  };

  const handleDialogClose = () => {
    setAllergiesDialogVisible(false);
    setSelectedOption(null);
    setSearchValue("");
  };

  return (
    <Dialog
      isOpen={allergiesDialogVisible}
      setIsOpen={setAllergiesDialogVisible}
    >
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col justify-start">
          <div className="flex items-center justify-between">
            <Button
              size="s"
              variant="tinted"
              className="bg-gray-2"
              onClick={() => {
                setAllergiesDialogVisible(false);
                setSelectedOption(null);
                setDescriptionValue("");
              }}
            >
              <ArrowLeftIcon />
            </Button>
            <div className="mr-12 text-Bold16">Аллергия</div>
            <div className="w-7" />
          </div>
          <InputSelect
            wrapperClassName="mt-6"
            label="Тип аллергии"
            name="Тип аллергии"
            value={isEdit ? recordData?.allergy_id : selectedOption?.id}
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
          <InputText
            label="Описание"
            name="Описание"
            value={descriptionValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setDescriptionValue(event.target.value);
            }}
            wrapperClassName="mt-6"
          />
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
                createAllergy({
                  medical_card_id: currentMedicalCard?.medical_card?.id,
                  allergy_id: selectedOption.id,
                  description: descriptionValue,
                });
                setAllergiesDialogVisible(false);
                setSelectedOption(null);
                setDescriptionValue("");
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
        deleteMutation={deleteAllergy}
        deletionInfo={{
          medical_card_id: currentMedicalCard?.medical_card?.id,
          id: recordData?.id,
        }}
        refetch={refetchMyCard}
        closeMainDialog={() => setAllergiesDialogVisible(false)}
      />
    </Dialog>
  );
};
