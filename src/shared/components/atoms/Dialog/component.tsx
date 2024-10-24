import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { Button } from "antd";
import clsx from "clsx";

import type { PropertiesDialog } from "./props";
import { CloseIcon } from "../Icons";

function DialogElement({
  title,
  className,
  children,
  isOpen,
  setIsOpen,
  isTinted = true,
  lockScroll,
  onScroll,
  darkenBackground = true,
}: PropertiesDialog): ReactElement | null {
  const [closeModalAfterAnim, setCloseModalAfterAnim] = useState(true);

  const onModalClose = (): void => {
    setIsOpen?.(false);
    if (!lockScroll) {
      // eslint-disable-next-line compat/compat
      document.body.style.overflow = "auto";
    }
  };

  if (!closeModalAfterAnim || isOpen) {
    return (
      <div
        className={clsx(
          "fixed inset-0 z-50 flex h-full w-screen items-end !overflow-y-hidden",
          {
            "animate-fadeIn opacity-100": isOpen,
            "animate-fadeOut opacity-0": !isOpen,
          }
        )}
        onAnimationEnd={() => setCloseModalAfterAnim(!isOpen)}
      >
        {isTinted && (
          <div
            className={clsx("absolute inset-0 ", {
              "bg-black opacity-70": darkenBackground,
            })}
            aria-hidden
            onClick={onModalClose}
          />
        )}
        <div
          className={clsx(
            "relative z-50 flex max-h-full w-screen flex-col overflow-auto rounded rounded-b-none rounded-t-3xl bg-white p-4",
            className,
            {
              "animate-modalOpen": isOpen,
              "animate-modalClose opacity-100": !isOpen,
            }
          )}
          onScroll={onScroll}
        >
          {title && (
            <div className="flex items-center">
              <p className="my-3 text-Bold24">{title}</p>
              <Button
                className="absolute right-4 h-7 w-7 p-0"
                aria-hidden
                onClick={onModalClose}
                type="text"
              >
                <CloseIcon size="md" />
              </Button>
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }

  return null;
}

export function Dialog(props: PropertiesDialog) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
    if (!props.lockScroll) {
      if (props.isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }, [props.isOpen, props.lockScroll]);

  if (isBrowser) {
    return ReactDOM.createPortal(
      <DialogElement {...props} />,
      document.getElementById("modal-root") as Element
    );
  } else {
    return null;
  }
}
