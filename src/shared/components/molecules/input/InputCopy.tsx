import { useMemo, useState } from "react";
import type { FC } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { Button, Input } from "antd";

import type { InputCopyProps } from "@/shared/components";
import { CopyIcon } from "@/shared/components";

export const InputCopy: FC<InputCopyProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);
  const copyIconColor = useMemo(
    () => (copied ? "colorPrimaryBase" : undefined),
    [copied]
  );
  return (
    <Input
      className="h-10 rounded-md [&_.ant-input]:text-colorPrimaryBase"
      suffix={
        <CopyToClipboard
          text={content}
          onCopy={() => {
            setCopied(true);
          }}
        >
          <Button type="text" className="flex items-center">
            <CopyIcon
              className="cursor-pointer"
              size="sm"
              color={copyIconColor}
            />
          </Button>
        </CopyToClipboard>
      }
      defaultValue={content}
      readOnly
    />
  );
};
