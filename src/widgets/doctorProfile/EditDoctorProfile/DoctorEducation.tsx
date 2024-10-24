import type { FC } from "react";
import { Fragment, useCallback, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type {
  EducationFormInputs,
  CertificateFormInputs,
} from "@/entities/doctorProfileEdit";
import {
  AddEducationForm,
  AddCertificateForm,
} from "@/entities/doctorProfileEdit";
import type { EditDoctorProfileForm } from "@/pages/myDoctor/editProfile";
import {
  Button,
  DefaultCell,
  DividerSaunet,
  Island,
} from "@/shared/components";
import type { CertificateModel, EducationBlockModel } from "@/widgets/auth";
import { EducationBlock } from "@/widgets/clinics/DoctorsPage";

interface DoctorEducationProps {
  doctorId: string;
  setValue: UseFormSetValue<EditDoctorProfileForm>;
  certificates?: CertificateModel[];
  studyDegrees?: EducationBlockModel[];
}

export const DoctorEducation: FC<DoctorEducationProps> = ({
  doctorId,
  setValue,
  certificates,
  studyDegrees,
}) => {
  const [isAddEducationOpen, setIsAddEducationOpen] = useState<boolean>(false);
  const [isAddCertificateOpen, setIsAddCertificateOpen] =
    useState<boolean>(false);

  const handleAddEducationFormSubmit = useCallback(
    (data: EducationFormInputs) => {
      setValue("studyDegrees", data.studyDegrees);
    },
    [setValue]
  );

  const handleAddCertificateFormSubmit = useCallback(
    (data: CertificateFormInputs) => {
      setValue("certificates", data.certificates);
    },
    [setValue]
  );

  return (
    <>
      <EducationBlock
        isEditable
        educations={studyDegrees}
        onAddEducation={() => setIsAddEducationOpen(true)}
      />
      <Island className="mt-2">
        <div className="mb-7 text-Bold20">Сертификаты</div>
        {certificates?.map(
          ({ name, certificateUrl, yearEarned, id }, index) => (
            <Fragment key={id}>
              <div className="py-3">
                <DefaultCell
                  title={name}
                  caption={yearEarned?.toString() ?? ""}
                  onClick={() => {
                    if (certificateUrl) {
                      window.open(certificateUrl, "_blank");
                    }
                  }}
                  hideMainIcon
                  className="h-fit"
                />
              </div>
              {index !== certificates.length - 1 && (
                <DividerSaunet className="my-0" />
              )}
            </Fragment>
          )
        )}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setIsAddCertificateOpen(true)}
        >
          Добавить сертификат
        </Button>
      </Island>
      <AddEducationForm
        doctorId={doctorId}
        isOpen={isAddEducationOpen}
        setIsOpen={setIsAddEducationOpen}
        onFormSubmit={handleAddEducationFormSubmit}
        existingStudyDegrees={studyDegrees ?? []}
      />
      <AddCertificateForm
        doctorId={doctorId}
        isOpen={isAddCertificateOpen}
        setIsOpen={setIsAddCertificateOpen}
        onFormSubmit={handleAddCertificateFormSubmit}
        existingCertificates={certificates ?? []}
      />
    </>
  );
};
