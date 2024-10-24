import { useTranslations } from "next-intl";

import { Button, DesktopInputText } from "@/shared/components";

export const Contacts = () => {
  const t = useTranslations("Common");
  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="my-1 text-Regular14">{t("PhoneNumber")}</div>
        <DesktopInputText
          label={t("PhoneNumber")}
          name="phoneNumber"
          showAsterisk={false}
          inputClassName="p-2 !text-Regular14"
          desktopDrawer
        />
        <div className="my-1 text-Regular14">{t("Email")}</div>
        <DesktopInputText
          label={t("Email")}
          name="email"
          desktopDrawer
          showAsterisk={false}
          inputClassName="p-2 !text-Regular14"
        />
      </div>
      <div className="mt-28 flex w-full justify-end gap-4">
        <Button
          className="!h-10 rounded-lg !border px-4"
          variant="outline"
          outlineDanger
        >
          {t("Abolish")}
        </Button>
        <Button className="!h-10 rounded-lg px-4" variant="outline">
          {t("Save")}
        </Button>
      </div>
    </>
  );
};
