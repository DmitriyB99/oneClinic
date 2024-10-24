import type { FC } from "react";
import { useState } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { ListType } from "@/shared/components";
import {
  ArrowLeftIcon,
  Dialog,
  InputSearch,
  InteractiveList,
  Navbar,
} from "@/shared/components";

export const SpecialistDialog: FC<{
  list: ListType[];
  onSpecialityClick: (code: string | number) => void;
}> = ({ list, onSpecialityClick }) => {
  const t = useTranslations("Common");

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="flex cursor-pointer rounded-3xl bg-gray-2 px-3 py-1 text-Medium12"
        onClick={() => setIsOpen(true)}
      >
        <span className="mr-1">{t("All")}</span>
        <ArrowRightOutlined />
      </div>
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <div>
          <Navbar
            title={t("Specializations")}
            leftButtonOnClick={() => setIsOpen(false)}
            buttonIcon={<ArrowLeftIcon />}
            className="px-4"
          />
          <InputSearch
            className="h-10 w-full mb-6 mt-2"
            placeholder={t("SearchByDoctorsServicesClinics")}
          />
          <InteractiveList list={list} onClick={onSpecialityClick} />
        </div>
      </Dialog>
    </>
  );
};
