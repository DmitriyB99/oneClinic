export interface AutocompleteSaunetProps {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}
