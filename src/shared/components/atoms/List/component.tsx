import type { FC } from "react";

import { Radio, Space } from "antd";

import { RadioSaunet } from "@/shared/components";

import type { ListProps } from "./props";
import { Avatar } from "../Avatars";

const emptyIcon = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="m-auto h-[18px] w-[18px] rounded-full bg-gray-icon" />
  </div>
);

export const List: FC<ListProps> = ({ items, radio }) => {
  const renderChildren = (title: string, description: string) => (
    <div>
      <p className="mb-1 text-Regular16">{title}</p>
      <p className="mb-0 text-Regular12 text-secondaryText">{description}</p>
    </div>
  );
  return (
    <>
      {radio ? (
        <Radio.Group
          value={radio.value}
          onChange={(event) => radio.onChange(event.target.value)}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            {items.map((item) => (
              <RadioSaunet
                key={item.id}
                value={item.id}
                className="w-full [&>span]:!w-full"
              >
                <div className="ml-2 w-full border-x-0 border-b border-t-0 border-solid border-b-gray-1 py-3">
                  {renderChildren(item.title, item.description)}
                </div>
              </RadioSaunet>
            ))}
          </Space>
        </Radio.Group>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex items-center py-3">
            <Avatar
              isSquare
              className="mr-3 bg-brand-light"
              icon={item.icon || emptyIcon()}
            />
            {renderChildren(item.title, item.description)}
          </div>
        ))
      )}
    </>
  );
};
