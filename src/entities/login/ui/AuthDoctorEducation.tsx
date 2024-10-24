import type { FC } from "react";
import { useCallback, useState } from "react";

import { useTranslations } from "next-intl";

import type { AuthDoctorProfileSetupStepModel } from "@/entities/login";
import { DoctorEducationBlock } from "@/entities/login";
import { ArrowLeftIcon, Button, Island, Navbar } from "@/shared/components";
import type { EducationBlockModel } from "@/widgets/auth/models";

export const AuthDoctorEducation: FC<AuthDoctorProfileSetupStepModel> = ({
  back,
  next,
  doctorId,
  setValue,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Login");

  const [educationBlocks, setEducationBlocks] = useState<EducationBlockModel[]>(
    [{ id: 0 }]
  );
  const handleNextClick = useCallback(() => {
    setValue?.(
      "studyDegrees",
      educationBlocks?.map((educationBlock) => ({
        yearEnd: educationBlock?.yearEnd,
        yearStart: educationBlock?.yearStart,
        diplomaUrl: educationBlock?.diplomaUrl ?? "",
        degree: educationBlock?.degree ?? "",
        name: educationBlock?.name ?? "",
      }))
    );
    next?.();
  }, [educationBlocks, next, setValue]);

  return (
    <>
      <Island className="mb-2 bg-white">
        <Navbar
          title={t("Education")}
          className="mb-4"
          description={t("StepSomeOfSome", { step: 3, allStep: 6 })}
          buttonIcon={<ArrowLeftIcon />}
          leftButtonOnClick={back}
        />
        <DoctorEducationBlock
          doctorId={doctorId}
          id={0}
          setEducationBlocks={setEducationBlocks}
        />
      </Island>
      {educationBlocks?.slice(1)?.map(({ id }, index) => (
        <Island key={id ?? index + 1} className="my-2">
          <DoctorEducationBlock
            doctorId={doctorId}
            id={id ?? index + 1}
            setEducationBlocks={setEducationBlocks}
          />
        </Island>
      ))}
      <Island className="mb-20">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setEducationBlocks((prev) => [...prev, { id: prev.length }]);
          }}
        >
          {tMob("AddMoreEducation")}
        </Button>
      </Island>
      <div className="fixed bottom-0 z-50 flex w-full items-center bg-white px-4 pb-5 pt-4">
        <Button className="w-full" onClick={next} rootClassName="bg-white">
          {t("Skip")}
        </Button>
        <Button className="w-full" onClick={handleNextClick}>
          {t("Next")}
        </Button>
      </div>
    </>
  );
};
