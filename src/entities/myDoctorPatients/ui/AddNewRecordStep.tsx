import type { FC } from "react";
import { useCallback, useState } from "react";

import { useTranslations } from "next-intl";

import type { AddNewRecordDialogStepModel } from "@/entities/myDoctorPatients";
import { ArrowLeftIcon, Button, InputText, Navbar } from "@/shared/components";

export const AddNewRecordStep: FC<AddNewRecordDialogStepModel> = ({
  back,
  next,
  setMedicalPrescription,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MedicalCard");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [patientComplaints, setPatientComplaints] = useState<string>("");

  const handleNext = useCallback(() => {
    setMedicalPrescription?.((prev) => ({
      ...prev,
      diagnosis,
      patientComplaints,
    }));
    next();
  }, [diagnosis, next, patientComplaints, setMedicalPrescription]);

  return (
    <>
      <Navbar
        title={t("NewBooking")}
        description={tMob("StepOneOfFour")}
        leftButtonOnClick={() => back()}
        buttonIcon={<ArrowLeftIcon />}
      />
      <div className="mt-4 px-4">
        <InputText
          label={tMob("PatientsComplaints")}
          name="patientComplaints"
          value={patientComplaints}
          onChange={(event) => {
            setPatientComplaints(event.target.value);
          }}
          showAsterisk={false}
        />
        <InputText
          label={t("Conclusion")}
          name="diagnosis"
          value={diagnosis}
          onChange={(event) => {
            setDiagnosis(event.target.value);
          }}
          showAsterisk={false}
          wrapperClassName="mt-6"
        />
      </div>
      <div className="absolute bottom-5 w-full px-4">
        <Button variant="primary" className="w-full" onClick={handleNext}>
          {t("Next")}
        </Button>
      </div>
    </>
  );
};
