import type { FC } from "react";

import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";

import type { TakeMedicineInputDropdownModel } from "@/entities/myDoctorPatients";
import { DividerSaunet } from "@/shared/components";

export const TakeMedicineInputDropdown: FC<TakeMedicineInputDropdownModel> = ({
  items,
  isShortened,
  activeItem,
  setActiveItem,
}) => (
  <Dropdown
    menu={{
      items: items.map((item) => ({
        key: item.id,
        label: (
          <>
            <div
              className="py-2 text-Regular16"
              onClick={() => setActiveItem?.(item.title)}
            >
              {item.title}
            </div>
            <DividerSaunet className="m-0 p-0" />
          </>
        ),
      })),
    }}
    overlayClassName="w-full px-4 pt-6"
  >
    <div className="flex cursor-pointer">
      <div className="mr-1 whitespace-pre">
        {isShortened ? `${activeItem?.slice(0, 4)}.` : activeItem}
      </div>
      <DownOutlined />
    </div>
  </Dropdown>
);
