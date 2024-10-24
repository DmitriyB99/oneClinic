import { useCallback } from "react";

import { notification } from "antd";

import { Button, CloseIcon, Dialog, Island } from "@/shared/components";
export const ConfirmationDialog = ({
  openConfirmDeleteDialog,
  setOpenConfirmDeleteDialog,
  deleteMutation,
  deletionInfo,
  refetch,
  closeMainDialog,
}) => {
  const onDelete = useCallback(
    async (data) => {
      try {
        await deleteMutation(data);
        closeMainDialog();
      } catch (err: unknown) {
        console.log(err);
      }
    },
    [deleteMutation, refetch, closeMainDialog]
  );

  return (
    <Dialog
      isOpen={openConfirmDeleteDialog}
      setIsOpen={setOpenConfirmDeleteDialog}
      className="!p-0"
    >
      <div className="relative bg-gray-1">
        <Island className="mb-2">
          <div className="flex justify-end">
            <Button
              size="s"
              variant="tertiary"
              onClick={() => setOpenConfirmDeleteDialog(false)}
            >
              <CloseIcon />
            </Button>
          </div>

          <div className="px-12 text-center">
            <div className="mb-6 text-Bold24">
              Вы уверены, что хотите удалить запись?
            </div>
          </div>

          <Button
            variant="primary"
            className="mb-4 flex w-full items-center justify-center px-4 text-Medium16"
            onClick={() => {
              onDelete(deletionInfo);
              setOpenConfirmDeleteDialog(false);
              notification?.info({
                message: "Запись удалена",
              });
            }}
          >
            <div>Да, удалить</div>
          </Button>
          <Button
            variant="tertiary"
            className="mr-3 flex w-full items-center justify-center px-4 text-Medium16"
            onClick={() => {
              setOpenConfirmDeleteDialog(false);
            }}
          >
            <div>Отмена</div>
          </Button>
        </Island>
      </div>
    </Dialog>
  );
};
