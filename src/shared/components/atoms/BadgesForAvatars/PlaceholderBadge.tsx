import type { FC } from "react";

import { IconPlaceholder } from "@/shared/components";

export const PlaceholderBadge: FC<{ setOpenDialog: (value: boolean) => void }> =
  ({ setOpenDialog }) => (
    <div
      className="h-fit cursor-pointer rounded-md border-2 border-solid border-white bg-gray-1 p-1"
      onClick={() => setOpenDialog(true)}
    >
      <IconPlaceholder color="gray-icon" />
    </div>
  );
