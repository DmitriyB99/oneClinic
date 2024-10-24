import { useState, Fragment } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useTranslations } from "next-intl";

import {
  Button,
  Checkbox,
  Dialog,
  DividerSaunet,
  Island,
  SaunetIcon,
  SearchIcon,
} from "@/shared/components";
import { highlightText } from "@/shared/utils/higlightText";

export const ClinicsDialog = ({
  setClinicsDialogOpen,
  clinicsDialogOpen,
  clinics,
  setClinics,
}) => {
  const t = useTranslations("Common");

  const [clinicsSearch, setClinicsSearch] = useState<string>("");
  const [selectedClinics, setSelectedClinics] = useState([]);

  const handleCheckboxChange = (clinicId: "string") => {
    setSelectedClinics((prevSelected) => {
      if (prevSelected.includes(clinicId)) {
        return prevSelected.filter((id) => id !== clinicId);
      } else {
        return [...prevSelected, clinicId];
      }
    });
  };

  return (
    <Dialog
      isOpen={clinicsDialogOpen}
      setIsOpen={setClinicsDialogOpen}
      className="flex h-9/10 flex-col !p-0"
    >
      <div className="flex grow flex-col bg-gray-2">
        <Island className="mb-2">
          <div className="flex items-center justify-between py-4">
            <div className="text-Regular14 text-red">Сбросить</div>
            <div className="text-Bold16">{t("Clinic")}</div>
            <div className="text-Regular14">Готово</div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-2 px-4 py-2">
            <SearchIcon className="mr-3 text-gray-icon" />
            <Input
              className="border-0 bg-gray-2 hover:border-0 focus:border-0"
              value={clinicsSearch}
              onChange={(event) => {
                setClinicsSearch(event.target.value);
              }}
            />
            <CloseOutlined className="ml-3 cursor-pointer text-gray-icon" />
          </div>
        </Island>
        <Island className="flex grow flex-col">
          <div className="grow overflow-auto">
            {clinics
              .filter((clinic) =>
                clinic.name.toLowerCase().includes(clinicsSearch.toLowerCase())
              )
              .map((clinic) => (
                <Fragment key={clinic.id}>
                  <div className="flex h-16 items-center justify-start">
                    <Checkbox
                      className="mr-3"
                      checked={selectedClinics.includes(clinic.id)}
                      onChange={() => handleCheckboxChange(clinic.id)}
                    />
                    <div className="flex items-center justify-start">
                      <div className="flex w-10 items-center">
                        <SaunetIcon height={40} width={40} />
                      </div>
                      <div className="ml-3 flex flex-col">
                        <div className="mb-1 text-Regular16">
                          {highlightText(clinic.name, clinicsSearch)}
                        </div>
                        <div className="text-Regular12 text-secondaryText">
                          {clinic.address}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DividerSaunet className="m-0" />
                </Fragment>
              ))}
          </div>
          {selectedClinics.length > 0 && (
            <div className="w-full py-4">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  setClinics("clinic_ids", selectedClinics);
                  setClinicsDialogOpen(false);
                }}
              >
                Выбрано клиник: {selectedClinics.length}
              </Button>
            </div>
          )}
        </Island>
      </div>
    </Dialog>
  );
};
