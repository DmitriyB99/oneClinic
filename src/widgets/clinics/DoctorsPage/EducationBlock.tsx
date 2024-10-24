import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";

import type { EducationBlockProps } from "@/entities/clinics";
import { DegreesEnum } from "@/entities/clinics";
import {
  Button,
  DefaultCell,
  DividerSaunet,
  Island,
} from "@/shared/components";
import type { EducationBlockModel } from "@/widgets/auth";

export const EducationBlock: FC<EducationBlockProps> = ({
  educations,
  isEditable = false,
  onAddEducation,
}) => {
  const [educationsList, setEducationsList] = useState<EducationBlockModel[]>(
    []
  );

  useEffect(() => {
    setEducationsList(educations ?? []);
  }, [educations]);

  return (
    <Island className="mt-2">
      <p className="mb-3 text-Bold20">Образование</p>
      {educationsList?.map(({ university, degree, study_year }, index) => (
        <Fragment key={index}>
          <div className="py-3">
            <DefaultCell
              title={university}
              caption={study_year}
              subheading={
                DegreesEnum?.[degree as keyof typeof DegreesEnum] as string
              }
              // onClick={() => {
              //   if (diplomaUrl) {
              //     window.open(diplomaUrl, "_blank");
              //   }
              // }}
              hideMainIcon
              rightElement={<></>}
              className="h-fit"
            />
          </div>
          {index !== educationsList.length - 1 && (
            <DividerSaunet className="my-0" />
          )}
        </Fragment>
      ))}
      {isEditable && (
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={onAddEducation}
        >
          Добавить образование
        </Button>
      )}
    </Island>
  );
};
