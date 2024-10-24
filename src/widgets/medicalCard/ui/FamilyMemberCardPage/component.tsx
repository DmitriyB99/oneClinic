import { useMemo } from "react";
import { useQuery } from "react-query";

import { Spin } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";

import { MedicalCardInformationBlock } from "@/entities/medicalCard";
import { medicalCardApi } from "@/shared/api/medicalCard";
import {
  Avatar,
  DataEntry,
  DrugIcon,
  Island,
  TinyClockIcon,
} from "@/shared/components";
export const FamilyMemberCardPage = ({ familyMemberData }) => {
  const { data: myCard } = useQuery(
    ["getMyMedicalCard"],
    () => medicalCardApi?.getMedicalCard(familyMemberData?.id),
    {
      enabled: !!familyMemberData?.id,
    }
  );

  const { surname, name, phone, father_name, birth_date } = useMemo(
    () => familyMemberData ?? {},
    [familyMemberData]
  );

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

  if (!familyMemberData?.id) {
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
          {"weight" in medical_card && "height" in medical_card && (
            <DataEntry
              bottomText={`${medical_card?.height} см, ${medical_card?.weight} кг`}
              topText="Рост/вес"
            />
          )}
        </Island>
        <MedicalCardInformationBlock
          topText="Аллергия"
          isEmpty={isAllergiesEmpty}
        >
          {Object.entries(medical_card_allergy ?? {}).map(
            ([key, value], index, array) => (
              <DataEntry
                bottomText={value.description}
                topText={value.allergy}
                key={key}
                isDivided={index !== array.length - 1}
              />
            )
          )}
        </MedicalCardInformationBlock>
        <MedicalCardInformationBlock
          topText="Непереносимость лекарств"
          isEmpty={!isDrugsIntoleranceEmpty}
        >
          {Object.entries(medical_card_drugs_intolerance ?? {}).map(
            ([key, value], index, array) => (
              <DataEntry
                bottomText={value.drugs_intolerance}
                isDivided={index !== array.length - 1}
                key={key}
              />
            )
          )}
        </MedicalCardInformationBlock>
        <MedicalCardInformationBlock
          topText="Принимаемые лекарства"
          isEmpty={!isMedicationsEmpty}
        >
          {Object.entries(medical_card_medication ?? {}).map(
            ([key, value], index, array) => (
              <div key={key} className="flex cursor-pointer items-center py-3">
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
              </div>
            )
          )}
        </MedicalCardInformationBlock>
        <MedicalCardInformationBlock
          isEmpty={isVaccinesEmpty}
          topText="Вакцины"
        >
          {Object.entries(medical_card_vaccine ?? {}).map(
            ([key, value], index, array) => (
              <DataEntry
                bottomText={value.vaccine}
                topText={value.vaccine_date}
                isDivided={index !== array.length - 1}
                key={key}
              />
            )
          )}
        </MedicalCardInformationBlock>
        <MedicalCardInformationBlock
          isEmpty={isInfectionsEmpty}
          topText="Болезни и инфекции"
        >
          {Object.entries(medical_card_infection ?? {}).map(
            ([key, value], index, array) => (
              <DataEntry
                key={key}
                bottomText={value.infection}
                topText={value.infection_date}
                isDivided={index !== array.length - 1}
              />
            )
          )}
        </MedicalCardInformationBlock>
      </div>
    </>
  );
};
