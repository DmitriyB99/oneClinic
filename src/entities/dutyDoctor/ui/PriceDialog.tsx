import { useState } from "react";

import { Input } from "antd";
import { useTranslations } from "next-intl";

import {
  Button,
  Dialog,
  InputText,
  Island,
  SearchIcon,
} from "@/shared/components";
import { Controller, useForm } from "react-hook-form";

export const PriceDialog = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  setFilterByPriceDialogOpen,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore-next-line
  filterByPriceDialogOpen,
}) => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue: setAmbulanceCallModel,
  } = useForm();
  const {
    control: addressControl,
    getValues: getAddressValues,
    setValue,
  } = useForm();

  const t = useTranslations("Common");

  return (
    <Dialog
      isOpen={filterByPriceDialogOpen}
      setIsOpen={setFilterByPriceDialogOpen}
      className="!p-0 flex flex-col"
    >
      <div className="bg-gray-2 flex flex-col flex-grow">
        <Island>
          <div className="py-4 flex justify-between items-center">
            <div className="text-Regular14 text-red">Сбросить</div>
            <div className="text-Bold16">Стоимость</div>
            <div className="text-Regular14">Готово</div>
          </div>
          <div className="my-3 text-Bold20">Стоимость</div>
          <div className="pt-3 flex justify-between">
            <Controller
              control={addressControl}
              name="entrance"
              render={({ field }) => (
                <InputText
                  label={"от 1000 тг"}
                  name="entry"
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  wrapperClassName={"mr-3"}
                  showAsterisk={false}
                />
              )}
            />
            <Controller
              control={addressControl}
              name="floor"
              render={({ field }) => (
                <InputText
                  label={"до 368 000 тг"}
                  name="floor"
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  wrapperClassName={"ml-3"}
                  showAsterisk={false}
                />
              )}
            />
          </div>
        </Island>
        <Island className="mt-3 rounded-none">
          <Button
            variant="primary"
            className="w-full px-4 text-Medium16"
            onClick={() => {
              console.log(12);
            }}
          >
            <div>Показать</div>
          </Button>
        </Island>
      </div>
    </Dialog>
  );
};
