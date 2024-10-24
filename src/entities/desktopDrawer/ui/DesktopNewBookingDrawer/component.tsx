import { useCallback, useContext, useMemo, useState } from "react";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Spin, notification } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { CreateConsultationSlotModel } from "@/entities/appointments";
import type {
  NewDesktopBookingModel,
  DesktopBookingsNewDrawerProps,
  DoctorDataModel,
} from "@/entities/desktopDrawer";
import type { MyShortInfoModel } from "@/entities/myProfile";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { bookingInfoApi } from "@/shared/api/bookingInfo";
import { Button, Drawer, SearchMinusIcon } from "@/shared/components";
import { timeFormat } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { changeTimeFormat } from "@/shared/utils";

import { NewBookingDataSearch } from "./NewBookingDataSearch";
import { NewBookingTime } from "./NewBookingTime";
import { PatientBookingForm } from "./PatientBookingForm";

export const DesktopNewBookingDrawer: FC<DesktopBookingsNewDrawerProps> = ({
  onClose,
  open,
  time,
}) => {
  const { control, handleSubmit, watch, reset } =
    useForm<NewDesktopBookingModel>();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Bookings");
  const [api, contextHolder] = notification.useNotification();
  const [userDataForm, setUserDataForm] = useState<MyShortInfoModel>();
  const [doctorData, setDoctorData] = useState<DoctorDataModel>();
  const [submit, setSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSubmit, setSearchSubmit] = useState(false);
  const { user } = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const queryClient = useQueryClient();
  const fillingSteps: (string | undefined)[] = watch(["service", "doctor"]);
  const isClinic = useMemo(() => user?.role === "clinic", [user]);

  const doctorServiceDataList = useMemo(
    () => [
      {
        value: "ONLINE",
        label: t("OnlineConsultation"),
      },
      {
        value: "OFFLINE",
        label: t("ClinicAdmission"),
      },
      {
        value: "AWAY",
        label: tDesktop("DoctorCallAtHome"),
      },
    ],
    [t, tDesktop]
  );

  const { data: bookingSlots } = useQuery(
    ["getBookingSlots", selectedDate, doctorData],
    () =>
      bookingInfoApi.getDoctorAvailableSlots(
        doctorData?.doctorId ?? "",
        selectedDate
      ),
    {
      enabled: !!doctorData,
    }
  );

  const { mutate: createConsultationSlot } = useMutation(
    ["createConsultationSlot"],
    (data: CreateConsultationSlotModel) =>
      appointmentBookingApi?.createConsultationSlot(data),
    {
      onSuccess: () => queryClient.invalidateQueries(["getAllConsultations"]),
    }
  );

  const openNotification = useCallback(() => {
    api["success"]({
      message: tDesktop("PatientAdded"),
      placement: "bottomRight",
    });
  }, [api, tDesktop]);

  const onSubmit = useCallback(
    async (data: NewDesktopBookingModel) => {
      const [fromTime, toTime] = changeTimeFormat(data.date, data.time);
      await createConsultationSlot({
        consultationType: data.service,
        consultationData: {
          isInDirection: false,
          price: doctorData?.price as number,
        },
        userProfileId: userDataForm?.userProfileId ?? "",
        clinicId: doctorData?.clinicId,
        doctorProfileId: doctorData?.doctorId ?? "",
        toTime: toTime,
        fromTime: fromTime,
        consultationStatus: "CREATED",
      });
    },
    [doctorData, userDataForm, createConsultationSlot]
  );

  const handleOnSubmit = useCallback(() => {
    handleSubmit(onSubmit)().then(() => {
      setSubmit(false);
      setUserDataForm(undefined);
      setDoctorData(undefined);
      reset();
      onClose();
      openNotification();
    });
  }, [handleSubmit, onSubmit, openNotification, onClose, reset]);

  return (
    <Drawer onClose={onClose} open={open} title={t("NewBooking")}>
      {contextHolder}
      <div className="flex h-full flex-col justify-between">
        <div>
          <h3 className="mb-6 text-Bold20 text-dark">
            {tDesktop("ToMakeAppointmentSpecifyPatient")}
          </h3>
          {!submit && (
            <NewBookingDataSearch
              setSearchSubmit={setSearchSubmit}
              setSubmit={setSubmit}
              setUserDataForm={setUserDataForm}
              setIsLoading={setIsLoading}
            />
          )}
          {isLoading && <Spin className="ml-1 mt-6" />}
          {/* TODO: finish when Daulet will make the design */}
          {/* {!searchSubmit && !submit && (
            <>
              <DividerSaunet className="my-6" />
              <div>
                Пациент впервые в клинике?
                <AntButton
                  type="link"
                  className="ml-1 h-fit p-0"
                  onClick={() => setSubmit(true)}
                >
                  Создать анкету
                </AntButton>
              </div>
            </>
          )} */}
          {searchSubmit && !submit && (
            <div className="mt-16 text-center">
              <SearchMinusIcon size="xl" />
              <div className="mt-3 text-Bold16">
                {tDesktop("PatientNotYetInOneclinic")}
              </div>
            </div>
          )}
          {submit && (
            <PatientBookingForm
              isClinic={isClinic}
              control={control}
              clinicServiceDataList={doctorServiceDataList}
              doctorServiceDataList={doctorServiceDataList}
              searchInfo={userDataForm}
              setDoctorData={setDoctorData}
              doctorData={doctorData}
              fillingSteps={fillingSteps}
            />
          )}
          {doctorData && (
            <NewBookingTime
              onCalendarChange={(date) => {
                setSelectedDate(date);
              }}
              time={time}
              control={control}
              appointmentChips={(bookingSlots?.data ?? [])?.map(
                (bookingSlot) => ({
                  isBooked: !!bookingSlot?.id,
                  toTime: dayjs(bookingSlot?.toTime)?.format(timeFormat),
                  fromTime: dayjs(bookingSlot?.fromTime)?.format(timeFormat),
                })
              )}
              doctorProfileId={doctorData?.doctorId ?? ""}
            />
          )}
        </div>
        <div className="mt-14 flex w-full justify-end gap-4 py-4">
          <Button
            className="!h-10 rounded-lg !border px-4"
            variant="outline"
            onClick={() => {
              setSubmit(false);
              setUserDataForm(undefined);
              setDoctorData(undefined);
              setSearchSubmit(false);
              reset();
              onClose();
            }}
          >
            {t("Abolish")}
          </Button>
          <Button className="!h-10 rounded-lg px-4" onClick={handleOnSubmit}>
            {tDesktop("RecordPatient")}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
