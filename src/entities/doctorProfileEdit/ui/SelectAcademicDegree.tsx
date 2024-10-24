import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { Dialog, InputText, InteractiveList } from "@/shared/components";
import { academicDegrees } from "@/shared/constants";

import type { SelectAcademicDegreeProps } from "../models/SelectAcademicDegree";

export const SelectAcademicDegree: FC<SelectAcademicDegreeProps> = ({
  onSelectAcademicDegree,
  inputValue,
}) => {
  const tMob = useTranslations("Mobile.MyDoctor");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAcademicDegree, setSelectedAcademicDegree] =
    useState<string | number>("");

  useEffect(() => {
    const selectedLabel =
      academicDegrees.find(({ value }) => value === inputValue)?.label ?? "";
    setSelectedAcademicDegree(selectedLabel);
  }, [inputValue]);

  const list = useMemo(
    () =>
      academicDegrees.map(({ label, value }) => ({
        title: label,
        id: value,
        endIcon: <></>,
      })),
    []
  );

  const handleSelectAcademicDegree = (id: string | number) => {
    const selectedLabel =
      academicDegrees.find(({ value }) => value === id)?.label ?? "";
    setSelectedAcademicDegree(selectedLabel);
    onSelectAcademicDegree(id);
    setIsOpen(false);
  };

  return (
    <>
      <InputText
        name="academicDegree"
        label={tMob("AcademicDegree")}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
        onFocus={() => setIsOpen(true)}
        value={String(selectedAcademicDegree)}
        showAsterisk={false}
      />
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <InteractiveList list={list} onClick={handleSelectAcademicDegree} />
      </Dialog>
    </>
  );
};
