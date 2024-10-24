import type { FC } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";

import { MedicalCardInformationBlock } from "@/entities/medicalCard";
import { medicalCardApi } from "@/shared/api/medicalCard";
import { patientProfileApi } from "@/shared/api/patient/profile";
import {
  ArrowRightIcon,
  Avatar,
  Button,
  DataEntry,
  DrugIcon,
  Island,
  TinyClockIcon,
} from "@/shared/components";
import {
  DrugIntoleranceDialog,
  PersonalDataDialog,
} from "@/widgets/medicalCard";

import { MyCardAllergyDialog } from "../AllergiesDialog";
import { MyCardInfectionDialog } from "../InfectionsDialog";
import { MedicinesDialog } from "../MedicinesDialog";
import { MyCardVaccineDialog } from "../VaccinesDialog";

export const MyCardPage: FC = () => {
  const [allergyDialogVisible, setAllergyDialogVisible] =
    useState<boolean>(false);
  const [vaccinesDialogVisible, setVaccineDialogVisible] =
    useState<boolean>(false);
  const [infectionsDialogVisible, setInfectionsDialogVisible] =
    useState<boolean>(false);
  const [personalDataDialogVisible, setPersonalDataDialogVisible] =
    useState<boolean>(false);
  const [takeMedicinesDialogVisible, setTakeMedicinesDialogVisible] =
    useState<boolean>(false);
  const [drugDialogVisible, setDrugDialogVisible] = useState<boolean>(false);
  const [selectedDrugIntolerance, setSelectedDrugIntolerance] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState(null);
  const [selectedInfection, setSelectedInfection] = useState(null);
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const {
    data: myProfileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery(["getMyProfile"], () => patientProfileApi?.getMyProfile());

  const { data: myCard, refetch: refetchCard } = useQuery(
    ["getMyMedicalCard"],
    () => medicalCardApi?.getMedicalCard(myProfileData?.data?.id),
    {
      enabled: !!myProfileData?.data?.id,
    }
  );

  const { surname, name, phone, father_name, birth_date } = useMemo(
    () => myProfileData?.data ?? {},
    [myProfileData?.data]
  );

  const personalDataForDialog = useMemo(() => {
    if (myCard?.data && myProfileData?.data) {
      return { ...(myCard?.data || {}), ...myProfileData?.data };
    }
    return { ...myProfileData?.data };
  }, [myCard, myProfileData?.data]);

  const {
    medical_card,
    medical_card_allergy,
    medical_card_drugs_intolerance,
    medical_card_infection,
    medical_card_medication,
    medical_card_vaccine,
  } = useMemo(
    () =>
      myCard?.data || {
        medical_card: {},
        medical_card_allergy: [],
        medical_card_drugs_intolerance: [],
        medical_card_infection: [],
        medical_card_medication: [],
        medical_card_vaccine: [],
      },
    [myCard?.data]
  );

  const isPersonalDataEmpty = useMemo(
    () => Object.keys(medical_card).length === 0,
    [medical_card]
  );

  const isDrugsIntoleranceEmpty = useMemo(
    () => (medical_card_drugs_intolerance ?? [])?.length > 0,
    [medical_card_drugs_intolerance]
  );

  const isMedicationsEmpty = useMemo(
    () => (medical_card_medication ?? [])?.length > 0,
    [medical_card_medication]
  );

  const isAllergiesEmpty = useMemo(
    () => !(Object.keys(medical_card_allergy ?? {}).length > 0),
    [medical_card_allergy]
  );
  const isInfectionsEmpty = useMemo(
    () => !(Object.keys(medical_card_infection ?? {}).length > 0),
    [medical_card_infection]
  );
  const isVaccinesEmpty = useMemo(
    () => !(Object.keys(medical_card_vaccine ?? {}).length > 0),
    [medical_card_vaccine]
  );

  if (isProfileLoading) {
    return (
      <div className="flex h-fit w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-auto bg-gray-0">
        <Island className="mb-2 p-4">
          <div
            className={clsx("mb-6 flex items-center", {
              "justify-between": !isPersonalDataEmpty,
              "justify-start": isPersonalDataEmpty,
            })}
          >
            <div className="text-Bold20">Данные</div>
            {!isPersonalDataEmpty && (
              <Button
                size="s"
                variant="tinted"
                className="bg-gray-2"
                onClick={() => {
                  setPersonalDataDialogVisible(true);
                }}
              >
                <ArrowRightOutlined />
              </Button>
            )}
          </div>
          {(name || surname || father_name) && (
            <DataEntry
              bottomText={`${surname} ${name} ${father_name}`}
              topText="ФИО"
              isDivided
            />
          )}
          {birth_date && (
            <DataEntry
              bottomText={dayjs(birth_date).format("DD.MM.YYYY")}
              topText="Дата рождения"
              isDivided
            />
          )}
          {phone && (
            <DataEntry bottomText={phone} topText="Номер телефона" isDivided />
          )}
          {"weight" in medical_card &&
            medical_card.weight !== null &&
            "height" in medical_card &&
            medical_card.height !== null && (
              <DataEntry
                bottomText={`${medical_card?.height} см, ${medical_card?.weight} кг`}
                topText="Рост/вес"
              />
            )}
          <Button
            className="w-full"
            variant={isPersonalDataEmpty ? "primary" : "secondary"}
            onClick={() => {
              setPersonalDataDialogVisible(true);
            }}
          >
            {isPersonalDataEmpty ? "Заполнить личные данные" : "Редактировать"}
          </Button>
        </Island>
        <MedicalCardInformationBlock
          topText="Аллергия"
          isEmpty={isAllergiesEmpty}
          setDialogVisible={setAllergyDialogVisible}
        >
          {Object.entries(medical_card_allergy ?? {}).map(
            ([key, value], index, array) => (
              <div
                key={key}
                className="flex cursor-pointer items-center justify-between"
                onClick={() => {
                  setAllergyDialogVisible(true);
                  setSelectedAllergy(value);
                }}
              >
                <div>
                  <DataEntry
                    bottomText={value.description}
                    topText={value.allergy}
                    // isDivided={index !== array.length - 1}
                  />
                </div>
                <ArrowRightIcon width={10} height={16} />
              </div>
            )
          )}
        </MedicalCardInformationBlock>
        <MedicalCardInformationBlock
          topText="Непереносимость лекарств"
          isEmpty={!isDrugsIntoleranceEmpty}
          setDialogVisible={setDrugDialogVisible}
        >
          {Object.entries(medical_card_drugs_intolerance ?? {}).map(
            ([key, value], index, array) => (
              <div
                className="flex cursor-pointer items-center justify-between"
                key={key}
                onClick={() => {
                  setDrugDialogVisible(true);
                  setSelectedDrugIntolerance(value);
                }}
              >
                <DataEntry
                  bottomText={value.medication}
                  // isDivided={index !== array.length - 1}
                />
                <ArrowRightIcon width={10} height={16} />
              </div>
            )
          )}
        </MedicalCardInformationBlock>
        <MedicalCardInformationBlock
          topText="Принимаемые лекарства"
          isEmpty={!isMedicationsEmpty}
          setDialogVisible={setTakeMedicinesDialogVisible}
        >
          {Object.entries(medical_card_medication ?? {}).map(
            ([key, value], index, array) => (
              <div
                key={key}
                className="flex cursor-pointer items-center py-3"
                onClick={() => {
                  setTakeMedicinesDialogVisible(true);
                  setSelectedMedicines(value);
                }}
              >
                <Avatar
                  isSquare
                  className="mr-3 bg-gray-1"
                  icon={<DrugIcon />}
                />
                <div>
                  <p className="mb-1 text-Regular16">{value.medication}</p>
                  <p className="mb-0 text-Regular12 text-secondaryText">
                    {`${value.medication_schedule} ${value.medication_schedule_name}`}
                  </p>
                  <p className="mb-0 text-Regular12">
                    <TinyClockIcon width={10} height={10} />{" "}
                    {value.treatment_days} дней
                  </p>
                </div>
                <div className="flex grow justify-end">
                  <ArrowRightIcon width={10} height={16} />
                </div>
              </div>
            )
          )}
        </MedicalCardInformationBlock>
        <MedicalCardInformationBlock
          isEmpty={isVaccinesEmpty}
          setDialogVisible={setVaccineDialogVisible}
          topText="Вакцины"
        >
          {Object.entries(medical_card_vaccine ?? {}).map(
            ([key, value], index, array) => (
              <div
                className="cursor-pointer"
                key={key}
                onClick={() => {
                  setVaccineDialogVisible(true);
                  setSelectedVaccine(value);
                }}
              >
                <DataEntry
                  bottomText={value.vaccine}
                  topText={value.vaccine_date}
                  isDivided={index !== array.length - 1}
                />
              </div>
            )
          )}
        </MedicalCardInformationBlock>
        <MedicalCardInformationBlock
          isEmpty={isInfectionsEmpty}
          setDialogVisible={setInfectionsDialogVisible}
          topText="Болезни и инфекции"
        >
          {Object.entries(medical_card_infection ?? {}).map(
            ([key, value], index, array) => (
              <div
                className="cursor-pointer"
                key={key}
                onClick={() => {
                  setInfectionsDialogVisible(true);
                  setSelectedInfection(value);
                }}
              >
                <DataEntry
                  bottomText={value.infection}
                  topText={value.infection_date}

                  // isDivided={index !== array.length - 1}
                />
                {/* <ArrowRightIcon width={10} height={16} /> */}
              </div>
            )
          )}
        </MedicalCardInformationBlock>
      </div>
      <MyCardAllergyDialog
        allergiesDialogVisible={allergyDialogVisible}
        setAllergiesDialogVisible={(visible) => {
          setAllergyDialogVisible(visible);
          if (!visible) {
            setSelectedAllergy(null);
          }
        }}
        currentMedicalCard={myCard?.data}
        refetchMyCard={refetchCard}
        isEdit={!!selectedAllergy}
        recordData={selectedAllergy}
      />
      <MyCardVaccineDialog
        vaccinesDialogVisible={vaccinesDialogVisible}
        setVaccinesDialogVisible={(visible) => {
          setVaccineDialogVisible(visible);
          if (!visible) {
            setSelectedVaccine(null);
          }
        }}
        currentMedicalCard={myCard?.data}
        refetchMyCard={refetchCard}
        isEdit={!!selectedVaccine}
        recordData={selectedVaccine}
      />
      <MyCardInfectionDialog
        infectionsDialogVisible={infectionsDialogVisible}
        currentMedicalCard={myCard?.data}
        refetchMyCard={refetchCard}
        setInfectionsDialogVisible={(visible) => {
          setInfectionsDialogVisible(visible);
          if (!visible) {
            setSelectedInfection(null);
          }
        }}
        isEdit={!!selectedInfection}
        recordData={selectedInfection}
      />
      <DrugIntoleranceDialog
        drugIntoleranceDialogVisible={drugDialogVisible}
        currentMedicalCard={myCard?.data}
        refetchMyCard={refetchCard}
        setDrugIntoleranceDialogVisible={(visible) => {
          setDrugDialogVisible(visible);
          if (!visible) {
            setSelectedDrugIntolerance(null);
          }
        }}
        isEdit={!!selectedDrugIntolerance}
        recordData={selectedDrugIntolerance}
      />
      <PersonalDataDialog
        personalDataDialogVisible={personalDataDialogVisible}
        setPersonalDataDialogVisible={setPersonalDataDialogVisible}
        refetchMyCard={refetchCard}
        refetchProfile={refetchProfile}
        currentMedicalCard={personalDataForDialog}
      />
      <MedicinesDialog
        takeMedicinesDialogVisible={takeMedicinesDialogVisible}
        setTakeMedicinesDialogVisible={(visible) => {
          setTakeMedicinesDialogVisible(visible);
          if (!visible) {
            setTakeMedicinesDialogVisible(null);
          }
        }}
        refetchMyCard={refetchCard}
        currentMedicalCard={myCard?.data?.medical_card}
        isEdit={!!selectedMedicines}
        recordData={selectedMedicines}
      />
    </>
  );
};
