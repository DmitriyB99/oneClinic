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
  SearchIcon,
} from "@/shared/components";
import { highlightText } from "@/shared/utils/higlightText";

export const SpecializationsDialog = ({
  setOpenSpecializationsDialog,
  openSpecializationsDialog,
  setSpecializations,
  specializations,
}) => {
  const t = useTranslations("Common");

  const [specialitySearch, setSpecialitySearch] = useState<string>("");
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);

  const handleCheckboxChange = (specialityId: string) => {
    setSelectedSpecialities((prevSelected) => {
      if (prevSelected.includes(specialityId)) {
        return prevSelected.filter((id) => id !== specialityId);
      } else {
        return [...prevSelected, specialityId];
      }
    });
  };

  return (
    <Dialog
      isOpen={openSpecializationsDialog}
      setIsOpen={setOpenSpecializationsDialog}
      className="flex h-9/10 flex-col !p-0"
    >
      <div className="flex grow flex-col bg-gray-2">
        <Island className="mb-2">
          <div className="flex items-center justify-between py-4">
            <div
              className="text-Regular14 text-red"
              onClick={() => setSelectedSpecialities([])}
            >
              Сбросить
            </div>
            <div className="text-Bold16">{t("Specializations")}</div>
            <div className="text-Regular14">Готово</div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-2 px-4 py-2">
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
        <Island className="flex grow flex-col">
          <div className="grow overflow-auto">
            {specializations
              .filter((speciality) =>
                speciality.name
                  .toLowerCase()
                  .includes(specialitySearch.toLowerCase())
              )
              .map((speciality) => (
                <Fragment key={speciality.id}>
                  <div className="flex h-16 items-center justify-start">
                    <Checkbox
                      className="mr-3"
                      checked={selectedSpecialities.includes(speciality.id)}
                      onChange={() => handleCheckboxChange(speciality.id)}
                    />
                    <div className="text-Regular16">
                      {highlightText(speciality.name, specialitySearch)}
                    </div>
                  </div>
                  <DividerSaunet className="m-0" />
                </Fragment>
              ))}
          </div>
          {selectedSpecialities.length > 0 && (
            <div className="w-full py-4">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  setSpecializations("speciality_ids", selectedSpecialities);
                  setOpenSpecializationsDialog(false);
                }}
              >
                Выбрано специальностей: {selectedSpecialities.length}
              </Button>
            </div>
          )}
        </Island>
      </div>
    </Dialog>
  );
};
