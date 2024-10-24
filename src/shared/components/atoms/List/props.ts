import type { ReactElement } from "react";

export interface ListProps {
  items: {
    description: string;
    icon?: ReactElement;
    id: string;
    title: string;
  }[];
  radio?: {
    onChange: (value: string) => void;
    value: string;
  };
}
