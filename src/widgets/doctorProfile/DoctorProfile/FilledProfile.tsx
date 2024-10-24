import type { FC } from "react";
import { useMemo } from "react";

import clsx from "clsx";
import { useRouter } from "next/router";

import type { DoctorProfile } from "@/entities/clinics";
import { DoctorShortStats } from "@/entities/doctor";
import {
  SettingOutlinedIcon,
  Avatar,
  Button,
  Carousel,
  PlusBadge,
  ShareIcon,
  Navbar,
} from "@/shared/components";

export const FilledProfile: FC<Partial<DoctorProfile>> = ({
  photoUrl,
  fatherName,
  firstName,
  lastName,
  rating,
  workExperience,
  specialityCodes,
}) => {
  const router = useRouter();

  const carouselItems = useMemo(
    () => [`Стаж ${workExperience ?? 0} лет`, ...(specialityCodes ?? [])],
    [specialityCodes, workExperience]
  );

  return (
    <>
      <div className="mb-4">
        <Navbar
          className="my-6"
          title="Мой профиль"
          rightIcon={<SettingOutlinedIcon />}
          rightIconOnClick={() => router.push("/myDoctor/settings")}
        />
        {/* <img
          src="https://picsum.photos/350/150"
          alt="image"
          height="148"
          className="h-[148px] w-full"
        /> */}
      </div>
      <div className="flex items-center justify-start px-4">
        <Avatar
          size="clinicAva"
          className="border-4 border-brand-primary"
          src={photoUrl}
          bottomRightIcon={<PlusBadge />}
          text={`${lastName?.[0] ?? ""} ${firstName?.[0] ?? ""}`}
        />
        <div className="ml-4 flex flex-col ">
          <div className="text-Bold20">{`${lastName ?? ""} ${firstName ?? ""} ${
            fatherName ?? ""
          }`}</div>
          <div className="mt-2 text-Regular12">
            Люблю помогать людям поддерживать их здоровье в отличном состоянии!
          </div>
        </div>
      </div>
      <DoctorShortStats rating={rating} hideWorkExperience hideReviewCount />
      <div className="mb-5 mt-4 px-4">
        <Carousel
          items={carouselItems?.map((carouselItem, index) => (
            <div
              key={index}
              className={clsx("mx-1 rounded-xl px-2 py-1 text-Regular12", {
                "text-neutralStatus bg-lightNeutral": index === 0,
                "text-darkPurple bg-pink": index !== 0,
              })}
            >
              {carouselItem}
            </div>
          ))}
        />
      </div>
      <div className="mb-4 flex items-center justify-between px-4">
        <Button
          variant="secondary"
          className="w-5/6"
          onClick={() => {
            router.push("/myDoctor/editProfile");
          }}
        >
          Редактировать профиль
        </Button>
        <Button
          icon={<ShareIcon />}
          square
          size="s"
          className="!h-10 !w-10 !bg-gray-2"
          variant="tertiary"
          onClick={() =>
            navigator.share({
              title: "my doctor profile",
              text: "it is my doctor profile",
              url: window.location.href,
            })
          }
        />
      </div>
    </>
  );
};
