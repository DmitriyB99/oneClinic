import type { FC } from "react";
import { Fragment, useState } from "react";

import { DownOutlined, UpOutlined } from "@ant-design/icons";

import { DividerSaunet, InputText } from "@/shared/components";

import type { AutocompleteSaunetProps } from "./props";

export const AutocompleteSaunet: FC<AutocompleteSaunetProps> = ({
  options,
  label,
  onChange,
  className,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  return (
    <>
      <InputText
        wrapperClassName={className}
        label={label}
        name={label}
        value={search}
        showAsterisk={false}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        icon={
          showOptions ? (
            <UpOutlined className="text-gray-icon" />
          ) : (
            <DownOutlined className="text-gray-icon" />
          )
        }
        isSuccess={showOptions}
        onFocus={() => setShowOptions(true)}
        onBlur={() => {
          setTimeout(() => {
            setShowOptions(false);
          }, 100);
        }}
      />
      {showOptions && (
        <div className="absolute z-50 w-full rounded-xl bg-white shadow-md">
          {options
            ?.filter((option) =>
              option.label.toLowerCase().includes(search.toLowerCase())
            )
            ?.map((option) => (
              <Fragment key={option.value}>
                <div
                  className="cursor-pointer p-4"
                  onClick={() => {
                    onChange(option.value);
                    setSearch(option.label);
                    setShowOptions(false);
                  }}
                >
                  <div className="p-2">{option.label}</div>
                </div>
                <DividerSaunet className="m-0" />
              </Fragment>
            ))}
        </div>
      )}
    </>
  );
};
