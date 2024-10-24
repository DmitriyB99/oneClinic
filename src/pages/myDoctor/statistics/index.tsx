import type { FC } from "react";
import { useQuery } from "react-query";

import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { doctorsApi } from "@/shared/api";
import {
  ArrowLeftIcon,
  Avatar,
  IconPlaceholder,
  Navbar,
} from "@/shared/components";

const DoctorStatisticsPage: FC = () => {
  const router = useRouter();

  const { data: doctorStatistics } = useQuery(["getDoctorStatistics"], () =>
    doctorsApi.getDoctorStatistics().then((res) => res.data)
  );

  const { data: myProfile } = useQuery(["getMyProfile"], () =>
    doctorsApi.getMyDoctorProfile().then((res) => res.data)
  );

  return (
    <div className="h-full bg-white">
      <Navbar
        title="Мои показатели"
        description="28 сентября - 21 декабря"
        leftButtonOnClick={() => router.back()}
        buttonIcon={<ArrowLeftIcon />}
        rightIcon={
          myProfile?.photoUrl ? (
            <Avatar size="s" src={myProfile.photoUrl} className="ml-3" />
          ) : (
            <IconPlaceholder size="md" color="gray-icon" />
          )
        }
      />
      <div className="mt-2 flex items-center justify-between px-4">
        <div className="mr-1.5 h-[84px] w-full rounded-[20px] px-3.5 pb-2 pt-3.5 shadow-md">
          <div className="mb-2 text-Bold14">Рейтинг</div>
          <div className="flex items-end justify-start">
            <div className="text-Bold32">
              {doctorStatistics?.rating?.toFixed(1) ?? 0}
            </div>
            <div className="mb-1 ml-2 text-red">
              -0.1
              <CaretDownOutlined />
            </div>
          </div>
        </div>
        <div className="ml-1.5 h-[84px] w-full rounded-[20px] px-3.5 pb-2 pt-3.5 shadow-md">
          <div className="mb-2 text-Bold14">Отзывы</div>
          <div className="flex items-end justify-start">
            <div className="text-Bold32">{doctorStatistics?.reviewCount}</div>
            <div className="mb-1 ml-2 text-positiveStatus">
              +25
              <CaretUpOutlined />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 mt-4 rounded-[20px] p-4 shadow-md">
        <div className="text-Regular16">Мои пациенты</div>
        <div className="text-Regular12">{doctorStatistics?.myPatient ?? 0}</div>
      </div>
    </div>
  );
};

export default DoctorStatisticsPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
