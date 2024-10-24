export interface MessageCellProps {
  isOnline?: boolean;
  mainIcon?: JSX.Element;
  mainImage?: string;
  messageTime?: string;
  numberOfMessages?: number;
  onClick?: () => void;
  subheading?: string;
  title?: string;
  isGPT?: boolean;
}
