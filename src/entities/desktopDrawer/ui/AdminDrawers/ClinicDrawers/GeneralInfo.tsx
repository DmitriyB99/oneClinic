import { useTranslations } from "next-intl";

import { Button, DesktopInputText } from "@/shared/components";

export const GeneralInfo = () => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="my-1 text-Regular14">{t("ClinicBIN")}</div>
        <DesktopInputText
          label={t("ClinicBIN")}
          name="bin"
          showAsterisk={false}
          inputClassName="p-2 !text-Regular14"
          desktopDrawer
        />
        <div className="my-1 text-Regular14">{t("ClinicName")}</div>
        <DesktopInputText
          label={t("ClinicName")}
          name="clinicName"
          desktopDrawer
          showAsterisk={false}
          inputClassName="p-2 !text-Regular14"
        />
        <div className="my-1 text-Regular14">
          {tDesktop("ClinicDescription")}
        </div>
        <DesktopInputText
          label={tDesktop("ClinicDescription")}
          name="clinicDescription"
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
