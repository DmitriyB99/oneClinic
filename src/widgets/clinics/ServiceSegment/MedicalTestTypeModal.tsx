import type { FC } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import type { MedicalTestModel } from "@/entities/medicalTest";
import { medicalTestCategoryApi } from "@/shared/api/medicalTestCategory";
import {
  ArrowLeftIcon,
  Button,
  Dialog,
  InteractiveList,
  Island,
  Navbar,
  SearchIcon,
} from "@/shared/components";

import { MedicalTestModal } from "./MedicalTestModal";

export const MedicalTestTypeModal: FC<{ medicalTests?: MedicalTestModel[] }> =
  ({ medicalTests }) => {
    const [open, setOpen] = useState(false);
    const { data: medicalCategories } = useQuery(
      ["getAllMedicalTestCategories"],
      () => medicalTestCategoryApi?.getAllMedicalTestCategories()
    );
    const router = useRouter();
    const filledCategories = useMemo(
      () =>
        medicalCategories?.data?.content?.filter((category) =>
          medicalTests?.some(
            (medicalTest) => medicalTest?.categoryId === category?.id
          )
        ),
      [medicalCategories?.data?.content, medicalTests]
    );
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
          <div className="bg-gray-2">
            <Navbar
              title="Анализы"
              leftButtonOnClick={() => setOpen(false)}
              buttonIcon={<ArrowLeftIcon />}
              rightIcon={<SearchIcon />}
            />
            {filledCategories?.map((filledCategory) => {
              const medicalTestsOfCategory = (medicalTests ?? [])?.filter(
                (medicalTest) => medicalTest?.categoryId === filledCategory?.id
              );
              return (
                <Island key={filledCategory?.id} className="mt-2">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="mb-0 text-Bold20">{filledCategory?.name}</p>
                    <MedicalTestModal
                      title={filledCategory?.name}
                      medicalTests={medicalTestsOfCategory}
                    />
                  </div>
                  <InteractiveList
                    list={
                      medicalTestsOfCategory
                        ?.slice(0, 3)
                        ?.map((medicalTest) => ({
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
              );
            })}
          </div>
        </Dialog>
      </>
    );
  };
