import { type FC } from "react";

import { RightOutlined } from "@ant-design/icons";

import type { MyProfileModel } from "@/entities/myProfile";
import { Avatar, DividerSaunet } from "@/shared/components";

export const AppointmentPatient: FC<{
  handleGoNext?: (id?: string | number) => void;
  myInfo?: Partial<MyProfileModel>;
  relativeInfo?: Partial<MyProfileModel>;
}> = ({ relativeInfo, myInfo, handleGoNext }) => {

  const isMyProfileFilled = !!(relativeInfo?.is_mine && relativeInfo?.name && relativeInfo?.surname);

  const familyMemberDescription = relativeInfo?.is_mine
  ? (isMyProfileFilled ? "Я" : "Заполните данные")
  : (relativeInfo?.family_member_type?.name);

  return (
    <>
      <div
        className="my-2 flex cursor-pointer items-center justify-between py-1"
        onClick={() => {
          handleGoNext?.(relativeInfo?.id);
        }}
      >
        <div className="flex justify-start">
          <Avatar size="m" src={relativeInfo?.photo_url ?? `../userIcon.png`} />
          <div className="ml-3 flex flex-col justify-evenly">
            <div className="text-Regular16">
              {(relativeInfo?.is_mine && !isMyProfileFilled) ? "Я" : relativeInfo?.name}
            </div>
            <div className="text-Regular12">
              {familyMemberDescription}
            </div>
          </div>
        </div>
        <div className="text-Medium14 text-gray-icon">
          <RightOutlined />
        </div>
      </div>
      <DividerSaunet className="m-0" />
    </>
  );
};
