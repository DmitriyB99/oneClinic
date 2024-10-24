export interface DefaultCellProps {
  caption?: string | JSX.Element;
  captionClasses?: string;
  checked?: boolean;
  className?: string;
  hideMainIcon?: boolean;
  mainIcon?: JSX.Element;
  onCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  rightElement?: JSX.Element;
  leftElement?: JSX.Element;
  subheading?: string;
  title?: string | JSX.Element;
}
