import type { FC } from "react";
import { useState } from "react";

import { useTranslations } from "next-intl";

import type { ListType } from "@/shared/components";
import {
  Dialog,
  InputSearch,
  InteractiveList,
  Navbar,
} from "@/shared/components";

export const ForwardMessageDialog: FC<{
  list: ListType[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}> = ({ list,  isOpen, setIsOpen }) => {
  const t = useTranslations("Common");

  return (
    <>
      
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <div>
          <Navbar
            title={"Кому переслать сообщение?"}
            className="px-4 text-Bold24"
          />
          
          <InputSearch
            className="h-10 w-full mb-6 mt-2"
            placeholder={t("SearchByDoctorsServicesClinics")}
          />
          <InteractiveList list={list}  />
        </div>
      </Dialog>
    </>
  );
};
