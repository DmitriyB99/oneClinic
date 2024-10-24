import type { FC } from "react";
import { useState } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";

import type { ListType } from "@/shared/components";
import {
  ArrowLeftIcon,
  Button,
  Dialog,
  Island,
  Navbar,
} from "@/shared/components";
import { InteractiveListWithCart } from "@/shared/components/atoms/InteractiveListWithCart";

export const ModalServicesClinics: FC<{
  handleRedirect: (id: string | number) => void;
  list: ListType[];
}> = ({ list, handleRedirect }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="s"
        variant="tinted"
        className="flex items-center rounded-full bg-gray-2 text-Medium12"
        onClick={() => setOpen(true)}
      >
        Еще {list.length} услуг
        <ArrowRightOutlined />
      </Button>
      <Dialog isOpen={open} setIsOpen={setOpen} className="!px-0">
        <>
          <Navbar
            title="Все услуги"
            leftButtonOnClick={() => setOpen(false)}
            buttonIcon={<ArrowLeftIcon />}
          />
          <Island>
            <InteractiveListWithCart list={list} onClick={handleRedirect} />
          </Island>
        </>
      </Dialog>
    </>
  );
};
