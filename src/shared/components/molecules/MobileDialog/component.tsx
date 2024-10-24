import type { FC, TouchEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import clsx from "clsx";

import type { MobileDialogProps } from "./props";

export const MobileDialog: FC<MobileDialogProps> = ({
  children,
  hide,
  onHideChange,
  height: dialogFullHeight,
}) => {
  const [hideDialog, setHideDialog] = useState<boolean | undefined>(hide);
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const [tempHeight, setTempHeight] = useState(0);
  const [startDirection, setStartDirection] = useState(0);

  const handleHideChange = useCallback(
    (val: boolean) => {
      setHideDialog(val);
      onHideChange?.(val);
    },
    [onHideChange]
  );

  useEffect(() => {
    setHideDialog(hide);
  }, [hide]);

  const onScrollDialog = useCallback(
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    (event: any) => {
      if (event.target.scrollTop < 10) {
        setScrolledToTop(true);
      } else {
        setScrolledToTop(false);
      }
    },
    []
  );

  const onTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (
        event.changedTouches[0].clientY > startDirection + 50 &&
        scrolledToTop
      ) {
        handleHideChange(true);
      } else {
        handleHideChange(false);
      }
      setTempHeight(0);
    },
    [scrolledToTop, startDirection, handleHideChange]
  );

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!hideDialog) {
        setTempHeight(
          Math.round(event.changedTouches[0].clientY - startDirection)
        );
      } else {
        setTempHeight(
          Math.round(startDirection - event.changedTouches[0].clientY)
        );
      }
    },
    [hideDialog, startDirection]
  );

  const height = useMemo(() => {
    if (hideDialog === false && Boolean(tempHeight) && scrolledToTop) {
      return `calc(${dialogFullHeight ?? "80%"} - ${tempHeight / 2}px)`;
    }
    if (hideDialog && Boolean(tempHeight)) {
      return `calc(20% + ${tempHeight / 2}px)`;
    }
    if (hideDialog === undefined && Boolean(tempHeight)) {
      return `calc(50% - ${tempHeight / 2}px)`;
    }
    if (hideDialog === undefined) {
      return "50%";
    }
    if (!hideDialog) {
      return dialogFullHeight ?? "80%";
    }
    if (hideDialog) {
      return "20%";
    }
  }, [hideDialog, tempHeight, scrolledToTop, dialogFullHeight]);

  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 w-full overflow-y-auto bg-transparent transition-all rounded-3xl",
        {
          "!transition-none": tempHeight,
          "overflow-y-hidden": hideDialog || tempHeight,
        }
      )}
      style={{
        height: height,
      }}
      onTouchEnd={onTouchEnd}
      onScroll={onScrollDialog}
      onTouchStart={(event) =>
        setStartDirection(event.changedTouches[0].clientY)
      }
    >
      <div
        className="absolute left-0 top-0 z-50 h-20 w-full"
        onTouchStart={(event) =>
          setStartDirection(event.changedTouches[0].clientY)
        }
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      <div className="min-h-full bg-gray-2">{children}</div>
    </div>
  );
};
