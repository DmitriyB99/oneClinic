import type { FC } from "react";
import { useCallback, useState } from "react";

import { useTranslations } from "next-intl";

import type { AuthDoctorProfileSetupStepModel } from "@/entities/login";
import { DoctorCertificateBlock } from "@/entities/login";
import { ArrowLeftIcon, Button, Island, Navbar } from "@/shared/components";
import type { CertificateModel } from "@/widgets/auth/models";

export const AuthDoctorCertificates: FC<AuthDoctorProfileSetupStepModel> = ({
  back,
  next,
  doctorId,
  setValue,
}) => {
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");
  const [certificates, setCertificates] = useState<CertificateModel[]>([
    {
      id: 0,
    },
  ]);
  const handleNextClick = useCallback(() => {
    setValue?.(
      "certificates",
      certificates?.map((certificate) => ({
        name: certificate?.name ?? "",
        yearEarned: certificate?.yearEarned,
        certificateUrl: certificate?.certificateUrl ?? "",
      }))
    );
    next?.();
  }, [certificates, next, setValue]);
  return (
    <>
      <Island>
        <Navbar
          title={t("Certificates")}
          className="mb-4"
          description={t("StepSomeOfSome", { step: 4, allStep: 6 })}
          buttonIcon={<ArrowLeftIcon />}
          leftButtonOnClick={back}
        />
        <DoctorCertificateBlock
          doctorId={doctorId}
          id={0}
          setCertificates={setCertificates}
        />
      </Island>
      {certificates.slice(1).map(({ id }, index) => (
        <Island key={id ?? index + 1} className="my-2">
          <DoctorCertificateBlock
            id={id ?? index + 1}
            doctorId={doctorId}
            setCertificates={setCertificates}
          />
        </Island>
      ))}
      <Island className="mb-20">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setCertificates((prev) => [...prev, { id: prev.length }]);
          }}
        >
          {tMob("AddAnotherCertificate")}
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
