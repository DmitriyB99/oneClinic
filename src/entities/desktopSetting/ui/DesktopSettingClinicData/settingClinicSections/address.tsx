import type { FC } from "react";
import { useCallback, useContext, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import { useTranslations } from "next-intl";

import type { SessionProps } from "@/entities/desktopSetting";
import { DesktopInputText, EditIcon } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { AmbulanceOrderMap } from "@/widgets/ambulance";

export const AddressSettingSection: FC<SessionProps> = ({
  data,
  control,
  setValue,
}) => {
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");
  const { userCoordinates } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const address = useMemo(() => {
    if (!data?.street) {
      return "";
    }
    return t("StreetPoint") + data?.street + " " + data?.buildNumber;
  }, [data, t]);
  const setAddressData = useCallback(
    (streetAddress: string, coords: number[]) => {
      setValue?.("street", streetAddress);
      setValue?.("locationPoint.x", coords[0]);
      setValue?.("locationPoint.y", coords[1]);
    },
    [setValue]
  );

  return (
    <>
      <div className="mt-11 flex justify-between">
        <div className="text-Bold24">{t("Address")}</div>
        {!editMode && (
          <div onClick={() => setEditMode(true)}>
            <EditIcon
              color="colorPrimaryBase"
              className="cursor-pointer hover:brightness-75"
            />
          </div>
        )}
      </div>
      {editMode ? (
        <div>
          <Controller
            control={control}
            name="street"
            rules={{
              required: t("RequiredField"),
            }}
            render={({ field }) => (
              <DesktopInputText
                wrapperClassName="text-Regular16 my-6"
                inputClassName="pl-3"
                label={tDesktop("StreetBuildingNumber")}
                desktopDrawer
                showAsterisk={false}
                value={field?.value ?? ""}
                onChange={(event) => field.onChange(event)}
                name={field.name}
              />
            )}
          />
          <AmbulanceOrderMap
            userCoordinates={userCoordinates}
            setAddressData={setAddressData}
            desktop
            width="100%"
            height="300px"
          />
        </div>
      ) : (
        <div className="mt-6">
          <div className="mt-1 text-Regular16">{data?.name}</div>
          <div className="mt-1 text-Regular12 text-secondaryText">
            {address}
          </div>
        </div>
      )}
    </>
  );
};
