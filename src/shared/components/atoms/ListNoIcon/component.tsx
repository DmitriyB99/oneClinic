import type { FC } from "react";

import { Avatar } from "antd";

import type { ListNoIconProps } from "./props";

export const ListNoIcon: FC<ListNoIconProps> = ({ items }) => {
  const renderChildren = (title: string, description: string) => (
    <div className="ml-3">
      <p className="mb-1 text-Regular16">{title}</p>
      <p className="mb-0 text-Regular12 text-secondaryText">{description}</p>
    </div>
  );
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="flex items-center py-3">
          <Avatar
            shape="square"
            size={40}
            style={{
              backgroundColor: "#F8EAED",
              color: "#F62F5A",
              borderRadius: "12px",
            }}
          >
            <span className="text-crimson">{item.text}</span>
          </Avatar>
          {renderChildren(item.title, item.description)}
        </div>
      ))}
    </>
  );
};
