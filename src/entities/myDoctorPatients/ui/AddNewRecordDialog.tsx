import type { FC } from "react";
import { useCallback, useState } from "react";
import { useMutation, useQuery } from "react-query";

import type { AddNewRecordDialogModel } from "@/entities/myDoctorPatients";
import {
  AddNewRecordStep,
  DIRECTION_TYPES,
  MedicalDirectionStep,
  RecommendationStep,
  TakeMedicineStep,
} from "@/entities/myDoctorPatients";
import { dictionaryApi } from "@/shared/api/dictionary";
import type { CreateNewPrescription } from "@/shared/api/medicalPrescription";
import { medicalPrescriptionApi } from "@/shared/api/medicalPrescription";
import { Dialog } from "@/shared/components";

export const AddNewRecordDialog: FC<AddNewRecordDialogModel> = ({
  consultationId,
  userId,
  userProfileId,
  setIsOpen,
  isOpen,
}) => {
  const [step, setStep] = useState<number>(0);

  const { data: specialityTypes } = useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((response) =>
      response.data.result.map(({ id, name }) => ({
        category: DIRECTION_TYPES.DOCTOR,
        categoryId: id,
        name,
      }))
    )
  );

  const { data: analysisTypes } = useQuery(["getAnalysisTypes"], () =>
    dictionaryApi.getAnalysisTypes().then((response) =>
      response.data.result.map(({ id, name }) => ({
        category: DIRECTION_TYPES.MEDICAL_TEST,
        categoryId: id,
        name,
      }))
    )
  );

  const { data: procedureTypes } = useQuery(["getProcedureDirectory"], () =>
    dictionaryApi.getProcedureDirectory().then((response) =>
      response.data.result.map(({ id, name }) => ({
        category: DIRECTION_TYPES.FUNCTIONAL_DIAGNOSIS,
        categoryId: id,
        name,
      }))
    )
  );

  const [medicalPrescriptionData, setMedicalPrescriptionData] = useState<
    Partial<CreateNewPrescription>
  >({});

  const handleStepIncrement = useCallback(() => {
    setStep((prev) => ++prev);
  }, []);

  const handleStepDecrement = useCallback(() => {
    setStep((prev) => --prev);
  }, []);

  const { mutate: addPrescriptionToConsultation } = useMutation(
    ["addPrescriptionToConsultation"],
    (medicalPrescriptionId: string) =>
      medicalPrescriptionApi.addPrescriptionToConsultation(
        consultationId,
        medicalPrescriptionId
      ),
    {
      onSuccess: () => {
        setIsOpen(false);
      },
    }
  );

  const { mutate: createPrescription } = useMutation(
    ["createPrescription"],
    (data: CreateNewPrescription) =>
      medicalPrescriptionApi.createMedicalPrescription({
        ...data,
        userId,
        userProfileId,
      }),
    {
      onSuccess: (result) => {
        addPrescriptionToConsultation(String(result?.data?.id ?? ""));
      },
      onSettled: () => {
        setMedicalPrescriptionData({});
      },
    }
  );

  const handleSubmit = useCallback(() => {
    setIsOpen(false);
    setStep(0);
    createPrescription(medicalPrescriptionData as CreateNewPrescription);
  }, [createPrescription, medicalPrescriptionData, setIsOpen]);

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="h-screen !p-0">
      <div>
        {step === 0 && (
          <AddNewRecordStep
            back={() => {
              setIsOpen(false);
            }}
            setMedicalPrescription={setMedicalPrescriptionData}
            next={handleStepIncrement}
          />
        )}
        {step === 1 && (
          <MedicalDirectionStep
            back={handleStepDecrement}
            next={handleStepIncrement}
            setMedicalPrescription={setMedicalPrescriptionData}
            specialityTypes={specialityTypes ?? []}
            analysisTypes={analysisTypes ?? []}
            procedureTypes={procedureTypes ?? []}
          />
        )}
        {step === 2 && (
          <TakeMedicineStep
            back={handleStepDecrement}
            next={handleStepIncrement}
            medicalPrescription={medicalPrescriptionData}
            setMedicalPrescription={setMedicalPrescriptionData}
          />
        )}
        {step === 3 && (
          <RecommendationStep
            back={handleStepDecrement}
            next={handleSubmit}
            setMedicalPrescription={setMedicalPrescriptionData}
          />
        )}
      </div>
    </Dialog>
  );
};
