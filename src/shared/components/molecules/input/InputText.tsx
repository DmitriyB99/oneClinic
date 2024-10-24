import { forwardRef, useRef, useState } from "react";
import { PatternFormat } from "react-number-format";

import type { InputRef } from "antd";
import { Input } from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import type { InputTextProps } from "./props";
import { ArrowDownIcon } from "../../atoms";

export const InputText = forwardRef<HTMLDivElement, InputTextProps>(
  (
    {
      label,
      inputClassName,
      wrapperClassName,
      isError = false,
      isSuccess = false,
      value,
      bottomText,
      icon,
      onChange,
      isPhone = false,
      name,
      type,
      showAsterisk = true,
      disabled = false,
      onFocus,
      onBlur,
      onClick,
      readOnly = false,
      isSelect = false,
    },
    ref
  ) => {
    const t = useTranslations("Common");
    const inputRef = useRef<InputRef>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const shouldLabelFloat = isFocused || !!value;
    return (
      <div ref={ref} className={clsx("w-full", wrapperClassName)}>
        <div
          className={clsx(
            "flex h-16 w-full items-center justify-between rounded-xl border-2 border-solid border-gray-2 bg-gray-2",
            {
              "!border-2 !border-solid !border-neutralStatus !shadow-none !outline-none":
                isFocused,
              "!border-brand-primary": isSuccess,
              "!border-red": isError,
            }
          )}
        >
          <div className="relative flex w-full flex-col px-4">
            {isPhone ? (
              <div>
                <PatternFormat
                  className="w-full border-0 bg-gray-2 text-Regular16 text-dark focus:border-0 focus-visible:border-0 focus-visible:outline-none active:border-0"
                  format="+7 (###) ### ## ##"
                  onChange={(event) => onChange?.(event)}
                  mask="_"
                  name={name}
                  value={value}
                  disabled={disabled}
                  placeholder={t("YourPhoneNumber")}
                  onFocus={(event) => {
                    setIsFocused(true);
                    onFocus?.(event);
                  }}
                  onBlur={(event) => {
                    setIsFocused(false);
                    onBlur?.(event);
                  }}
                />
              </div>
            ) : (
              <>
                {label && (
                  <>
                    <div
                      className={clsx(
                        "absolute z-30 cursor-text text-secondaryText transition-all",
                        {
                          "mt-3.5 text-Regular16": !shouldLabelFloat,
                          "mt-0 text-Regular12": shouldLabelFloat,
                        }
                      )}
                      onClick={(event) => {
                        onClick?.(event);
                        if (disabled) return;
                        setIsFocused(true);
                        inputRef?.current?.focus();
                      }}
                    >
                      {label}
                      {showAsterisk && <span className="text-red">*</span>}
                    </div>
                    <Input
                      ref={inputRef}
                      disabled={disabled}
                      onChange={(event) => onChange?.(event)}
                      onFocus={(event) => {
                        setIsFocused(true);
                        onFocus?.(event);
                      }}
                      value={value}
                      name={name}
                      onBlur={(event) => {
                        onBlur?.(event);
                        setIsFocused(false);
                      }}
                      type={type}
                      className={clsx(
                        inputClassName,
                        "mt-4 w-full border-0 !bg-gray-2 pl-0 hover:border-0 focus:border-0 focus:shadow-none active:border-0"
                      )}
                      readOnly={readOnly}
                    />
                    {isSelect && (
                      <div className="absolute right-4 top-7 -translate-y-1/2 text-secondaryText">
                        <ArrowDownIcon width={15} />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {icon && <div className="mr-4 text-secondaryText">{icon}</div>}
        </div>
        {bottomText && (
          <div
            className={clsx("ml-4 mt-1 text-start text-Regular12", {
              "text-red": isError,
              "text-secondaryText": !isError,
            })}
          >
            {bottomText}
          </div>
        )}
      </div>
    );
  }
);

InputText.displayName = "InputText";
