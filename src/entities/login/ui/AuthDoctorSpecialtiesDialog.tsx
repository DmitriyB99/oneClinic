import type { FC } from "react";
import { Fragment, useState } from "react";

import { useTranslations } from "next-intl";

import type { AuthDoctorSpecialtiesModel } from "@/entities/login";
import {
  Button,
  CloseIcon,
  Dialog,
  DividerSaunet,
  InputText,
  Island,
} from "@/shared/components";
import { highlightText } from "@/shared/utils/higlightText";
import { dictionaryApi } from "@/shared/api/dictionary";
import { useQuery } from "react-query";

export const specialties = [
  "Акушер-гинеколог",
  "Аллерголог",
  "Андролог",
  "Анестезиолог",
  "Венеролог",
  "Врач скорой помощи",
  "Гастроэнтеролог",
  "Гематолог",
  "Генетик",
  "Гепатолог",
  "Дерматовенеролог",
  "Дерматолог",
  "Диетолог",
  "Иммунолог",
  "Инфекционист",
  "Кардиолог",
  "Кардиохирург",
  "Косметолог",
  "Логопед",
  "ЛОР",
  "Маммолог",
  "Мануальный терапевт",
  "Массажист",
  "Миколог",
  "Нарколог",
  "Невролог",
  "Нейрохирург",
  "Неонатолог",
];

export const AuthDoctorSpecialtiesDialog: FC<AuthDoctorSpecialtiesModel> = ({
  open,
  setOpen,
  setSpeciality,
}) => {

  const { data: specialities = [] } = useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((res) =>
      res.data.result.map(({ code, name, id }) => ({
        value: code,
        label: name,
        id: id
      }))
    )
  );
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");

  const [specialitySearch, setSpecialitySearch] = useState<string>("");

  return (
    <Dialog
      isOpen={open}
      setIsOpen={setOpen}
      className="h-9/10 !bg-gray-2 !p-0"
    >
      <Island className="mb-2">
        <div className="flex items-center justify-between">
          <div className="whitespace-nowrap text-Bold24">
            {tMob("ChooseSpecialty")}
          </div>
          <Button
            variant="tertiary"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon />
          </Button>
        </div>
        <div>
          <InputText
            label={t("Speciality")}
            name="speciality"
            onChange={(event) => {
              setSpeciality(event.target.value);
              setSpecialitySearch(event.target.value);
            }}
            showAsterisk={false}
          />
        </div>
      </Island>
      <Island>
        <div className="grow overflow-auto">
          {specialities
            .filter((speciality) =>
              speciality.label.toLowerCase().includes(specialitySearch.toLowerCase())
            )
            .map((speciality) => (
              <Fragment key={speciality.id}>
                <div
                  className="flex h-16 items-center justify-start"
                  onClick={() => {
                    setSpeciality(speciality.label);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center justify-start">
                    <div className="mb-1 text-Regular16">
                      {highlightText(speciality.label, specialitySearch)}
                    </div>
                  </div>
                </div>
                <DividerSaunet className="m-0" />
              </Fragment>
            ))}
        </div>
      </Island>
    </Dialog>
  );
};
