import type { FC } from "react";

import type { RegistrationRequestDrawer } from "@/entities/desktopDrawer";
import { Button, DividerSaunet, Drawer } from "@/shared/components";

export const DesktopRegRequestInfoDrawer: FC<RegistrationRequestDrawer> = ({
  onClose,
  open,
  requestView,
}) => (
  <Drawer onClose={onClose} open={open} title="Заявка №314124">
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col">
        <div className="text-Bold24">О заявке</div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">
            Название клиники
          </div>
          <div className="mt-1 text-Regular16">{requestView?.clinicName}</div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">БИН/ИИН</div>
          <div className="mt-1 text-Regular16">071221098765</div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">ФИО менеджера</div>
          <div className="mt-1 text-Regular16">
            Аббасов Ерлан Кажегельдиевич
          </div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">
            Номер телефона
          </div>
          <div className="mt-1 text-Regular16">{requestView?.phoneNumber}</div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">Email</div>
          <div className="mt-1 text-Regular16">yerlan@privatklinik.kz</div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          className="!h-10 rounded-lg !border px-4"
          variant="outline"
          outlineDanger
          onClick={onClose}
        >
          Отклонить
        </Button>
        <Button onClick={onClose} className="!h-10 rounded-lg px-4">
          Одобрить заявку
        </Button>
      </div>
    </div>
  </Drawer>
);
