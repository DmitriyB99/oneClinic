import type { FC } from "react";
import { useQuery } from "react-query";

import { Divider } from "antd";

import { DesktopMainSubCard } from "@/entities/desktopMain";
import { superAdminApis } from "@/shared/api";
import { EditIcon } from "@/shared/components";

export const DoctorFinances: FC<{ id: string }> = ({ id }) => {
  const { data: doctorFinances } = useQuery(["getDoctorFinances"], () =>
    superAdminApis.getDoctorFinances(id).then((res) => res.data.content)
  );
  console.log(doctorFinances);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            Методы оплаты
          </p>
          <p className="m-0 mt-1 text-Regular16">MasterCard · 5264</p>
        </div>
        <div className="flex flex-row gap-3">
          <EditIcon width={18} height={18} color="colorPrimaryBase" />
        </div>
      </div>
      <Divider className="my-0" />
      <div className="flex w-full flex-row items-center justify-between rounded-3xl bg-white p-4">
        <p className="m-0 p-0 text-Regular16">Вывод средств</p>
        <div className="flex flex-col items-end">
          <p className="m-0 p-0 text-Regular16">− 120 000 ₸</p>
          <p className="m-0 p-0 text-Regular12 text-gray-secondary">
            15:40, 04 Декабря
          </p>
        </div>
      </div>
      <DesktopMainSubCard
        time="asd"
        name="Артем Тарасенко"
        notifications=""
        className="!w-full"
        doctorName="Лор"
        isTransaction={true}
      />
      <DesktopMainSubCard
        time="asd"
        name="Артем Тарасенко"
        notifications=""
        className="!w-full"
        doctorName="Лор"
        isTransaction={true}
      />
    </div>
  );
};
