import type { FC } from "react";

import { Divider } from "antd";

import { Review } from "@/shared/components";

export const Reviews: FC = () => (
  <div className="flex w-full flex-col gap-5">
    <>
      <Review
        className="!bg-gray-0"
        name="Евгений К."
        rate={5}
        date="23 марта"
        message="Очень понравился сервис, обязательно порекомендую друзьям и близким!"
      />
      <Divider className="mt-0" />
    </>
    <>
      <Review
        className="!bg-gray-0"
        name="Евгений К."
        rate={5}
        date="23 марта"
        message="Очень понравился сервис, обязательно порекомендую друзьям и близким!"
      />
      <Divider className="mt-0" />
    </>
  </div>
);
