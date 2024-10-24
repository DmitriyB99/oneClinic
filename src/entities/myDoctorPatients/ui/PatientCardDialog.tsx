import type { FC } from "react";

import { Divider } from "antd";
import { useTranslations } from "next-intl";

import { Dialog, OneClinicIcon, PaperWithPlusIcon } from "@/shared/components";

import type { Props } from "../models/PatientCardDialogProps";

export const PatientCardDialog: FC<Props> = ({
  isOpen,
  setIsOpen,
  onMedicalCardClick,
  onWriteOutDirectionClick,
}) => {
  const tMob = useTranslations("Mobile.Call");

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="h-1/5 bg-white px-4 py-6"
    >
      <div
        className="mb-0 flex items-center gap-4"
        onClick={onMedicalCardClick}
      >
        <div className="flex items-center justify-center rounded-lg bg-gray-0 p-2">
          <OneClinicIcon />
        </div>
        <p className="mb-0">{tMob("PatientMedCard")}</p>
      </div>
      <Divider className="my-4" />
      <div
        className="mb-0 flex items-center gap-4"
        onClick={onWriteOutDirectionClick}
      >
        <div className="flex items-center justify-center rounded-lg bg-gray-0 p-2">
          <PaperWithPlusIcon />
        </div>
        <p className="mb-0">{tMob("WriteOutDirection")}</p>
      </div>
    </Dialog>
  );
};
