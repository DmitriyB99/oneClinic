import type { FC } from "react";

import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  DividerSaunet,
  Island,
  Navbar,
  Toggle,
} from "@/shared/components";
const Notifications: { isChecked: boolean; notificationLabel: string }[] = [
  {
    notificationLabel: "Прием лекарств",
    isChecked: true,
  },
  {
    notificationLabel: "Новые сообщения",
    isChecked: false,
  },
  {
    notificationLabel: "Напоминания о записи",
    isChecked: true,
  },
  {
    notificationLabel: "Акции",
    isChecked: false,
  },
];

export const MyNotifications: FC<{ onClose: () => void }> = ({ onClose }) => {
  const t = useTranslations("Common");

  return (
    <div className="bg-white">
      <Island className="!p-0">
        <Navbar
          title={t("Notifications")}
          leftButtonOnClick={() => onClose()}
          buttonIcon={<ArrowLeftIcon />}
          className="mb-4 !p-0"
        />
        <div className="mb-4 px-4">
          {Notifications.map((notification, index) => (
            <div key={notification?.notificationLabel}>
              <div className="flex items-center justify-between">
                <div className="text-Regular16">
                  {notification?.notificationLabel}
                </div>
                <Toggle checked={notification?.isChecked} />
              </div>
              {index !== Notifications.length - 1 && <DividerSaunet />}
            </div>
          ))}
        </div>
      </Island>
    </div>
  );
};
