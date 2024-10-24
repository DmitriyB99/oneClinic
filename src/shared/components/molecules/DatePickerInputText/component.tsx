import type { FC } from "react";

import type { DatePickerProps } from "antd";
import clsx from "clsx";

import { DatePicker, InputText } from "@/shared/components";

export const DataPickerInputText: FC<DatePickerProps> = ({
  className,
  ...rest
}) => (
  <DatePicker
    size="large"
    suffixIcon={null}
    bordered={false}
    inputRender={(props) => (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <InputText
        {...props}
        label="Дата"
        showAsterisk={false}
        readOnly
      />
    )}
    {...rest}
    className={clsx("w-full !p-0", className)}
  />
);
