export interface NavbarProps {
  avatar?: string;
  buttonIcon?: JSX.Element;
  className?: string;
  description?: string | JSX.Element;
  leftButtonClassName?: string;
  leftButtonOnClick?: () => void;
  rightIcon?: JSX.Element;
  rightIconOnClick?: () => void;
  title?: string;
}
