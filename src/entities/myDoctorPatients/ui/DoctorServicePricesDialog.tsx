import type { FC } from "react";
import { useMemo } from "react";

import { Button, CloseIcon, Dialog, InputText } from "@/shared/components";
import { CONSULTATION_TYPE } from "@/shared/constants";

import type { DoctorServicePricesDialogProps } from "../models/DoctorServicePricesDialogProps";

export const DoctorServicePricesDialog: FC<DoctorServicePricesDialogProps> = ({
  isOpen,
  setIsOpen,
  firstPriceLabel,
  secondPriceLabel,
  inputValue,
  setInputValue,
  onSubmit,
  serviceType,
}) => {
  const dialogTitle = useMemo(() => {
    switch (serviceType) {
      case CONSULTATION_TYPE.ONLINE:
        return "Стоимость онлайн-консультаций";
      case CONSULTATION_TYPE.OFFLINE:
        return "Стоимость приема у себя";
      case CONSULTATION_TYPE.AWAY:
        return "Стоимость выезда на дом";
    }
  }, [serviceType]);

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="h-1/2">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-Bold20">{dialogTitle}</div>
        <div
          className="flex w-1/4 justify-end"
          onClick={() => setIsOpen(false)}
          onKeyDown={() => setIsOpen(false)}
        >
          <CloseIcon />
        </div>
      </div>

      <InputText
        type="number"
        label={firstPriceLabel}
        name="firstConsultation"
        onChange={(event) => {
          setInputValue((prev) => [event.target.value, prev[1]]);
        }}
        showAsterisk={false}
        wrapperClassName="my-3"
      />
      <InputText
        type="number"
        label={secondPriceLabel}
        name="secondConsultation"
        onChange={(event) => {
          setInputValue((prev) => [prev[0], event.target.value]);
        }}
        showAsterisk={false}
        wrapperClassName="my-3"
      />

      <Button
        className="mt-4 w-full"
        onClick={() => {
          setIsOpen(false);
          onSubmit(inputValue, serviceType);
        }}
      >
        Далее
      </Button>
      <Button
        variant="tertiary"
        className="mt-4 w-full"
        onClick={() => {
          setIsOpen(false);
          onSubmit(["", ""], serviceType);
        }}
      >
        Не оказываю эту услугу
      </Button>
    </Dialog>
  );
};
