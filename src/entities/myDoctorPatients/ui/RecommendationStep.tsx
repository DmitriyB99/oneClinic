import type { FC } from "react";

import { useTranslations } from "next-intl";

import type { AddNewRecordDialogStepModel } from "@/entities/myDoctorPatients";
import {
  ArrowLeftIcon,
  Button,
  InputTextarea,
  Navbar,
} from "@/shared/components";

export const RecommendationStep: FC<AddNewRecordDialogStepModel> = ({
  back,
  next,
  medicalPrescription,
  setMedicalPrescription,
}) => {
  const t = useTranslations("Common");

  return (
    <div className="mb-20 bg-white">
      <Navbar
        title={t("Recommendations")}
        description={t("StepSomeOfSome", { step: 4, allStep: 4 })}
        leftButtonOnClick={() => back()}
        buttonIcon={<ArrowLeftIcon />}
      />
      <div className="p-4">
        <InputTextarea
          name="recommendations"
          value={medicalPrescription?.recommendations}
          onChange={(event) => {
            setMedicalPrescription?.((prev) => ({
              ...prev,
              recommendations: event.target.value,
            }));
          }}
          isSuccess
          label={t("Recommendations")}
          rows={6}
        />
      </div>
      <div className="fixed bottom-0 z-50 flex w-full justify-between bg-white pb-5 pt-2">
        <Button className="ml-4 mr-2 w-1/2" variant="tertiary" onClick={next}>
          {t("Skip")}
        </Button>
        <Button className="ml-2 mr-4 w-1/2" onClick={next}>
          {t("Next")}
        </Button>
      </div>
    </div>
  );
};
