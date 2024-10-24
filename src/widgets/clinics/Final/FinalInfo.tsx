import type { FC } from "react";
import { useMemo } from "react";

import { useRouter } from "next/router";

import { Button } from "@/shared/components";

export const FinalInfo: FC<{
  dateString?: string;
  handleClose: () => void;
  isMedicalTest?: boolean;
  isError: boolean;
}> = ({ handleClose, isMedicalTest = false, dateString, isError }) => {
  const router = useRouter();
  const [medicalOperationBookingString, medicalOperationReminderString] =
    useMemo(
      () => [
        isMedicalTest ? "сдачу анализов" : "прием",
        isMedicalTest ? "сдаче анализов" : "приеме",
      ],
      [isMedicalTest]
    );

  if (isError) {
    return (
      <div className="flex flex-col justify-center gap-4 p-4">
        <div className="py-4 text-center">
          <p className="mb-3 text-Bold24">Произошла ошибка</p>
          <p className="text-Regular16">попробуйте еще раз</p>
        </div>
        <Button onClick={handleClose}>Закрыть</Button>
        <Button variant="secondary" onClick={() => router.push("/")}>
          Мои записи
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-4 p-4">
      <div className="py-4 text-center">
        <p className="mb-3 text-Bold24">
          Вы успешно записаны на {medicalOperationBookingString}
        </p>
        <p className="mb-0 text-Bold16">{dateString ?? "3 марта в 18:30"}</p>
        <p className="text-Regular16">
          Мы заранее напомним вам о {medicalOperationReminderString}
        </p>
      </div>
      <Button onClick={handleClose}>Понятно</Button>
      <Button variant="secondary" onClick={() => router.push("/")}>
        Мои записи
      </Button>
    </div>
  );
};
