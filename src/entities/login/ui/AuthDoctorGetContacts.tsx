import type { FC } from "react";
import { useCallback, useContext, useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import type { AuthDoctorProfileSetupStepModel } from "@/entities/login";
import { AuthDoctorContactList } from "@/entities/login";
import { ArrowLeftIcon, Button, Navbar } from "@/shared/components";
import type { ContactsList } from "@/shared/contexts/userContext";
import { UserContext } from "@/shared/contexts/userContext";

export const AuthDoctorGetContacts: FC<AuthDoctorProfileSetupStepModel> = ({
  next,
  setValue,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Login");

  const [showContactsMode, setShowContactsMode] = useState<boolean>(false);
  const [contacts, setContacts] = useState<ContactsList[]>([]);

  const { getContactListNative, contactsList } = useContext(UserContext);

  useEffect(() => {
    setContacts(contactsList);
  }, [contactsList]);

  const handleNextClick = useCallback(() => {
    setValue?.("contacts", [
      {
        fullName: "Бахтияр Жумагулов",
        phoneNumber: "+7 (708) 235 34 65",
      },
      {
        fullName: "Иван Иванов",
        phoneNumber: "+7 (708) 235 34 65",
      },
    ]);
    next?.();
  }, [next, setValue]);

  return showContactsMode ? (
    <div className="h-screen bg-white">
      <Navbar
        title={t("Contacts")}
        className="mb-4"
        description={t("StepSomeOfSome", { step: 5, allStep: 6 })}
        buttonIcon={<ArrowLeftIcon />}
        leftButtonOnClick={() => setShowContactsMode(false)}
      />
      <AuthDoctorContactList contacts={contacts} />
      <div className="absolute bottom-5 w-full px-4">
        <Button
          onClick={handleNextClick}
          variant="secondary"
          className="w-full"
        >
          {t("Next")}
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <img src="/imagePlaceholder.png" alt="imagePlaceholder" />
      <div className="my-3 px-4 text-center text-Bold24">
        {tMob("AllowAccessToContacts")}
      </div>
      <div className="px-4 text-center text-Regular16">
        {tMob("ShareExperiencesWithColleaguesAndConsultWithYourPatients")}
      </div>
      <div className="absolute bottom-4 flex w-full flex-col px-4">
        <Button
          className="mb-4"
          onClick={async () => {
            await getContactListNative();
            setShowContactsMode(true);
          }}
        >
          {t("Allow")}
        </Button>
        <Button variant="tertiary" onClick={() => next?.()}>
          {t("NotNow")}
        </Button>
      </div>
    </div>
  );
};
