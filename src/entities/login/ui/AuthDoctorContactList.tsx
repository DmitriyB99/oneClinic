import type { FC } from "react";
import { useCallback } from "react";

import { useTranslations } from "next-intl";

import type { AuthDoctorContactListModel } from "@/entities/login";
import { Button, DefaultCell } from "@/shared/components";

export const AuthDoctorContactList: FC<AuthDoctorContactListModel> = ({
  contacts,
}) => {
  const t = useTranslations("Common");

  const renderButton = useCallback(
    (isRegistered: boolean, isDoctor: boolean) => {
      let text = t("Invite");

      if (isRegistered) {
        if (isDoctor) {
          text = t("Subscribe");
        } else {
          text = t("Add");
        }
      }
      return (
        <Button
          variant={isRegistered ? "primary" : "tertiary"}
          className="h-8 w-[110px] rounded-xl !p-0 text-center text-Medium14"
        >
          {text}
        </Button>
      );
    },
    [t]
  );
  return (
    <>
      {contacts.map((contact) => (
        <DefaultCell
          key={contact.phoneNumber}
          caption={contact.phoneNumber}
          title={contact.name}
          className="py-3"
          rightElement={renderButton(false, false)}
        />
      ))}
    </>
  );
};
