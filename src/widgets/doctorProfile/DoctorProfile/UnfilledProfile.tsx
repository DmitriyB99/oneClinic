import { useRouter } from "next/router";

import { DoctorShortStats } from "@/entities/doctor";
import {
  Avatar,
  Button,
  CloseIcon,
  Navbar,
  ProgressBar,
  SettingOutlinedIcon,
  ShareIcon,
} from "@/shared/components";

export const UnfilledProfile = () => {
  const router = useRouter();
  return (
    <>
      <Navbar
        className="my-6"
        title="Мой профиль"
        rightIcon={<SettingOutlinedIcon />}
        rightIconOnClick={() => router.push("/myDoctor/settings")}
      />
      <div className="mb-4 flex items-center justify-start px-4">
        <Avatar size="clinicAva" />
        <div className="ml-4 flex flex-col ">
          <div className="text-Bold20">Сманов Асылбек Еркинович</div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between px-4 py-2">
        <Button
          icon={<ShareIcon />}
          square
          // style={{ display: "flex" }}
          className="flex w-auto items-center !bg-gray-1 text-Medium16"
          variant="tertiary"
          onClick={() =>
            navigator.share({
              title: "my doctor profile",
              text: "it is my doctor profile",
              url: window.location.href,
            })
          }
        >
          Поделиться
        </Button>
        <Button
          icon={<ShareIcon />}
          square
          variant="tertiary"
          className="w-auto !bg-gray-1 text-Medium16"
          onClick={() => {
            router.push("/myDoctor/editProfile");
          }}
        >
          Редактировать профиль
        </Button>
      </div>

      <div className="mx-4 h-fit rounded-3xl p-4 shadow-lg">
        <DoctorShortStats />
      </div>

      {/* <div className="mx-4 mb-5 mt-3 flex h-8 w-fit items-center rounded-xl bg-brand-light px-3 py-2 text-Medium14">
        <div className="mr-1">Добавить специальность</div> <PlusOutlined />
      </div> */}

      <div className="mx-4 h-fit rounded-3xl p-4 shadow-lg">
        <div className="flex items-center justify-between text-Bold16">
          <div>Ваш профиль заполнен на 5%</div>
          <Button variant="tertiary" className="h-fit !p-0">
            <CloseIcon />
          </Button>
        </div>
        <ProgressBar percent={5} />
        <div className="text-Regular12 text-secondaryText">
          Полностью заполненный профиль вызывает больше доверия у клиента и
          повышает количество обращений в среднем в 3 раза
        </div>
      </div>
    </>
  );
};
