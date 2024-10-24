import { EllipsisOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useTranslations } from "next-intl";

import {
  Avatar,
  Button,
  Calendar,
  Chips,
  DividerSaunet,
  Island,
} from "@/shared/components";
import { dateFormat } from "@/shared/config";

export default function MyBookingPage() {
  const t = useTranslations("Common");
  return (
    <div>
      <Island className="mb-2">
        <Calendar onChange={() => console.log("")} />
      </Island>
      <Island title={`Сегодня, ${dayjs().format(dateFormat)}`}>
        <Chips
          chipLabels={["Все записи", "Предстоящие", "Уже прошедшие"]}
          type="single"
        />
        <div>
          <p className="mb-2 text-Regular12 text-secondaryText">15:30-15:50</p>
          <p className="mb-2 text-Regular12 text-warningStatus">
            ⏰ Через 10 минут
          </p>
          <div className="my-1 flex py-3">
            <Avatar size="avatar" />
            <div className="ml-3">
              <p className="mb-1 text-Regular16">Акерке Айбарова</p>
              <p className="mb-0 text-Regular12 text-secondaryText">
                🚙 Вызов на дом
              </p>
            </div>
          </div>
          <div className="mt-1 flex">
            <Button className="mr-2 px-[23px] py-2">
              {t("StartСonsultation")}
            </Button>
            <Button
              variant="secondary"
              className="flex items-center px-[23px] py-2"
            >
              <EllipsisOutlined />
            </Button>
          </div>
        </div>
        <DividerSaunet />
        <div>
          <p className="mb-2 text-Regular12 text-secondaryText">15:30-15:50</p>
          <p className="mb-2 text-Regular12 text-warningStatus">
            ⏰ Через 10 минут
          </p>
          <div className="my-1 flex py-3">
            <Avatar size="avatar" />
            <div className="ml-3">
              <p className="mb-1 text-Regular16">Акерке Айбарова</p>
              <p className="mb-0 text-Regular12 text-secondaryText">
                🚙 Вызов на дом
              </p>
            </div>
          </div>
          <div className="mt-1 flex">
            <Button className="mr-2 px-[23px] py-2">
              {t("StartСonsultation")}
            </Button>
            <Button
              variant="secondary"
              className="flex items-center px-[23px] py-2"
            >
              <EllipsisOutlined />
            </Button>
          </div>
        </div>
      </Island>
    </div>
  );
}

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
