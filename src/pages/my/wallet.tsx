import { useCallback, useState } from "react";
import type { FC } from "react";
import { useQuery } from "react-query";

import { Divider } from "antd";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { KaspiFillDialog } from "@/features/balance";
import type { WalletTransactionInfo } from "@/shared/api/dtos";
import { walletApi } from "@/shared/api/wallet";
import {
  ArrowLeftIcon,
  Button,
  CloseIcon,
  WalletIcon,
  Dialog,
  Island,
  Navbar,
} from "@/shared/components";
import {
  dateTimeWithOffset,
  dateWithYearFormat,
  timeFormat,
} from "@/shared/config";

interface TransactionDialogInfo {
  time: string;
  date: string;
  operationName: string;
  operationAmount: string;
  transactionId: string;
  serviceName: string;
  doctorName: string;
  clinicName: string;
}

const MIDDLE_DOT = "\u00B7";

const WalletPage: FC = () => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Payments");
  const router = useRouter();
  const [isKaspiFillDialogOpen, setIsKaspiFillDialogOpen] =
    useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDialogInfo | null>(null);

  const { data: walletBalance } = useQuery(["getWalletBalance"], () =>
    walletApi.getWalletBalance()
  );

  const { data: walletTransactions } = useQuery(["getWalletTransactions"], () =>
    walletApi
      .getWalletTransactions({
        transactionType: "PAYMENT",
        transactionStatus: "SUCCEED",
        from: dayjs(new Date()).subtract(1, "year").format(dateTimeWithOffset),
        to: new Date().toISOString(),
      })
      .then((res) => res.data.content)
  );

  const handleShowTransactionDetails = useCallback(
    (transaction: Partial<WalletTransactionInfo>) => () => {
      const operationName =
        transaction.transactionType === "PAYMENT"
          ? tMob("WriteOffFromBalance")
          : tMob("TopUpYourBalance");
      const operationAmount =
        transaction.transactionType === "PAYMENT"
          ? `-${transaction.amount} ₸`
          : `+${transaction.amount} ₸`;
      const time = dayjs(transaction.created).format(timeFormat);
      const date = dayjs(transaction.created).format(dateWithYearFormat);

      setSelectedTransaction({
        time,
        date,
        operationName,
        operationAmount,
        transactionId: transaction?.id ?? "",
        serviceName: transaction?.productName ?? "",
        doctorName: transaction?.senderName ?? "",
        clinicName: transaction?.receiverName ?? "",
      });

      setIsDialogOpen(true);
    },
    [tMob]
  );

  const renderTransactions = useCallback(
    () =>
      walletTransactions?.map((transaction, index) => {
        const operationName =
          transaction.transactionType === "PAYMENT"
            ? tMob("WriteOffFromBalance")
            : tMob("TopUpYourBalance");
        const operationAmount =
          transaction.transactionType === "PAYMENT"
            ? `-${transaction.amount} ₸`
            : `+${transaction.amount} ₸`;
        const time = dayjs(transaction.created).format(timeFormat);
        const date = dayjs(transaction.created).format(dateWithYearFormat);

        return (
          <div
            key={transaction.id}
            onKeyDown={handleShowTransactionDetails(transaction)}
            onClick={handleShowTransactionDetails(transaction)}
          >
            <div className="flex items-end justify-between">
              <div>
                <div className="mb-2 text-Regular12 text-gray-secondary">
                  {time} <span className="mx-1 text-Bold12">{MIDDLE_DOT}</span>
                  {date}
                </div>
                <div className="text-Regular16">{operationName}</div>
              </div>
              <div className="text-Regular16 text-red">{operationAmount}</div>
            </div>
            {walletTransactions?.length !== index + 1 && (
              <Divider className="mt-4" />
            )}
          </div>
        );
      }),
    [handleShowTransactionDetails, tMob, walletTransactions]
  );

  return (
    <div className="flex flex-col">
      <Navbar
        title={tMob("MyBalance")}
        leftButtonOnClick={() => router.back()}
        buttonIcon={<ArrowLeftIcon />}
      />
      <div className="mx-4">
        <Island className="mt-4 flex h-fit flex-col">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-3 text-Regular16">{t("Available")}</div>
              <div className="text-Bold32">
                {walletBalance?.data?.balance ?? 0} ₸
              </div>
            </div>

            <Button
              size="s"
              variant="primary"
              onClick={() => setIsKaspiFillDialogOpen(true)}
            >
              {t("TopUp")}
            </Button>
          </div>
        </Island>

        <div className="mt-4 text-Bold20">{t("HistoryOfTransactions")}</div>
        <Island className="mt-4 flex h-fit flex-col">
          {renderTransactions()}
        </Island>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        className="h-1/2 !bg-gray-0 p-4"
      >
        <Button
          size="s"
          className="absolute right-4 top-4 h-10 w-10 rounded-full bg-transparent"
          onClick={() => setIsDialogOpen(false)}
        >
          <CloseIcon />
        </Button>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lightNegative">
            <WalletIcon />
          </div>
          <div>
            <div className="mb-1 text-Regular16">
              {selectedTransaction?.operationName ?? ""}
            </div>
            <div className="text-Regular12 text-gray-secondary">
              {selectedTransaction?.time ?? ""}
              <span className="mx-1 text-Bold12">{MIDDLE_DOT}</span>
              {selectedTransaction?.date ?? ""}
            </div>
          </div>
        </div>

        <div className="mt-6 text-Medium32">
          {selectedTransaction?.operationAmount ?? ""}
        </div>

        <Island className="mt-4 p-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-Regular16 text-gray-secondary">
              {t("Operation")}
            </div>
            <div className="text-Regular16">
              {selectedTransaction?.transactionId ?? ""}
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-Regular16 text-gray-secondary">
              {t("Service")}
            </div>
            <div className="text-Regular16">
              {selectedTransaction?.serviceName ?? ""}
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-Regular16 text-gray-secondary">
              {t("Doctor")}
            </div>
            <div className="text-Regular16">
              {selectedTransaction?.doctorName ?? ""}
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-Regular16 text-gray-secondary">
              {t("Clinic")}
            </div>
            <div className="text-Regular16">
              {selectedTransaction?.clinicName ?? ""}
            </div>
          </div>
        </Island>
      </Dialog>
      <KaspiFillDialog
        isDialogOpen={isKaspiFillDialogOpen}
        setDialogOpen={setIsKaspiFillDialogOpen}
      />
    </div>
  );
};

export default WalletPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
