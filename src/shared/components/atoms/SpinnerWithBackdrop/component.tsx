import type { FC } from "react";

import { Spin } from "antd";

import type { SpinnerWithBackdropProps } from "./props";

export const SpinnerWithBackdrop: FC<SpinnerWithBackdropProps> = ({ text }) => (
  <div className="absolute z-[100] flex h-full w-full flex-col items-center justify-center backdrop-blur">
    <Spin size="large" />
    {text && <p className="mt-2 rounded p-1 text-Bold20 text-black">{text}</p>}
  </div>
);
