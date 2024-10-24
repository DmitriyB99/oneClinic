import type { FC } from "react";
import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  ArrowLeftOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type {
  CreditCardForm,
  PaymentsCreditCardAddition,
} from "@/entities/payments";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "@/entities/payments";
import { Button, InputText, Island } from "@/shared/components";

export const PaymentCreditCardAdditionDialog: FC<PaymentsCreditCardAddition> =
  ({ handleBack, onSubmit, handleClose, isLoading = false }) => {
    const tMob = useTranslations("Mobile.Payments");
    const { control, handleSubmit } = useForm<CreditCardForm>();
    const handleOnSubmit = useCallback(() => {
      handleSubmit(onSubmit)();
    }, [handleSubmit, onSubmit]);
    return (
      <Island className="!p-4">
        <div className="flex items-center justify-between">
          <div
            className="flex cursor-pointer rounded-2xl bg-gray-2 px-5 py-2 text-Bold20"
            onClick={handleBack}
          >
            <ArrowLeftOutlined />
          </div>
          <div className="mr-8 text-Bold16">{tMob("AddingCard")}</div>
          <CloseOutlined
            className="mr-2 cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <Controller
          control={control}
          rules={{
            required: tMob("EnterCardNumber"),
          }}
          render={({ field }) => (
            <InputText // TODO Create component with format
              label={tMob("CardNumber")}
              name="cardNumber"
              wrapperClassName="mb-3 mt-5"
              value={field?.value}
              showAsterisk={false}
              onChange={(event) => {
                const formattedValue = formatCreditCardNumber(
                  (event?.target as HTMLInputElement).value
                );
                field.onChange(formattedValue.slice(0, 19));
              }}
            />
          )}
          name="cardNumber"
        />
        <div className="mb-8 flex items-center justify-between">
          <Controller
            control={control}
            rules={{
              required: tMob("EnterExpirationDate"),
            }}
            render={({ field }) => (
              <InputText
                label={tMob("Validity")}
                name="cardNumber"
                wrapperClassName="mr-1.5"
                value={field?.value}
                showAsterisk={false}
                onChange={(event) => {
                  const formattedValue = formatExpirationDate(
                    (event?.target as HTMLInputElement).value
                  );
                  field.onChange(formattedValue.slice(0, 19));
                }}
              />
            )}
            name="expirationDate"
          />
          <Controller
            control={control}
            rules={{
              required: tMob("EnterCVC"),
            }}
            render={({ field }) => (
              <InputText
                label="CVC"
                name="CVC"
                type="password"
                wrapperClassName="ml-1.5"
                value={field?.value}
                showAsterisk={false}
                onChange={(event) => {
                  const value = (event?.target as HTMLInputElement).value;
                  field.onChange(formatCVC(value));
                }}
              />
            )}
            name="cvc"
          />
        </div>
        <Button variant="primary" className="w-full" onClick={handleOnSubmit}>
          {isLoading ? <LoadingOutlined /> : <>{tMob("LinkCard")}</>}
        </Button>
      </Island>
    );
  };
