import type { ChangeEvent } from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { PatternFormat } from "react-number-format";

import type { InputRef } from "antd";
import { Button, Input } from "antd";
import clsx from "clsx";

import type { DesktopInputTextProps } from "./props";

export const DesktopInputText = forwardRef<
  HTMLDivElement,
  DesktopInputTextProps
>(
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
      placeholder,
      desktopDrawer,
      onPressEnter,
      enterBtnClick,
      maxLength,
      innerClassName,
      rightIcon,
      rightIconClick,
      readOnly = false,
    },
    ref
  ) => {
    const inputRef = useRef<InputRef>(null);
    const [isFocused, setIsFocused] = useState<boolean>(!!value);
    useEffect(() => {
      setIsFocused(!!value);
    }, [value]);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (maxLength) {
          if (inputValue.length <= maxLength) {
            onChange?.(event);
          }
        } else {
          onChange?.(event);
        }
      },
      [maxLength, onChange]
    );
    return (
      <div ref={ref} className={clsx("relative w-full", wrapperClassName)}>
        <div
          className={clsx(
            "flex h-12 w-full items-center justify-between rounded-xl border-2 border-solid border-gray-200 bg-white",
            {
              "!border-brand-primary": isSuccess,
              "!border-red": isError,
              "h-[38px] !rounded-md !border-gray-7 !border": desktopDrawer,
            },
            innerClassName
          )}
        >
          {icon && <div className="mx-2 flex">{icon}</div>}
          <div className="flex w-full flex-col">
            {isPhone ? (
              <div>
                <PatternFormat
                  className={clsx(
                    "w-full rounded-md border-0 bg-white text-Regular16 text-dark placeholder:text-gray-icon focus:border-0 focus-visible:border-0 focus-visible:outline-none active:border-0",
                    { "px-3": !icon }
                  )}
                  format="+7 (###) ### ## ##"
                  onChange={(event) => onChange?.(event)}
                  mask="_"
                  name={name}
                  value={value}
                  disabled={disabled}
                  placeholder={placeholder ?? "Ваш номер телефона"}
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
                          "mt-3.5 text-Regular16": !isFocused,
                          "mt-0 text-Regular16": isFocused,
                        }
                      )}
                      onClick={(event) => {
                        onClick?.(event);
                        if (disabled) return;
                        setIsFocused(true);
                        inputRef?.current?.focus();
                      }}
                    >
                      {showAsterisk && <span className="text-red">*</span>}
                    </div>
                    <Input
                      placeholder={placeholder ? placeholder : label}
                      readOnly={readOnly}
                      ref={inputRef}
                      disabled={disabled}
                      onChange={handleChange}
                      onFocus={(event) => {
                        setIsFocused(true);
                        onFocus?.(event);
                      }}
                      value={value}
                      name={name}
                      onBlur={(event) => {
                        onBlur?.(event);
                        if (event.target.value === "") {
                          setIsFocused(false);
                        }
                      }}
                      onPressEnter={onPressEnter}
                      type={type}
                      className={clsx(
                        inputClassName,
                        "w-full border-0 !bg-white p-0 text-Regular16 hover:border-0 focus:border-0 focus:shadow-none active:border-0",
                        {
                          "[&::-webkit-inner-spin-button]:appearance-none":
                            type === "number",
                        }
                      )}
                    />
                  </>
                )}
              </>
            )}
          </div>
          {rightIcon && (
            <div
              className={clsx("mx-2 flex", {
                "cursor-pointer": rightIconClick,
              })}
              onClick={rightIconClick}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {enterBtnClick && (
          <Button
            className="absolute right-0 top-[3px]"
            type="link"
            onClick={enterBtnClick}
          >
            Enter
          </Button>
        )}
        {bottomText && (
          <div
            className={clsx("mt-1 text-Regular14", {
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

DesktopInputText.displayName = "InputText";
