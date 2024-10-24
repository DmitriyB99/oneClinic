import type { FC } from "react";

import { PlusOutlined } from "@ant-design/icons";

export const PlusBadge: FC<{ setOpenDialog?: (value: boolean) => void }> = ({
  setOpenDialog,
}) => (
  <div
    className="rounded-2xl border-2 border-solid border-white bg-brand-light p-1"
    onClick={() => setOpenDialog?.(true)}
  >
    <PlusOutlined className="text-brand-secondary" />
  </div>
);
