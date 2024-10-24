import type { FC } from "react";

import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputProps } from "antd";
import { Input as InputAntd } from "antd";
import clsx from "clsx";

export const InputSearch: FC<InputProps> = ({ className, ...rest }) => (
  <InputAntd
    prefix={<SearchOutlined />}
    placeholder="Search"
    className={clsx("w-60 rounded-xl", className)}
    allowClear={{ clearIcon: <CloseCircleOutlined className="mb-1" /> }}
    {...rest}
  />
);
