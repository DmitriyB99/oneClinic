import type { FC } from "react";
import { useState, Fragment } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useTranslations } from "next-intl";

import type { AuthDoctorSpecializationsModel } from "@/entities/login";
import {
  Checkbox,
  Dialog,
  DividerSaunet,
  Island,
  SearchIcon,
} from "@/shared/components";
import { highlightText } from "@/shared/utils/higlightText";

export const AuthDoctorSpecializationsDialog: FC<AuthDoctorSpecializationsModel> =
  ({
    setOpenSpecializationsDialog,
    openSpecializationsDialog,
    setSpecializations,
    specializations,
  }) => {
    const t = useTranslations("Common");

    const [specialitySearch, setSpecialitySearch] = useState<string>("");

    return (
      <Dialog
        isOpen={openSpecializationsDialog}
        setIsOpen={setOpenSpecializationsDialog}
        className="h-9/10 !p-0"
      >
        <div className="bg-gray-2">
          <Island className="my-2">
            <div className="mb-4 text-Bold24">{t("Specializations")}</div>
            <div className="flex items-center justify-between rounded-xl bg-gray-2 px-4 py-2">
              <SearchIcon className="mr-3 text-gray-icon" />
              <Input
                className="border-0 bg-gray-2 hover:border-0 focus:border-0"
                value={specialitySearch}
                onChange={(event) => {
                  setSpecialitySearch(event.target.value);
                }}
              />
              <CloseOutlined className="ml-3 cursor-pointer text-gray-icon" />
            </div>
          </Island>
          <Island>
            {specializations
              .filter((speciality) =>
                speciality.speciality
                  .toLowerCase()
                  .includes(specialitySearch.toLowerCase())
              )
              .map((speciality) => (
                <Fragment key={speciality.id}>
                  <div className="flex h-16 items-center justify-start">
                    <Checkbox
                      className="mr-3"
                      checked={speciality.checked}
                      onChange={(event) => {
                        setSpecializations(
                          specializations.map((specialityWithCheck) => {
                            if (specialityWithCheck.id === speciality.id) {
                              return {
                                ...specialityWithCheck,
                                checked: event.target.checked,
                              };
                            }
                            return specialityWithCheck;
                          })
                        );
                      }}
                    />
                    <div className="text-Regular16">
                      {highlightText(speciality.speciality, specialitySearch)}
                    </div>
                  </div>
                  <DividerSaunet className="m-0" />
                </Fragment>
              ))}
          </Island>
        </div>
      </Dialog>
    );
  };
