import type { FC } from "react";
import { Button, Checkbox, CloseIcon, Dialog, Island } from "@/shared/components";

export const ChatDialog: FC<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="!p-0">
      <div className="p-4">
        <Island className="!px-0 !pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-Bold24">Удалить сообщение?</div>
            <div
              className="flex cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start">
            <div className="mt-2 text-Regular16">
              Вы действительно хотите удалить сообщение?
            </div>

            <div className="flex h-16 items-center justify-start">
                    <Checkbox
                      className="mr-3"
                    //   checked={specialty.checked}
                    //   onChange={(event) => {}}
                    />
                    <div className="text-Regular16 pt-1">Удалить у Сейсембай А.В.?</div>
                  </div>
          </div>
          <div className="flex justify-around">
            <Button
              variant="primary"
              size="m"
              transparent
            //   square
              style={{ color: "black" }}
                className="w-full"
              onClick={() => console.log("cancel")}
            >
              Отменить
            </Button>
            <Button
              variant="primary"
              size="m"
            //   square
                className="w-full"
              onClick={() => console.log("delete")}
            >
              {" "}
              Удалить
            </Button>
          </div>
        </Island>
      </div>
    </Dialog>
  );
};
