import type { FC } from "react";

import type { TimePickerProps } from "antd";
import { TimePicker } from "antd";

export const TimePickerSaunet: FC<TimePickerProps> = ({ ...rest }) => (
  <TimePicker
    suffixIcon={null}
    showNow={false}
    allowClear={false}
    inputReadOnly
    {...rest}
  />
);
