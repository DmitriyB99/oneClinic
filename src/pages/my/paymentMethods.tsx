import { useCallback, useState } from "react";

import { PlusOutlined } from "@ant-design/icons";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { PaymentCardType } from "@/entities/myProfile";
import {
  ArrowLeftIcon,
  Button,
  MastercardIcon,
  Navbar,
  TrashIcon,
  VisaIcon,
  RadioSaunet,
} from "@/shared/components";

function PaymentMethods() {
  const t = useTranslations("Common");
  const router = useRouter();
  const [paymentCards, setPaymentCards] = useState<PaymentCardType[]>([
    {
      id: "1",
      lastDigits: "1234",
      paymentNetwork: "mastercard",
      active: true,
    },
    {
      id: "2",
      lastDigits: "4321",
      paymentNetwork: "visa",
      active: false,
    },
  ]);

  const handlePaymentMethodChange = useCallback((id: string) => {
    setPaymentCards((prevPaymentCards) =>
      prevPaymentCards?.map((paymentCard) => ({
        ...paymentCard,
        active: paymentCard?.id === id,
      }))
    );
  }, []);

  const handlePaymentMethodDelete = useCallback((id: string) => {
    setPaymentCards((prevPaymentCards) =>
      prevPaymentCards?.filter((paymentCard) => paymentCard?.id !== id)
    );
  }, []);

  return (
    <div className="bg-white">
      <Navbar
        title={t("PaymentMethods")}
        leftButtonOnClick={() => router?.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="mb-4 !p-0"
      />
      <div className="px-4">
        {paymentCards?.map((paymentCard) => (
          <div
            key={paymentCard?.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center justify-start">
              <RadioSaunet
                checked={paymentCard?.active}
                className="mr-0"
                onChange={() => {
                  handlePaymentMethodChange(paymentCard?.id);
                }}
              />
              <div className="mr-3 flex items-center justify-center rounded-xl bg-gray-1 p-2">
                {paymentCard?.paymentNetwork === "mastercard" && (
                  <MastercardIcon />
                )}
                {paymentCard?.paymentNetwork === "visa" && <VisaIcon />}
              </div>
              <div>
                {paymentCard?.paymentNetwork === "mastercard" && "MasterCard"}
                {paymentCard?.paymentNetwork === "visa" && "Visa"}
                <span className="mx-1">·</span>
                {paymentCard?.lastDigits}
              </div>
            </div>
            <Button
              variant="tertiary"
              onClick={() => {
                handlePaymentMethodDelete(paymentCard?.id);
              }}
            >
              <TrashIcon color="gray-icon" />
            </Button>
          </div>
        ))}
        <div className="mt-2 flex cursor-pointer items-center justify-start pb-4">
          <div className="ml-9 mr-3 flex items-center justify-center rounded-xl bg-gray-1 p-3">
            <PlusOutlined />
          </div>
          <div>{t("AddCard")}</div>
        </div>
      </div>
    </div>
  );
}
export default PaymentMethods;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
