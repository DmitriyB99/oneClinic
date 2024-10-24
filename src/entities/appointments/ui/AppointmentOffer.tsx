import { LoadingOutlined } from "@ant-design/icons";

import { Button, CloseIcon, Dialog, Island } from "@/shared/components";
import Link from "next/link";
import { OfferModel } from "../models/OfferModel";
import { FC } from "react";

export const AppointmentOffer: FC<OfferModel> = ({
  isOpen,
  setIsOpen,
  handleGoToNextPage,
  isLoading,
}) => {
  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <Island className="!px-0 !pt-4">
        <div className="flex items-center justify-between">
          <div className="text-Bold24">Примите оферту</div>
          <div
            className="flex cursor-pointer px-5 py-2 text-Bold20"
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon />
          </div>
        </div>
        <div className="py-3 text-Regular16">
          Онлайн-консультация не заменяет полноценный прием в клинике. Для
          точного результата рекомендуем записаться на очный прием к врачу.
        </div>

        <div className="mt-3 flex items-center justify-start">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleGoToNextPage}
          >
            {isLoading ? (
              <div className="flex w-full justify-center">
                <LoadingOutlined className="text-Bold24" />
              </div>
            ) : (
              <div className="text-Medium16">Согласен, продолжить</div>
            )}
          </Button>
        </div>
        <div className="mt-3 text-Regular14 ">
          Нажимая “Продолжить” вы соглашаетесь с условиями{" "}
          <div className="text-colorPrimaryBase">
            <Link
              href="https://www.google.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              оферты
            </Link>
          </div>
        </div>
      </Island>
    </Dialog>
  );
};
