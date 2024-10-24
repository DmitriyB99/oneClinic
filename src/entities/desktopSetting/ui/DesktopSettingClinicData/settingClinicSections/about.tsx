import type { FC } from "react";
import { useState } from "react";
import { Controller } from "react-hook-form";

import { useTranslations } from "next-intl";

import type { SessionProps } from "@/entities/desktopSetting";
import { DesktopInputText, DividerSaunet, EditIcon } from "@/shared/components";

export const AboutSettingSection: FC<SessionProps> = ({ data, control }) => {
  const t = useTranslations("Common");
  const [editMode, setEditMode] = useState(false);
  return (
    <>
      <DividerSaunet className="my-6" />
      <div className="flex justify-between">
        <div className="text-Bold24">{t("AboutClinic")}</div>
        {!editMode && (
          <div onClick={() => setEditMode(true)}>
            <EditIcon
              color="colorPrimaryBase"
              className="cursor-pointer hover:brightness-75"
            />
          </div>
        )}
      </div>
      <div className="mt-6">
        {(data?.name || editMode) && (
          <div className="text-Regular12 text-secondaryText">
            {t("ClinicName")}
          </div>
        )}
        {editMode ? (
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <DesktopInputText
                label={t("ClinicName")}
                wrapperClassName="text-Regular16 mt-2"
                desktopDrawer
                innerClassName="!h-10 !px-4"
                showAsterisk={false}
                {...field}
              />
            )}
          />
        ) : (
          <div className="mt-1 text-Regular16">{data?.name}</div>
        )}
        <DividerSaunet className="my-3" />
      </div>
      <div className="mt-4">
        {(data?.description || editMode) && (
          <div className="text-Regular12 text-secondaryText">
            {t("Description")}
          </div>
        )}
        {editMode ? (
          <Controller
            control={control}
            name="description"
            render={({ field: { value, ...rest } }) => (
              <DesktopInputText
                label={t("Description")}
                wrapperClassName="text-Regular16 mt-2"
                desktopDrawer
                innerClassName="!h-10 !px-4"
                showAsterisk={false}
                value={value || ""}
                {...rest}
              />
            )}
          />
        ) : (
          <div className="mt-1 text-Regular16">{data?.description}</div>
        )}
      </div>
    </>
  );
};
