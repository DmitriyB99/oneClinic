import type { MouseEvent, TouchEvent } from "react";
import { useCallback, useRef, useState } from "react";

const useLongPress = (
  onLongPress: (
    event: MouseEvent<HTMLVideoElement> | TouchEvent<HTMLVideoElement>
  ) => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 150 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (event: MouseEvent<HTMLVideoElement> | TouchEvent<HTMLVideoElement>) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (
      event: MouseEvent<HTMLVideoElement> | TouchEvent<HTMLVideoElement>,
      shouldTriggerClick = true
    ) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && !longPressTriggered && onClick();
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  );

  return {
    onMouseDownCapture: (ev: MouseEvent<HTMLVideoElement>) => start(ev),
    onTouchStart: (ev: TouchEvent<HTMLVideoElement>) => start(ev),
    onMouseUp: (ev: MouseEvent<HTMLVideoElement>) => clear(ev),
    onMouseLeaveCapture: (ev: MouseEvent<HTMLVideoElement>) => clear(ev, false),
    onTouchEndCapture: (ev: TouchEvent<HTMLVideoElement>) => clear(ev),
  };
};

const isTouchEvent = (event: TouchEvent<HTMLDivElement>) => "touches" in event;
/* eslint-disable  @typescript-eslint/no-explicit-any */

const preventDefault = (event: any) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default useLongPress;
