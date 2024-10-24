import type { FC } from "react";

import { CheckOutlined } from "@ant-design/icons";
import type { CheckableTagProps } from "antd/lib/tag/CheckableTag";
import CheckableTag from "antd/lib/tag/CheckableTag";
import clsx from "clsx";

import type { ChipProps } from "./props";

export const Chip: FC<ChipProps & CheckableTagProps> = ({
  checked = false,
  label,
  type = "suggest",
  className,
  onChange,
  disabled,
}) => (
  <CheckableTag
    checked={checked}
    onChange={(checked) => {
      if (disabled) return;
      onChange?.(checked);
    }}
    className={clsx(
      "m-1 inline-block h-8 w-fit cursor-pointer rounded-2xl bg-brand-light px-3 py-2 text-Regular14 text-dark hover:!text-dark",
      {
        "bg-purple-1 text-purple-0 hover:!bg-brand-light hover:!text-white":
          type === "suggest",
        "hover:active:!bg-pressedButton-secondary": type === "multiselect",
        "bg-brand-primary hover:!text-white hover:!bg-brand-primary":
          type === "single" && checked,
        "bg-gray-2": type === "single" && !checked,
        "bg-white border border-solid border-gray-2 hover:!bg-white hover:!text-dark":
          type === "multiselect" && !checked,
        "bg-white border border-solid border-brand-primary hover:!bg-white":
          type === "multiselect" && checked,
        "text-gray-icon hover:!text-gray-icon": disabled,
      },
      className
    )}
  >
    {type === "multiselect" && checked && <CheckOutlined className="mx-1" />}
    {label}
  </CheckableTag>
);
