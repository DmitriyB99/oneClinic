import type { FC } from "react";
import { useRef } from "react";

import type { InputTextProps } from "@/shared/components";
import { InputText } from "@/shared/components";

interface InputFileProps extends Omit<InputTextProps, "onChange" | "onClick"> {
  accept?: string;
  onChange: (files: File[]) => void;
}

export const InputFile: FC<InputFileProps> = ({
  onChange,
  accept,
  ...rest
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <InputText
        {...rest}
        disabled
        onChange={() => {}}
        onClick={() => {
          inputFileRef?.current?.click();
        }}
      />
      <input
        accept={accept}
        type="file"
        className="hidden"
        ref={inputFileRef}
        onChange={() => {
          const files = inputFileRef?.current?.files;
          if (files) {
            onChange(Array.from(files));
          }
        }}
      />
    </>
  );
};
