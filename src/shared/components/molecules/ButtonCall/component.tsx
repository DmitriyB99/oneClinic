import type { FC } from "react";
import React from "react";

import { Button } from "@/shared/components";

import type { ButtonCallProps } from "./props";

export const ButtonCall: FC<ButtonCallProps> = ({
  icon,
  title,
  onClick,
  isDanger,
}) => (
  <div className="w-[66px] text-center">
    <Button
      square
      transparent
      className="mb-2"
      danger={isDanger}
      onClick={onClick}
    >
      {React.cloneElement(icon, {
        color: "white",
      })}
    </Button>
    <p className="m-0 text-Regular12 text-white">{title}</p>
  </div>
);
