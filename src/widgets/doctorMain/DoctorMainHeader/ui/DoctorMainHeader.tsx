import type { FC } from "react";

import clsx from "clsx";
import { useRouter } from "next/router";

import { Avatar, Island, SaunetMobileIcon } from "@/shared/components";

import type { DoctorMainHeaderModel } from "../models/DoctorMainHeaderModel";

export const DoctorMainHeader: FC<DoctorMainHeaderModel> = ({
  avatarUrl,
  rating,
  className,
}) => {
  const router = useRouter();

  return (
    <Island className={clsx("flex items-center justify-between", className)}>
      <div className="flex items-center">
        <SaunetMobileIcon width={109} height={32} />
      </div>
      <div className="flex items-center justify-start">
        <div
          className="rounded-xl px-2 py-1 text-Bold14"
          onClick={() => router.push("/myDoctor/statistics")}
        >
          {rating?.toFixed(1) ?? 0} <span className="ml-0.5">⭐</span>
        </div>
        <Avatar size="s" src={avatarUrl} className="ml-3" />
      </div>
    </Island>
  );
};
