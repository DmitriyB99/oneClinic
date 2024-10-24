import type { FC } from "react";
import { useMemo } from "react";
import { useMutation, useQuery } from "react-query";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type { AmbulanceOnRouteProps } from "@/entities/ambulance";
import { chatApi, doctorsApi } from "@/shared/api";
import {
  Avatar,
  Button,
  DataEntry,
  DividerSaunet,
  Facemask,
  Island,
  MedicalAidKitIcon,
  WaitingPinkIcon,
} from "@/shared/components";

export const AmbulanceOnRoute: FC<AmbulanceOnRouteProps> = ({
  userProfileId,
  handleAmbulanceCancellation,
  handleBack,
  address,
  price,
  comment,
  callTime,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.CallAmbulance");
  const router = useRouter();
  // const [hours, minutes] = useMemo(() => callTime?.split(":"), [callTime]);

  const addressInfo = useMemo(() => {
    const city = address?.city ? `${address?.city}. ` : "";
    const street = address?.address ? `${address?.address}. ` : "";
    const entrance = address?.entrance ? `Подъезд ${address?.entrance}. ` : "";
    const floor = address?.floor ? `Этаж ${address?.floor}. ` : "";
    const flat = address?.flat ? `Квартира ${address?.flat}. ` : "";

    return city + street + entrance + floor + flat;
  }, [
    address?.address,
    address?.city,
    address?.entrance,
    address?.flat,
    address?.floor,
  ]);

  const { data: doctorsList } = useQuery(
    ["getDutyDoctorsList"],
    () => doctorsApi.getDutyDoctorsList({}).then((res) => res.data.content),
    {
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: createChatRoom } = useMutation(
    ["createRoomId", doctorsList],
    () => chatApi.createChat({ doctorId: doctorsList?.[0]?.userId ?? "" }),
    {
      retry: false,
      onSuccess: (res) => {
        router.push(`/chat/${res.data?.id}`);
      },
    }
  );

  const { mutate: activateSessionWithDutyDoctor } = useMutation(
    ["activateSessionWithDutyDoctor", doctorsList],
    () =>
      doctorsApi.activateSessionWithDutyDoctor(
        doctorsList?.[0]?.doctorId ?? "",
        userProfileId,
        doctorsList?.[0]?.clinicInfos?.[0]?.clinicId ?? "",
        price.toString() ?? 5000
      ),
    {
      onSuccess: () => {
        createChatRoom();
      },
    }
  );

  return (
    <div className="h-screen bg-gray-0">
      <Island className="mb-2 p-4">
        <div className="flex items-center justify-between">
          <div
            className="flex cursor-pointer rounded-2xl bg-gray-2 px-5 py-2 text-Bold20"
            onClick={handleBack}
          >
            <ArrowLeftOutlined />
          </div>
          <div className="text-Bold16">{tMob("CallingAmbulance")}</div>
          <div className="w-14" />
        </div>
        <div className="mt-4 flex justify-center">
          {/* <IconPlaceholder color="gray-1" width={100} height={100} /> */}
          <Avatar
            className="flex items-center justify-center"
            size="clinicAva"
            style={{ backgroundColor: "#F5F5F5" }}
            src={<WaitingPinkIcon width={24} height={36} />}
          />
        </div>

        <div className="mb-2 mt-6 text-center text-Bold24">
          Скорая уже в пути
        </div>
        {/* <div className="text-center text-Regular16">
          {tMob("DoctorsWillComeTo")}{" "}
          <span className="text-Bold16">
            {parseInt(hours) + 1}:{minutes}
          </span>
        </div> */}
      </Island>
      <Island className="mb-2">
        <p className="text-Bold20">{t("Recommend")}</p>
        <div className="my-3 flex items-center justify-start">
          <div className="mr-3 rounded-2xl bg-lightPink p-2.5">
            {<Facemask color="brand-primary" size="md" />}
          </div>
          <div className="flex flex-col">
            <p className="mb-1 text-Regular16 text-dark">
              {t("ContactWithDoctorOnDuty")}
            </p>
            <div className="text-Regular12 text-secondaryText">
              Ответит на все ваши вопросы и объяснит, что делать в экстренной
              ситуации. Стоимость консультации уже включена в сумму
            </div>
          </div>
        </div>
        <DividerSaunet className="m-0" />
        <div className="mt-3 flex items-center justify-start">
          <div className="mr-3 rounded-2xl bg-lightPink p-2.5">
            <MedicalAidKitIcon size="md" color="brand-primary" />
          </div>
          <div className="flex flex-col">
            <p className="mb-1 text-Regular16 text-dark">
              Не торопитесь отменять вызов
            </p>
            <div className="text-Regular12 text-secondaryText">
              Некоторые приступы или ухудшения состояния могут возникать
              переодически
            </div>
          </div>
        </div>
      </Island>
      <Island>
        <p className="mb-4 text-Bold20">{t("AboutСall")}</p>
        <DataEntry bottomText={addressInfo} topText={t("Address")} isDivided />
        <DataEntry bottomText={callTime} topText={t("CallTime")} isDivided />
        <DataEntry
          bottomText={comment || t("NoComment")}
          topText={t("Comment")}
          isDivided
        />
        {/* <DataEntry
          bottomText={price.toString() || "5000"}
          topText={t("AmountRequiredForPayment")}
          isDivided
        /> */}
        <Button
          disabled={doctorsList ? doctorsList.length === 0 : true}
          className="mb-4 mt-2 w-full"
          onClick={() => {
            activateSessionWithDutyDoctor();
          }}
        >
          Позвонить дежурному врачу
        </Button>
        <Button
          className="mb-4 w-full"
          variant="secondary"
          rootClassName="text-red"
          onClick={() => router.push(`/oneQr/onboarding`)}
        >
          Врач на месте. Отсканировать QR
        </Button>
        <Button
          className="mb-4 w-full"
          variant="secondary"
          rootClassName="text-red"
          onClick={handleAmbulanceCancellation}
        >
          {tMob("CancelCall")}
        </Button>
      </Island>
    </div>
  );
};
