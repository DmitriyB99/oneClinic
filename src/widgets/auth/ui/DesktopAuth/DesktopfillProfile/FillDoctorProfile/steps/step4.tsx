import type { FC } from "react";
import { useCallback, useState } from "react";

import { DatePicker } from "antd";
import { Button as AntButton } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { UploadExtraFiles } from "@/entities/desktopFillProfile";
import {
  Button,
  DesktopInputText,
  PlusIcon,
  Select,
} from "@/shared/components";
import { academicDegreesDesktop } from "@/shared/constants"; // после бэка разобраться
import { hasNotEmptyValues } from "@/shared/utils";
import type {
  DoctorDataFillModel,
  EducationListModel,
  RegistrationStepModel,
} from "@/widgets/auth";
import { useQuery } from "react-query";
import { dictionaryApi } from "@/shared/api/dictionary";

const { RangePicker } = DatePicker;

export const Step4FillDoctorProfile: FC<
  RegistrationStepModel<DoctorDataFillModel>
> = ({ next, setValue }) => {
  const [educationList, setEducationList] = useState<EducationListModel[]>([
    { id: 1, name: "", degree: "", years: [], diplomaUrl: "" },
  ]);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");

  const handleEducationChange = useCallback(
    (id: number, key: string, value: string | unknown) => {
      setEducationList((prevEducationList) =>
        prevEducationList.map((education) =>
          education.id === id ? { ...education, [key]: value } : education
        )
      );
    },
    []
  );

  const addEducation = useCallback(
    () =>
      setEducationList((prevEducationList) => [
        ...prevEducationList,
        {
          id: educationList.length + 1,
          name: "",
          degree: "",
          years: [],
          diplomaUrl: "",
        },
      ]),
    [educationList]
  );

  const handleNextClick = useCallback(() => {
    const allEducations = hasNotEmptyValues(educationList);
    const studyDegreesForm = allEducations.map(
      ({ name, degree, years, diplomaUrl }) => ({
        name,
        degree,
        yearStart: dayjs(years[0]).year(),
        yearEnd: dayjs(years[1]).year(),
        diplomaUrl,
      })
    );
    setValue?.("studyDegrees", studyDegreesForm);
    next?.();
  }, [next, setValue, educationList]);

  const { data: universities } = useQuery(["getUniversities"], () =>
    dictionaryApi.getUniversities().then((response) =>
      response.data.result.map(
        (university: { code: string; name: string }) => ({
          id: university.code,
          label: university.name,
        })
      )
    )
  );

  return (
    <>
      {educationList.map((education) => (
        <div key={education.id}>
          <div className="mt-6 text-Bold20">{t("Education")}</div>
          <div className="mt-6 text-Regular14 ">
            {t("EducationalInstitution")}
          </div>
          <Select
            className="mt-2 w-full"
            size="large"
            options={universities ?? []}
            onChange={(value) =>
              handleEducationChange(education.id, "degree", value)
            }
          />
          {/* <DesktopInputText
            wrapperClassName="text-Regular16 mt-2"
            inputClassName="pl-3"
            label={tDesktop("EnterEducationInstitution")}
            desktopDrawer
            showAsterisk={false}
            name="name"
            onChange={(event) =>
              handleEducationChange(education.id, "name", event.target.value)
            }
          /> */}
          <div className="mt-6 text-Regular14 ">{t("AcademicDegree")}</div>
          <Select
            className="mt-2 w-full"
            size="large"
            options={academicDegreesDesktop}
            onChange={(value) =>
              handleEducationChange(education.id, "degree", value)
            }
          />
          <div className="mt-6 text-Regular14 ">{tDesktop("YearsOfStudy")}</div>
          <RangePicker
            className="mt-2 w-full"
            size="large"
            picker="year"
            onChange={(value) =>
              handleEducationChange(education.id, "years", value as unknown)
            }
          />
          <UploadExtraFiles
            title={tDesktop("AttachDiplomCopyPDF")}
            setExtraFileUrl={(url) =>
              handleEducationChange(education.id, "diplomaUrl", url)
            }
          />
        </div>
      ))}
      <AntButton
        className="mt-4 flex h-fit items-center gap-1 rounded-2xl bg-brand-light px-3 py-2 text-Regular14"
        onClick={addEducation}
      >
        {t("AddEducation")} <PlusIcon size="xs" color="" />
      </AntButton>
      <Button
        className="mb-20 mt-11 !h-10 w-full rounded-lg"
        onClick={handleNextClick}
      >
        {t("Next")}
      </Button>
    </>
  );
};
