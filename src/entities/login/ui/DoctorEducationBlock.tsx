import type { FC } from "react";
import { useMemo, useState } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { DoctorEducationBlockModel } from "@/entities/login";
import { doctorsApi } from "@/shared/api/doctors";
import { AutocompleteSaunet, InputFile, InputText } from "@/shared/components";

const academicDegrees = [
  {
    label: "Бакалавр",
    value: "bachelor",
  },
  {
    label: "Магистр",
    value: "master",
  },
  {
    label: "Интерн",
    value: "intern",
  },
  {
    label: "Ординатор",
    value: "resident",
  },
  {
    label: "Кандидат медицинских наук",
    value: "candidate",
  },
  {
    label: "Доктор медицинских наук",
    value: "doctor",
  },
];

export const DoctorEducationBlock: FC<DoctorEducationBlockModel> = ({
  id,
  setEducationBlocks,
  doctorId,
}) => {
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");

  const [educationInstitution, setEducationInstitution] = useState<string>("");
  const [educationStartYear, setEducationStartYear] = useState<string>("");
  const [educationEndYear, setEducationEndYear] = useState<string>("");
  const [diplomaCopy, setDiplomaCopy] = useState<File | null>();
  const isFirst = useMemo(() => id === 0, [id]);

  return (
    <>
      <InputText
        label={t("EducationalInstitution")}
        name="educationInstitution"
        value={educationInstitution}
        onChange={(event) => {
          setEducationInstitution(event.target.value);
        }}
        onBlur={(event) => {
          setEducationBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[id].name = event?.target?.value;
            return newBlocks;
          });
        }}
        showAsterisk={isFirst}
      />
      <AutocompleteSaunet
        label={t("AcademicDegree")}
        onChange={(value) => {
          setEducationBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[id].degree = value;
            return newBlocks;
          });
        }}
        className="mt-6"
        options={academicDegrees}
      />
      <div className="my-6 flex items-center">
        <InputText
          label={tMob("StartYear")}
          name="startingDate"
          value={educationStartYear}
          onChange={(event) => setEducationStartYear(event.target.value)}
          onBlur={(event) => {
            setEducationBlocks((prev) => {
              const newBlocks = [...prev];
              newBlocks[id].yearStart = parseInt(event?.target?.value ?? "");
              return newBlocks;
            });
          }}
          wrapperClassName="mr-2"
          showAsterisk={isFirst}
        />
        <InputText
          label={tMob("YearOfEnding")}
          name="endingDate"
          value={educationEndYear}
          onChange={(event) => setEducationEndYear(event.target.value)}
          onBlur={(event) => {
            setEducationBlocks((prev) => {
              const newBlocks = [...prev];
              newBlocks[id].yearEnd = parseInt(event?.target?.value ?? "");
              return newBlocks;
            });
          }}
          wrapperClassName="ml-2"
          showAsterisk={isFirst}
        />
      </div>
      <InputFile
        onChange={async (files) => {
          const response = await doctorsApi.uploadExtraFiles(
            doctorId,
            files[0]
          );
          setEducationBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[id].diplomaUrl = response.data.fullPath;
            return newBlocks;
          });

          setDiplomaCopy(files[0]);
        }}
        accept=".pdf,.doc,.docx"
        label={diplomaCopy?.name ?? tMob("AddCopyOfYourDiploma")}
        name="diplomaCopy"
        showAsterisk={!diplomaCopy}
        icon={
          diplomaCopy ? (
            <CloseOutlined
              className="cursor-pointer"
              onClick={() => {
                setDiplomaCopy(null);
              }}
            />
          ) : undefined
        }
        bottomText={tMob(
          "AfterCheckingDocumentYouWillHaveCertifiedSpecialistMarkInYourProfile"
        )}
      />
    </>
  );
};
