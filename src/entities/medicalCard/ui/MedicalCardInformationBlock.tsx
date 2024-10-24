import type { FC, PropsWithChildren } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Button as AntButton } from "antd";
import clsx from "clsx";

import type { MedicalCardInformationBlockProps } from "@/entities/medicalCard";
import { Button, Island, PlusIcon } from "@/shared/components";

export const MedicalCardInformationBlock: FC<
  MedicalCardInformationBlockProps & PropsWithChildren
> = ({ children, setDialogVisible, isEmpty, topText, isEditable = true }) => (
  <Island className="mb-2 pb-2">
    <div
      className={clsx("mb-1 flex items-center", {
        "justify-between": !isEmpty,
        "justify-start": isEmpty,
      })}
    >
      <div className="text-Bold20"> {topText}</div>
    </div>
    {children}
    {setDialogVisible && (
      <AntButton
        className="my-3 flex h-fit items-center gap-1 rounded-2xl border-none bg-lightRed px-3 py-2 text-Regular14"
        onClick={() => setDialogVisible?.(true)}
      >
        Добавить <PlusIcon size="xs" />
      </AntButton>
    )}
  </Island>
);
