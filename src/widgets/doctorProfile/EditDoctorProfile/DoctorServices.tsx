import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { RightOutlined } from "@ant-design/icons";
import { Divider } from "antd";

import type { DoctorProfileServiceType } from "@/entities/myDoctorPatients";
import { DoctorServicePricesDialog } from "@/entities/myDoctorPatients";
import type { EditDoctorProfileForm } from "@/pages/myDoctor/editProfile";
import { Island } from "@/shared/components";
import type { DoctorServicePriceModel } from "@/widgets/auth";

interface DoctorServicesProps {
  setValue: UseFormSetValue<EditDoctorProfileForm>;
  initialServicePrices: DoctorServicePriceModel[];
  initialOnlinePrice?: string[];
  initialClinicPrice?: string[];
  initialHomePrice?: string[];
}

export const DoctorServices: FC<DoctorServicesProps> = ({
  setValue,
  initialServicePrices,
  initialOnlinePrice,
  initialClinicPrice,
  initialHomePrice,
}) => {
  const [isOnlinePriceDialogOpen, setIsOnlinePriceDialogOpen] =
    useState<boolean>(false);
  const [isClinicPriceDialogOpen, setIsClinicPriceDialogOpen] =
    useState<boolean>(false);
  const [isHomePriceDialogOpen, setIsHomePriceDialogOpen] =
    useState<boolean>(false);
  const [onlinePrice, setOnlinePrice] = useState<string[]>(
    initialOnlinePrice ?? ["", ""]
  );
  const [clinicPrice, setClinicPrice] = useState<string[]>(
    initialClinicPrice ?? ["", ""]
  );
  const [homePrice, setHomePrice] = useState<string[]>(
    initialHomePrice ?? ["", ""]
  );

  const onlinePriceText = useMemo(() => {
    if (
      !onlinePrice ||
      onlinePrice.length <= 1 ||
      (onlinePrice[0] === "" && onlinePrice[1] === "")
    ) {
      return "цена не указана";
    }

    return `Первичная консультация ${onlinePrice[0]} ₸, повторная ${onlinePrice[1]} ₸`;
  }, [onlinePrice]);

  const clinicPriceText = useMemo(() => {
    if (
      !clinicPrice ||
      clinicPrice.length <= 1 ||
      (clinicPrice[0] === "" && clinicPrice[1] === "")
    ) {
      return "цена не указана";
    }

    return `Первичная консультация ${clinicPrice[0]} ₸, повторная ${clinicPrice[1]} ₸`;
  }, [clinicPrice]);

  const homePriceText = useMemo(() => {
    if (
      !homePrice ||
      homePrice.length <= 1 ||
      (homePrice[0] === "" && homePrice[1] === "")
    ) {
      return "цена не указана";
    }

    return `Первичная консультация ${homePrice[0]} ₸, повторная ${homePrice[1]} ₸`;
  }, [homePrice]);

  const handleDialogSubmit = useCallback(
    (result: string[], serviceType: DoctorProfileServiceType) => {
      const servicePrices = initialServicePrices;
      const updatedService = servicePrices.find(
        (service) => service.consultationType === serviceType
      );
      if (!updatedService) {
        servicePrices.push({
          consultationType: serviceType,
          firstPrice: result[0],
          secondPrice: result[1],
        });
      } else {
        updatedService.firstPrice = result[0];
        updatedService.secondPrice = result[1];
      }

      setValue("servicePrices", servicePrices);

      if (serviceType === "ONLINE") {
        setOnlinePrice(result);
      }
      if (serviceType === "OFFLINE") {
        setClinicPrice(result);
      }
      if (serviceType === "AWAY") {
        setHomePrice(result);
      }
    },
    [initialServicePrices, setValue]
  );

  return (
    <>
      <Island className="mt-2">
        <div className="mb-7 text-Bold20">Укажите стоимость ваших услуг</div>
        <div
          className="flex items-center justify-between"
          onClick={() => setIsOnlinePriceDialogOpen(true)}
          onKeyDown={() => setIsOnlinePriceDialogOpen(true)}
        >
          <div>
            <div className="mb-1 text-Regular16">Онлайн-консультация</div>
            <div className="text-Regular12 text-blue">{onlinePriceText}</div>
          </div>
          <RightOutlined className="text-gray-secondary" />
        </div>
        <Divider className="my-3" />
        <div
          className="flex items-center justify-between"
          onClick={() => setIsClinicPriceDialogOpen(true)}
          onKeyDown={() => setIsClinicPriceDialogOpen(true)}
        >
          <div>
            <div className="mb-1 text-Regular16">Прием у себя</div>
            <div className="text-Regular12 text-blue">{clinicPriceText}</div>
          </div>
          <RightOutlined className="text-gray-secondary" />
        </div>
        <Divider className="my-3" />
        <div
          className="flex items-center justify-between"
          onClick={() => setIsHomePriceDialogOpen(true)}
          onKeyDown={() => setIsHomePriceDialogOpen(true)}
        >
          <div>
            <div className="mb-1 text-Regular16">Выезд на дом</div>
            <div className="text-Regular12 text-blue">{homePriceText}</div>
          </div>
          <RightOutlined className="text-gray-secondary" />
        </div>
      </Island>

      <DoctorServicePricesDialog
        isOpen={isOnlinePriceDialogOpen}
        setIsOpen={setIsOnlinePriceDialogOpen}
        firstPriceLabel="Первичная консультация, ₸"
        secondPriceLabel="Повторная консультация, ₸"
        inputValue={onlinePrice}
        setInputValue={setOnlinePrice}
        onSubmit={handleDialogSubmit}
        serviceType="ONLINE"
      />
      <DoctorServicePricesDialog
        isOpen={isClinicPriceDialogOpen}
        setIsOpen={setIsClinicPriceDialogOpen}
        firstPriceLabel="Первичный прием, ₸"
        secondPriceLabel="Повторный прием, ₸"
        inputValue={clinicPrice}
        setInputValue={setClinicPrice}
        onSubmit={handleDialogSubmit}
        serviceType="OFFLINE"
      />
      <DoctorServicePricesDialog
        isOpen={isHomePriceDialogOpen}
        setIsOpen={setIsHomePriceDialogOpen}
        firstPriceLabel="Первичный выезд, ₸"
        secondPriceLabel="Повторный выезд, ₸"
        inputValue={homePrice}
        setInputValue={setHomePrice}
        onSubmit={handleDialogSubmit}
        serviceType="AWAY"
      />
    </>
  );
};
