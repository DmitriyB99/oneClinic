export interface DesktopMessageCellProps {
  isOnline?: boolean;
  mainIcon?: JSX.Element;
  mainImage?: string;
  messageTime?: string;
  name: string;
  numberOfMessages?: number;
  onClick?: () => void;
  subheading?: string;
}
