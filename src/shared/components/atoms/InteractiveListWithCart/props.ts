export interface ListType {
  description?: string;
  endIcon?: React.ReactNode;
  id: number | string;
  startIcon?: React.ReactNode;
  title: string;
}

export interface InteractiveListProps {
  list: ListType[];
  listItemWrapperClassNames?: string;
  maxItems?: number;
  onClick?: (id: number | string) => void;
}
