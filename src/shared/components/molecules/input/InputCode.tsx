import type { Ref } from "react";
import { forwardRef } from "react";
import type { AuthCodeRef } from "react-auth-code-input";
import AuthCode from "react-auth-code-input";

import clsx from "clsx";

import type { InputCodePropsType } from "./props";

export const InputCode = forwardRef<AuthCodeRef, InputCodePropsType>(
  (
    {
      onChange,
      length = 3,
      containerClassName,
      inputClassName,
    }: InputCodePropsType,
    ref: Ref<AuthCodeRef> | undefined
  ) => (
    <AuthCode
      ref={ref}
      onChange={onChange}
      length={length}
      allowedCharacters="numeric"
      containerClassName={clsx("flex", containerClassName)}
      inputClassName={clsx(
        "mx-2 h-16 w-12 rounded-xl border-0 bg-gray-2 p-2 text-center text-Bold32 text-dark focus-visible:border-2 focus-visible:border-solid focus-visible:!border-neutralStatus focus-visible:shadow-none focus-visible:outline-none",
        inputClassName
      )}
    />
  )
);

InputCode.displayName = "InputCode";
