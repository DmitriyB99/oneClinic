import type { ChangeEvent } from "react";
import {
  forwardRef,
  useRef,
  useState,
  Fragment,
  useEffect,
  useCallback,
} from "react";

import type { InputRef } from "antd";
import { Divider, Input } from "antd";
import clsx from "clsx";
import { debounce } from "lodash";

import { highlightText } from "@/shared/utils/higlightText";

import type { InputTextProps } from "./props";
import { ArrowDownIcon } from "../../atoms";

interface Option {
  id: string | number;
  name: string;
}

export const InputSelect = forwardRef<
  HTMLDivElement,
  InputTextProps & { options: Option[] }
>(
  (
    {
      label,
      inputClassName,
      wrapperClassName,
      isError = false,
      isSuccess = false,
      readOnly = false,
      value,
      bottomText,
      icon,
      onChange,
      name,
      type,
      showAsterisk = true,
      disabled = false,
      onFocus,
      onBlur,
      onClick,
      options,
      onSearch,
      onScroll,
    },
    ref
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<InputRef>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [initialized, setInitialized] = useState<boolean>(false); // Флаг для отслеживания инициализации

    const shouldLabelFloat = isFocused || !!searchValue;

    // Устанавливаем начальное значение searchValue при изменении value
    useEffect(() => {
      if (!initialized) {
        // Устанавливаем значение только при первой инициализации
        const selectedOption = options.find((option) => option.id === value);

        if (selectedOption) {
          setSearchValue(selectedOption.name);
        } else {
          setSearchValue(""); // Если значение не найдено, сбросьте значение
        }
        setInitialized(true); // Устанавливаем флаг, что инициализация завершена
      }
    }, [value, options, initialized]);

    const debouncedSearch = useCallback(
      debounce((search: string) => {
        onSearch(search);
      }, 300), // Задержка в 300 мс
      [onSearch]
    );

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setSearchValue(newValue);
      debouncedSearch(newValue);
    };

    useEffect(
      () => () => {
        debouncedSearch.cancel();
      },
      [debouncedSearch]
    );

    const handleDropdownToggle = () => {
      if (!disabled) {
        setDropdownOpen((prev) => !prev);
      }
    };

    const handleOptionSelect = (option: Option) => {
      setSearchValue(option.name);
      dropdownOpen && setDropdownOpen(false);
      onChange?.({
        target: { value: option.id },
      } as ChangeEvent<HTMLInputElement>);
    };

    const updateDropdownWidth = useCallback(() => {
      if (localRef.current && dropdownRef.current) {
        const inputWidth = localRef.current.getBoundingClientRect().width;
        dropdownRef.current.style.width = `${inputWidth - 16}px`;
      }
    }, []);

    useEffect(() => {
      updateDropdownWidth();
      window.addEventListener("resize", updateDropdownWidth);
      return () => {
        window.removeEventListener("resize", updateDropdownWidth);
      };
    }, [updateDropdownWidth]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          localRef.current &&
          !localRef.current.contains(event.target as Node)
        ) {
          setDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div ref={localRef} className={clsx("relative w-full", wrapperClassName)}>
        <div
          className={clsx(
            "relative flex h-16 w-full items-center justify-between rounded-xl border-2 border-solid border-gray-2 bg-gray-2",
            {
              "!border-2 !border-solid !border-neutralStatus !shadow-none !outline-none":
                isFocused,
              "!border-brand-primary": isSuccess,
              "!border-red": isError,
            }
          )}
        >
          <div className="relative flex w-full flex-col px-4">
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
                inputRef.current?.focus();
              }}
            >
              {label}
              {showAsterisk && <span className="text-red">*</span>}
            </div>
            <Input
              ref={inputRef}
              disabled={disabled}
              onChange={handleSearchChange} // Обновление через дебаунс
              onFocus={(event) => {
                setIsFocused(true);
                onFocus?.(event);
                handleDropdownToggle();
              }}
              value={searchValue}
              name={name}
              onBlur={(event) => {
                onBlur?.(event);
                setIsFocused(false);
              }}
              type={type}
              className={clsx(
                inputClassName,
                "mt-4 w-full border-none !bg-gray-2 pl-0 hover:border-0 focus:border-0 focus:shadow-none focus-visible:border-none active:border-0"
              )}
              readOnly={readOnly}
            />
            <div
              className="absolute right-4 top-7 -translate-y-1/2 cursor-pointer text-secondaryText"
              onClick={handleDropdownToggle}
            >
              <ArrowDownIcon width={15} />
            </div>
          </div>
          {icon && <div className="mr-4 text-secondaryText">{icon}</div>}
        </div>
        <div
          ref={dropdownRef}
          onScroll={onScroll}
          className={clsx(
            "absolute left-2 top-14 z-40 overflow-scroll rounded-xl border border-gray-300 bg-white shadow-md transition-all duration-100 ease-out",
            {
              "opacity-0 max-h-0": !dropdownOpen,
              "opacity-100 max-h-[500px]": dropdownOpen,
            }
          )}
        >
          {options.map((option, index) => (
            <Fragment key={option.id}>
              <div
                className="cursor-pointer p-4 hover:bg-gray-2"
                onClick={() => handleOptionSelect(option)}
              >
                <p className="m-0 mt-1 text-Regular16">
                  {highlightText(option.name, searchValue)}
                </p>
              </div>
              {index !== options.length - 1 && <Divider className="m-0" />}
            </Fragment>
          ))}
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

InputSelect.displayName = "InputSelect";
