import {
  Fragment,
  useCallback,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { useMutation, useQuery } from "react-query";

import type { LanguageCode } from "@/shared/api";
import { languageApi } from "@/shared/api";
import {
  Button,
  DividerSaunet,
  FlagKazakhstanIcon,
  FlagRussiaIcon,
  FlagUKIcon,
  RadioSaunet,
} from "@/shared/components";
import { Languages } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { patientProfileApi } from "@/shared/api/patient/profile";

const generateCountryIcon = (countryLabel: string) => {
  switch (countryLabel) {
    case "ru":
      return <FlagRussiaIcon size="lg" />;
    case "en":
      return <FlagUKIcon size="lg" />;
    case "kk":
      return <FlagKazakhstanIcon size="lg" />;
    default:
      return <img src="/flagUzbekistan.png" alt="flagUzbekistan" />;
  }
};

interface LanguagesPageProps {
  onLanguageChange: (lang: string) => void;
}

export function LanguagesPage({ onLanguageChange }: LanguagesPageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ru");
  const { data: myProfileData } = useQuery(["getMyProfile"], () =>
    patientProfileApi?.getMyProfile()
  );

  const { id } = useMemo(
    () => myProfileData?.data ?? {},
    [myProfileData?.data]
  );

  const { mutate: updateDoctorLanguage } = useMutation(
    ["updateDoctorLanguage", id],
    (newDoctorLanguageLocale: LanguageCode) =>
      languageApi.updateUserLanguage(id ?? "", newDoctorLanguageLocale)
  );

  const { locale, setLocale } = useContext(UserContext);

  useEffect(() => {
    // Set default language on initial render
    if (!locale) {
      setLocale(selectedLanguage);
      updateDoctorLanguage(selectedLanguage as LanguageCode);
    }
  }, [locale, selectedLanguage, setLocale, updateDoctorLanguage]);

  const handleLanguageChange = useCallback((loc: string) => {
    setSelectedLanguage(loc);
  }, []);

  const handleNextClick = useCallback(() => {
    if (selectedLanguage) {
      setLocale(selectedLanguage);
      updateDoctorLanguage(selectedLanguage as LanguageCode);
      onLanguageChange(selectedLanguage);
    }
  }, [selectedLanguage, setLocale, updateDoctorLanguage, onLanguageChange]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="mb-6 text-Bold20">Выберите язык</div>
      <div className="flex w-full flex-col items-center justify-center px-4">
        <div className="w-full rounded-xl border border-solid border-gray-1 px-4">
          {Languages.map((language, index) => (
            <Fragment key={language?.label}>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <RadioSaunet
                    checked={selectedLanguage === language?.value}
                    className="mr-0 py-7"
                    onChange={() => handleLanguageChange(language?.value)}
                  />

                  <div className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center">
                      {generateCountryIcon(language.value)}
                    </div>
                    <div>{language?.label}</div>
                  </div>
                </div>
              </div>
              {index !== (Languages?.length ?? 0) - 1 && (
                <DividerSaunet className="m-0 p-0" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <Button
        className="mt-6 !px-14 py-3 text-Medium16"
        variant="primary"
        onClick={handleNextClick}
        disabled={!selectedLanguage}
      >
        Далее
      </Button>
    </div>
  );
}
