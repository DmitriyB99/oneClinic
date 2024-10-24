import { FC, useState } from "react";
import clsx from "clsx";
import {
  DividerSaunet,
  InteractiveListProps,
  PinkPlusIcon,
  TrashMessageIcon,
} from "@/shared/components";

export const InteractiveListWithCart: FC<InteractiveListProps> = ({
  list,
  maxItems,
  onClick,
  listItemWrapperClassNames,
}) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const handleSelect = (item) => {
    const isSelected = selectedServices.includes(item.id);

    if (isSelected) {
      setSelectedServices((prev) => prev.filter((id) => id !== item.id));
    } else {
      setSelectedServices((prev) => [...prev, item.id]);
    }

    onClick?.(item);
  };

  const getIcon = (itemId) => {
    return selectedServices.includes(itemId) ? (
      <TrashMessageIcon />
    ) : (
      <PinkPlusIcon />
    );
  };

  return (
    <div>
      {list.slice(0, maxItems).map((listItem, index) => (
        <div key={listItem.id}>
          <div
            className={clsx(
              "flex cursor-pointer items-center justify-between py-6",
              { "!py-3": listItem.description },
              listItemWrapperClassNames
            )}
            onClick={() => handleSelect(listItem)}
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
            {getIcon(listItem.id)}
          </div>
          {index !== list.length - 1 && <DividerSaunet className="m-0" />}
        </div>
      ))}
    </div>
  );
};
