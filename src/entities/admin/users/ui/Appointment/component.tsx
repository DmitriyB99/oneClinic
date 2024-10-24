import type { FC } from "react";

import { DesktopMainSubCard } from "@/entities/desktopMain";

export const Appointment: FC = () => (
  <div className="flex w-full flex-col gap-5">
    <DesktopMainSubCard
      onClick={() => {}}
      time="asd"
      name="Артем Тарасенко"
      notifications=""
      className="!w-full"
      doctorName="Лор"
      expanded
    />
    <DesktopMainSubCard
      onClick={() => {}}
      time="asd"
      name="Артем Тарасенко"
      notifications=""
      className="!w-full"
      doctorName="Лор"
      expanded
    />
  </div>
);
