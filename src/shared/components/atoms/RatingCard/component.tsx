import type { FC } from "react";

import { StarFilled } from "@ant-design/icons";
import { Rate } from "antd";
import dayjs from "dayjs";

import { Avatar } from "@/shared/components";
import { dateFormat } from "@/shared/config";

export const RatingCard: FC<{
  className: string;
  date: Date;
  name: string;
  rating: number;
  icon_url?: string;
}> = ({ className, name, date, rating, icon_url }) => (
  <div className={className}>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Avatar src={icon_url} size="avatar" className="mr-3" />
        <div>
          <p className="mb-1 text-Regular14">{name}</p>
          <Rate
            defaultValue={rating}
            disabled
            character={() => <StarFilled size={12} />}
          />
        </div>
      </div>
      <p className="mb-0 text-Regular12 text-secondaryText">
        {dayjs(date).format(dateFormat)}
      </p>
    </div>
  </div>
);
