import type { FC } from "react";
import { useState } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import type { MedicalTestModel } from "@/entities/medicalTest";
import {
  ArrowLeftIcon,
  Button,
  Dialog,
  InteractiveList,
  Island,
  Navbar,
  SearchIcon,
} from "@/shared/components";

export const MedicalTestModal: FC<{
  medicalTests?: MedicalTestModel[];
  title: string;
}> = ({ medicalTests, title }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <Button
        size="s"
        variant="tinted"
        className="flex items-center rounded-full bg-gray-2 text-Medium12"
        onClick={() => setOpen(true)}
      >
        Еще {medicalTests?.length} услуг
        <ArrowRightOutlined />
      </Button>
      <Dialog isOpen={open} setIsOpen={setOpen} className="!px-0">
        <>
          <Navbar
            title="Анализы"
            description={title}
            leftButtonOnClick={() => setOpen(false)}
            buttonIcon={<ArrowLeftIcon />}
            rightIcon={<SearchIcon />}
          />
          <Island className="mt-2">
            <InteractiveList
              list={
                (medicalTests ?? [])?.map((medicalTest) => ({
                  id: medicalTest?.id,
                  title: medicalTest?.name,
                  description: `${medicalTest?.price} ₸`,
                })) ?? []
              }
              onClick={(id) => {
                router?.push({
                  pathname: "/medicalTest/testAppointment",
                  query: {
                    medicalTestId: id,
                    clinicId: router?.query?.clinicId,
                  },
                });
              }}
            />
          </Island>
        </>
      </Dialog>
    </>
  );
};
