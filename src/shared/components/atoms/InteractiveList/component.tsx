import type { FC } from "react";

import { RightOutlined } from "@ant-design/icons";
import clsx from "clsx";

import { DividerSaunet } from "@/shared/components";

import type { InteractiveListProps } from "./props";
export const InteractiveList: FC<InteractiveListProps> = ({
  list,
  maxItems,
  onClick,
  listItemWrapperClassNames,
}) => (
  <div>
    {list?.slice(0, maxItems).map((listItem, index) => (
      <div key={listItem.id}>
        <div
          className={clsx(
            "flex cursor-pointer items-center justify-between py-6",
            {
              "!py-3": listItem.description,
            },
            listItemWrapperClassNames
          )}
          onClick={() => {
            onClick?.(listItem?.id);
          }}
        >
          <div className="flex items-center justify-start">
            {listItem?.startIcon && (
              <div className="mr-3">{listItem?.startIcon}</div>
            )}
            <div>
              <p
                className={clsx("mb-0 text-Regular16", {
                  "mb-1": listItem.description,
                })}
              >
                {listItem.title}
              </p>
              {listItem.description && (
                <p className="mb-0 text-Regular12">{listItem.description}</p>
              )}
            </div>
          </div>
          {onClick && (listItem?.endIcon ?? <RightOutlined />)}
        </div>
        {index !== list.length - 1 && <DividerSaunet className="m-0" />}
      </div>
    ))}
  </div>
);
