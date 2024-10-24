import type { FC } from "react";

import {
  ArrowLeftIcon,
  Dialog,
  InteractiveList,
  Navbar,
} from "@/shared/components";

import type { MedicalTestListDialogProps } from "./props";

export const MedicalTestsListDialog: FC<MedicalTestListDialogProps> = ({
  isOpen,
  setIsOpen,
  medicalTests,
  handleMedicalTestClick,
  title,
}) => (
  <Dialog className="h-screen" isOpen={isOpen} setIsOpen={setIsOpen}>
    <Navbar
      title={title}
      leftButtonOnClick={() => {
        setIsOpen(false);
      }}
      buttonIcon={<ArrowLeftIcon />}
      className="!p-0"
    />
    <InteractiveList list={medicalTests} onClick={handleMedicalTestClick} />
  </Dialog>
);
