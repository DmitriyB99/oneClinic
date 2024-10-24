import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";

import { medicalTestBookingApi } from "@/shared/api/medicalTestBooking";
import {
  InteractiveList,
  Button,
  Island,
  PinkPlusIcon,
} from "@/shared/components";

const getServiceWord = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "услуга";
  } else if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  ) {
    return "услуги";
  } else {
    return "услуг";
  }
};

import { ModalServicesClinics } from "./Modal";
import { AppointmentDialog } from "../Final";
import { InteractiveListWithCart } from "@/shared/components/atoms/InteractiveListWithCart";
export const ServiceClinicSegment: FC = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const router = useRouter();

  const { data: medicalTestsData } = useQuery(["getMedicalTests"], () =>
    medicalTestBookingApi
      .getBookingMedicalTestServices(router.query.clinicId as string)
      .then((res) => [res.data.ANALYSIS, res.data.DIAGNOSTIC])
  );

  // const analysisData = useMemo(() => medicalTestsData?.[0], [medicalTestsData]);
  const analysisData = [
    {
      serviceDirectoryId: "1",
      analysisTypeId: 1,
      analysisTypeName: "Анализ крови1",
      price: 1000,
    },
    {
      serviceDirectoryId: "2",
      analysisTypeId: 2,
      analysisTypeName: "Анализ крови2",
      price: 2000,
    },
    {
      serviceDirectoryId: "3",
      analysisTypeId: 3,
      analysisTypeName: "Анализ крови3",
      price: 3000,
    },
  ];

  // const diagnosticData = useMemo(
  //   () => medicalTestsData?.[1],
  //   [medicalTestsData]
  // );

  const diagnosticData = [
    {
      serviceDirectoryId: "4",
      analysisTypeId: 4,
      serviceDirectoryName: "Общий клинический анализ крови1",
      price: 1500,
    },
    {
      serviceDirectoryId: "5",
      analysisTypeId: 5,
      serviceDirectoryName: "Общий клинический анализ крови2",
      price: 2500,
    },
    {
      serviceDirectoryId: "6",
      analysisTypeId: 6,
      serviceDirectoryName: "Общий клинический анализ крови4",
      price: 4500,
    },
  ];

  const handleTestAppointmentRedirect = useCallback(
    (id: number | string) => {
      const [serviceDirectoryId, analysisTypeId, type] = (id as string)
        .trim()
        .split(" ");
      router?.push({
        pathname: "/medicalTest/testAppointment",
        query: {
          medicalTestId: serviceDirectoryId,
          type,
          analysisTypeId,
          clinicId: router?.query?.clinicId,
        },
      });
    },
    [router]
  );

  const analysisDataList = useMemo(
    () =>
      analysisData?.map((analysis) => ({
        // TODO: make interactive list return several values
        // id:
        //   `${analysis?.serviceDirectoryId} ${analysis?.analysisTypeId} ANALYSIS` ??
        //   "",
        id: analysis?.analysisTypeId,
        title: analysis?.analysisTypeName ?? "",
        price: analysis.price,
        description: `${analysis?.price} ₸`,
      })) ?? [],
    [analysisData]
  );

  const diagnosticDataList = useMemo(
    () =>
      diagnosticData?.map((diagnostic) => ({
        // id:
        //   // TODO: make interactive list return several values
        //   `${diagnostic?.serviceDirectoryId} ${diagnostic?.analysisTypeId} DIAGNOSTIC` ??
        //   "",
        id: diagnostic?.analysisTypeId,
        title: diagnostic?.serviceDirectoryName ?? "",
        price: diagnostic.price,
        description: `${diagnostic?.price} ₸`,
      })) ?? [],
    [diagnosticData]
  );

  const toggleServiceSelection = (item) => {
    const isSelected = selectedServices.some(
      (service) => service.id === item.id
    );
    if (isSelected) {
      setSelectedServices((prev) =>
        prev.filter((service) => service.id !== item.id)
      );
    } else {
      setSelectedServices((prev) => [...prev, item]);
    }
  };
  
  const count = selectedServices.length;
  const price = selectedServices.reduce(
    (total, service) => total + service.price,
    0
  );

  return (
    <div>
      <AppointmentDialog
        doctorId={"1"}
        clinicId={"2"}
        isOpen={isOpenDialog}
        setIsOpen={setIsOpenDialog}
      />
      <Island className="mt-2">
        <div className="mb-4 flex items-center justify-between">
          <p className="mb-0 text-Bold20">Анализы</p>
          <ModalServicesClinics
            list={analysisDataList}
            handleRedirect={() => setIsOpenDialog(true)}
          />
        </div>
        <InteractiveListWithCart
          list={analysisDataList}
          maxItems={3}
          onClick={toggleServiceSelection}
        />
      </Island>
      <Island className="mt-2">
        <div className="mb-4 flex items-center justify-between">
          <p className="mb-0 text-Bold20">Функциональная диагностика</p>
          <ModalServicesClinics
            list={diagnosticDataList}
            handleRedirect={handleTestAppointmentRedirect}
          />
        </div>
        <InteractiveListWithCart
          list={diagnosticDataList}
          maxItems={3}
          onClick={toggleServiceSelection}
          // onClick={handleTestAppointmentRedirect}
        />
      </Island>
      <div
        className="fixed bottom-0 flex w-full bg-white p-4"
        style={{ boxShadow: "0px -4px 12px 0px rgba(0, 0, 0, 0.08)" }}
      >
        <Button
          block
          variant="primary"
          className="flex !h-14 items-center justify-center px-4"
          onClick={() => setIsOpenDialog(true)}
        >
          <p className="mb-0 text-Medium16">
            {count} {getServiceWord(count)},
          </p>
          <p className="mb-0 text-Medium16">{price} ₸</p>
        </Button>
      </div>
    </div>
  );
};
