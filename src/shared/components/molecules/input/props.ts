import type {
  ChangeEvent,
  HTMLInputTypeAttribute,
  FocusEvent,
  MouseEvent,
} from "react";

import type { TextAreaProps } from "antd/es/input";

export interface InputTextProps {
  bottomText?: string;
  disabled?: boolean;
  icon?: JSX.Element;
  inputClassName?: string;
  innerClassName?: string;
  isError?: boolean;
  isPhone?: boolean;
  isSuccess?: boolean;
  readOnly?: boolean;
  isSelect?: boolean;
  label: string;
  name: string;
  onBlur?: (event?: FocusEvent<HTMLInputElement>) => void;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event?: MouseEvent<HTMLDivElement>) => void;
  onFocus?: (event?: FocusEvent<HTMLInputElement>) => void;
  onSearch?: (search: string) => void;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  showAsterisk?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: string;
  wrapperClassName?: string;
  maxLength?: number;
}

export interface InputCodePropsType {
  containerClassName?: string;
  inputClassName?: string;
  length?: number;
  onChange: (value: string) => void;
}

export interface InputTextAreaProps extends TextAreaProps {
  className?: string;
  isSuccess?: boolean;
  label?: string;
}

export interface DesktopInputTextProps extends InputTextProps {
  desktopDrawer?: boolean;
  onPressEnter?: () => void;
  placeholder?: string;
  enterBtnClick?: () => void;
  rightIcon?: JSX.Element;
  rightIconClick?: () => void;
  readOnly?: boolean;
}

export interface InputCopyProps {
  content: string;
}
