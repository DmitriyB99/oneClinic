import type { FC } from "react";

import { Button, CloseIcon, Dialog } from "@/shared/components";

interface ConfirmationCloseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirmClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const ConfirmationCloseDialog: FC<ConfirmationCloseDialogProps> = ({
  isOpen,
  setIsOpen,
  onConfirmClose,
}) => {
  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="mb-2 flex w-full items-center justify-between">
        <div className="text-Bold24">Вы действительно хотите выйти?</div>
        <Button variant="tertiary" onClick={() => setIsOpen(false)}>
          <CloseIcon />
        </Button>
      </div>

      <div className="mt-3 mb-7 text-Regular16">
        Введенные вами данные не сохранятся
      </div>
      <div className="flex mb-4">
        <Button
          variant="secondary"
          onClick={() => {
            onConfirmClose();
            setIsOpen(false);
          }}
          className="mr-2 flex items-center justify-center w-full"
        >
          Выйти
        </Button>
        <Button
          variant="primary"
          onClick={() => setIsOpen(false)}
          className="ml-2 flex items-center justify-center w-full"
        >
          Отмена
        </Button>
      </div>
    </Dialog>
  );
};
