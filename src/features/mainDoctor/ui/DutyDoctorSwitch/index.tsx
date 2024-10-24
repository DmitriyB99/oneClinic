import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import clsx from "clsx";

interface Props {
  isInitiallyActive: boolean;
  consultationsCount?: number;
  money?: number;
  onSwitch: (active: boolean) => void;
}

export const DutyDoctorSwitch: FC<Props> = ({
  isInitiallyActive,
  onSwitch,
}) => {
  const [active, setActive] = useState<boolean>(isInitiallyActive);

  useEffect(() => {
    setActive(isInitiallyActive);
  }, [isInitiallyActive]);

  const handleClick = useCallback(() => {
    onSwitch?.(!active);
    setActive((prev) => !prev);
  }, [active, onSwitch]);

  const renderText = useMemo(() => {
    if (active) {
      return <>{"Завершить"}</>;
    }
    return <>{"Начать консультировать"}</>;
  }, [active]);

  const renderArrow = useMemo(() => {
    if (active) {
      return <ArrowLeftOutlined className="h-5 text-Bold20" />;
    }
    return <ArrowRightOutlined className="h-5 text-Bold20" />;
  }, [active]);

  return (
    <button
      className={clsx(
        "relative h-14 w-full cursor-pointer rounded-2xl border-none px-3 transition-colors duration-500",
        {
          "bg-crimson": !active,
          "bg-lightRed": active,
        }
      )}
      onClick={handleClick}
    >
      <div
        className={clsx(
          "absolute top-3 w-full transition-transform duration-500",
          {
            "translate-x-0": !active,
            "translate-x-[calc(100%-55px)]": active,
          }
        )}
      >
        <div className="h-8 w-fit rounded-lg bg-white p-1.5">{renderArrow}</div>
      </div>
      <div
        className={clsx("text-Medium16", {
          "text-white": !active,
          "text-crimson": active,
        })}
      >
        {renderText}
      </div>
    </button>
  );
};
