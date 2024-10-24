import type { FC } from "react";
import { Fragment, useState } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";

import { Dialog, DividerSaunet, Island, SearchIcon } from "@/shared/components";

import type { MedicalDirectionSelectDialogProps } from "../models/MedicalDirectionSelectDialogProps";

export const MedicalDirectionSelectDialog: FC<MedicalDirectionSelectDialogProps> =
  ({
    selectNumber,
    title,
    placeholder,
    values,
    onSelect,
    onCancel,
    isOpen,
    setIsOpen,
  }) => {
    const [value, setValue] = useState<string>("");

    return (
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="!p-0">
        {values.length === 0 ? (
          <div className="bg-gray-2">
            <Island className="my-2">
              <div>Нет опций для выбора</div>
            </Island>
          </div>
        ) : (
          <div className="bg-gray-2">
            <Island className="my-2">
              <div className="mb-4 text-Bold24">{title}</div>
              <div className="flex items-center justify-between rounded-xl bg-gray-2 px-4 py-2">
                <SearchIcon className="mr-3 text-gray-icon" />
                <Input
                  className="border-0 bg-gray-2 hover:border-0 focus:border-0"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                  }}
                  placeholder={placeholder}
                />
                <CloseOutlined
                  className="ml-3 cursor-pointer text-gray-icon"
                  onClick={onCancel}
                />
              </div>
            </Island>
            <Island>
              {values.map((item) => (
                <Fragment key={item.categoryId}>
                  <div
                    className="flex h-16 cursor-pointer items-center justify-start"
                    onClick={() => {
                      onSelect(item, selectNumber);
                      setIsOpen(false);
                    }}
                  >
                    <div className="text-Regular16">{item.name}</div>
                  </div>
                  <DividerSaunet className="m-0" />
                </Fragment>
              ))}
            </Island>
          </div>
        )}
      </Dialog>
    );
  };
