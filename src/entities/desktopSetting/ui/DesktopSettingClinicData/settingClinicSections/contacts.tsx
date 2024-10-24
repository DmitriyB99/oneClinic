import type { FC } from "react";
import { useState } from "react";
import { Controller } from "react-hook-form";

import { useTranslations } from "next-intl";

import type { SessionProps } from "@/entities/desktopSetting";
import { DesktopInputText, DividerSaunet, EditIcon } from "@/shared/components";

export const ContactsSettingSection: FC<SessionProps> = ({ data, control }) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Settings");
  const [editMode, setEditMode] = useState(false);
  return (
    <>
      <div className="mt-11 flex justify-between">
        <div className="text-Bold24">{t("Contacts")}</div>
        {!editMode && (
          <div onClick={() => setEditMode(true)}>
            <EditIcon
              color="colorPrimaryBase"
              className="cursor-pointer hover:brightness-75"
            />
          </div>
        )}
      </div>
      {(editMode || data?.phoneNumber) && (
        <div className="mt-6 text-Regular12 text-secondaryText">
          {tDesktop("ManagerPhoneFromApplication")}
        </div>
      )}
      {editMode ? (
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: t("RequiredField"),
          }}
          render={({ field: { value, ...rest } }) => (
            <DesktopInputText
              label={tDesktop("ManagerPhoneFromApplication")}
              wrapperClassName="text-Regular16 mt-2"
              desktopDrawer
              isPhone
              innerClassName="!h-10"
              showAsterisk={false}
              value={value ?? ""}
              {...rest}
            />
          )}
        />
      ) : (
        <div className="mt-1 text-Regular16">{data?.phoneNumber}</div>
      )}
      <DividerSaunet className="my-3" />
      {(editMode || data?.email) && (
        <div className="mt-6 text-Regular12 text-secondaryText">
          {tDesktop("EmailFromApplication")}
        </div>
      )}
      {editMode ? (
        <Controller
          control={control}
          name="email"
          rules={{
            required: t("RequiredField"),
          }}
          render={({ field: { value, ...rest } }) => (
            <DesktopInputText
              label={tDesktop("EmailFromApplication")}
              wrapperClassName="text-Regular16 mt-2"
              desktopDrawer
              innerClassName="!h-10 !px-4"
              showAsterisk={false}
              value={value ?? ""}
              {...rest}
            />
          )}
        />
      ) : (
        <div className="mt-1 text-Regular16">{data?.email}</div>
      )}
    </>
  );
};
