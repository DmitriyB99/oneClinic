import type { FC } from "react";
import { useRef, useState } from "react";

import type { InputRef } from "antd";
import { Input as InputAntd } from "antd";
import clsx from "clsx";

import type { InputTextAreaProps } from "@/shared/components";

export const InputTextarea: FC<InputTextAreaProps> = ({
  className,
  isSuccess,
  label,
  value,
  disabled,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(!!value);
  const inputRef = useRef<InputRef>(null);

  return (
    <>
      <div
        className={clsx(
          "absolute z-30 ml-4 mt-2 cursor-text text-secondaryText transition-all",
          {
            "mt-3.5 text-Regular16": !isFocused,
            "mt-0 text-Regular12": isFocused,
          }
        )}
        onClick={() => {
          if (disabled) return;
          setIsFocused(true);
          inputRef?.current?.focus();
        }}
      >
        {label}
      </div>
      <InputAntd.TextArea
        ref={inputRef}
        className={clsx(
          "rounded-xl border-none bg-gray-2 px-4 pb-2 pt-6",
          {
            "!border-solid border-2 !border-brand-primary": isSuccess,
          },
          className
        )}
        style={{ resize: "none" }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={(event) => {
          if (event.target.value === "") {
            setIsFocused(false);
          }
        }}
        {...rest}
      />
    </>
  );
};
