import type { FC } from "react";
import { Fragment, useCallback, useContext } from "react";

import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  Button,
  Checkbox,
  DividerSaunet,
  FlagKazakhstanIcon,
  FlagRussiaIcon,
  FlagUKIcon,
  Island,
  Navbar,
} from "@/shared/components";
import { Languages } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";

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

interface MyChooseLanguageProps {
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
}

export const MyChooseLangauge: FC<MyChooseLanguageProps> = ({
  onClose,
  onSelectLanguage,
}) => {
  const t = useTranslations("Common");
  const { locale, setLocale } = useContext(UserContext);

  const handleSetLocale = useCallback(
    (loc: string) => {
      setLocale(loc);
      onSelectLanguage(loc);
    },
    [onSelectLanguage, setLocale]
  );

  return (
    <div className="bg-white z-[102]">
      <Island className="!p-0">
        <Navbar
          title={t("Language")}
          leftButtonOnClick={() => onClose()}
          buttonIcon={<ArrowLeftIcon />}
          className="mb-4 !p-0"
        />
        <div className="mb-4 px-4">
          {Languages.map((language) => (
            <Fragment key={language?.label}>
              <div
                className="flex h-16 items-center justify-between"
                onClick={() => {
                  handleSetLocale(language?.value);
                }}
              >
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center">
                    {generateCountryIcon(language.value)}
                  </div>
                  <div>{language?.label}</div>
                </div>
                <Checkbox checked={locale === language?.value} />
              </div>
              <DividerSaunet className="m-0" />
            </Fragment>
          ))}
        </div>
      </Island>
      <div className="w-full p-4">
        <Button className="w-full" onClick={onClose}>
          {t("IsReady")}
        </Button>
      </div>
    </div>
  );
};
