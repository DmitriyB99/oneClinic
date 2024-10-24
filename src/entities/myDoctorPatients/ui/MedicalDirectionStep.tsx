import type { FC } from "react";
import { useCallback, useState } from "react";

import clsx from "clsx";

import type { DirectionItem, DirectionType } from "@/entities/myDoctorPatients";
import {
  DIRECTION_TYPES,
  MedicalDirectionSelectDialog,
} from "@/entities/myDoctorPatients";
import {
  ArrowLeftIcon,
  Button,
  InputText,
  Island,
  Navbar,
  SegmentedControl,
} from "@/shared/components";

import type {
  MedicalDirectionStepProps,
  MedicalDirectionSelectDialogStateProps,
} from "../models/MedicalDirectionStepProps";

export const MedicalDirectionStep: FC<MedicalDirectionStepProps> = ({
  back,
  next,
  setMedicalPrescription,
  specialityTypes,
  analysisTypes,
  procedureTypes,
}) => {
  const [directions, setDirections] = useState<DirectionType[]>([
    { type: DIRECTION_TYPES.DOCTOR, text: "", categoryId: "" },
  ]);
  const [selectDialogState, setSelectDialogState] =
    useState<MedicalDirectionSelectDialogStateProps | null>(null);

  const [isOpenSelectDirectionDialog, setIsOpenSelectDirectionDialog] =
    useState<boolean>(false);

  const handleNext = useCallback(() => {
    setMedicalPrescription?.((prev) => ({
      ...prev,
      treatmentDirections: directions?.map(({ type, categoryId }) => ({
        category: type,
        categoryId,
      })),
    }));
    next();
  }, [directions, next, setMedicalPrescription]);

  //TODO move to new component
  const renderDirectionType = useCallback(
    (directionType: DIRECTION_TYPES, index: number) => {
      const [inputLabel, selectItems] = (() => {
        switch (directionType) {
          case DIRECTION_TYPES.DOCTOR:
            return ["Тип Специалиста", specialityTypes];
          case DIRECTION_TYPES.MEDICAL_TEST:
            return ["Название анализа", analysisTypes];
          case DIRECTION_TYPES.FUNCTIONAL_DIAGNOSIS:
            return ["Название процедуры", procedureTypes];
          default:
            return ["Тип Специалиста", specialityTypes];
        }
      })();

      return (
        <InputText
          label={inputLabel}
          name={directionType}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onChange={() => {}}
          value={directions[index].text}
          showAsterisk={false}
          onFocus={() => {
            setSelectDialogState({
              selectNumber: index,
              title: inputLabel,
              values: selectItems,
            });
            setIsOpenSelectDirectionDialog(true);
          }}
          wrapperClassName="mt-5"
        />
      );
    },
    [analysisTypes, directions, procedureTypes, specialityTypes]
  );

  const handleDirectionSelect = useCallback(
    (value: DirectionItem, selectNumber: number) => {
      setDirections((prev) => {
        const newDirections = [...prev];
        newDirections[selectNumber] = {
          categoryId: value.categoryId,
          type: value.category,
          text: value.name,
        };
        return newDirections;
      });
    },
    []
  );

  return (
    <div className="bg-gray-2">
      <Navbar
        title="Направление"
        description="Шаг 2 из 4"
        leftButtonOnClick={() => back()}
        buttonIcon={<ArrowLeftIcon />}
      />
      {directions.map((direction, index) => (
        <Island
          key={direction.categoryId}
          className={clsx({
            "mt-2": index !== 0,
          })}
        >
          <SegmentedControl
            options={[
              { label: "Прием", value: DIRECTION_TYPES.DOCTOR },
              { label: "Анализ", value: DIRECTION_TYPES.MEDICAL_TEST },
              {
                label: "Процедура",
                value: DIRECTION_TYPES.FUNCTIONAL_DIAGNOSIS,
              },
            ]}
            size="l"
            onChange={(value) => {
              setDirections((prev) => {
                const newDirections = [...prev];
                newDirections[index] = {
                  categoryId: "",
                  type: value as DIRECTION_TYPES,
                  text: "",
                };
                return newDirections;
              });
            }}
            value={direction.type}
          />
          {renderDirectionType(direction.type, index)}
        </Island>
      ))}
      <Island className="mt-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() =>
            setDirections((prev) => [
              ...prev,
              { type: DIRECTION_TYPES.DOCTOR, text: "", categoryId: "" },
            ])
          }
        >
          Добавить запись
        </Button>
      </Island>
      <div className="fixed bottom-5 flex w-full justify-between">
        <Button className="ml-4 mr-2 w-1/2" variant="tertiary" onClick={next}>
          Пропустить
        </Button>
        <Button className="ml-2 mr-4 w-1/2" onClick={handleNext}>
          Далее
        </Button>
      </div>
      <MedicalDirectionSelectDialog
        selectNumber={selectDialogState?.selectNumber ?? 0}
        title={selectDialogState?.title ?? ""}
        placeholder="Выберите опцию"
        values={selectDialogState?.values ?? []}
        onSelect={handleDirectionSelect}
        onCancel={() => setIsOpenSelectDirectionDialog(false)}
        isOpen={isOpenSelectDirectionDialog}
        setIsOpen={setIsOpenSelectDirectionDialog}
      />
    </div>
  );
};
