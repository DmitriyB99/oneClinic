import { useCallback, useContext } from "react";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "react-query";

import { Select } from "antd";
import { useTranslations } from "next-intl";

import type { PatientBookingFormProps } from "@/entities/desktopDrawer";
import { doctorsApi } from "@/shared/api";
import { clinicsApi } from "@/shared/api/clinics";
import { DesktopInputText } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

const isDoctorService = (service: string) => {
  const doctorServices = new Set(["ONLINE", "OFFLINE", "AWAY"]);
  return doctorServices.has(service);
};

export const PatientBookingForm: FC<PatientBookingFormProps> = ({
  control,
  searchInfo,
  isClinic,
  clinicServiceDataList,
  doctorServiceDataList,
  doctorData,
  setDoctorData,
  fillingSteps,
}) => {
  const { user } = useContext(UserContext);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Bookings");

  const setDoctorServicePrice = useCallback(
    async (value: string) => {
      if (!isClinic) {
        const { data: doctorProfile } = await doctorsApi.getMyDoctorProfile();
        setDoctorData({
          doctorId: doctorProfile.id,
          clinicId: doctorProfile.clinics?.[0].clinicId,
          price: Number(
            doctorProfile.servicePrices?.find(
              (consultation) => consultation.consultationType === value
            )?.firstPrice
          ),
        });
      }
    },
    [setDoctorData, isClinic]
  );

  const { data: doctorsDataList } = useQuery(
    ["getAllClinicDoctors", fillingSteps],
    () =>
      clinicsApi.getClinicDoctors(user?.role_id).then((res) =>
        res.data.content.map((doctor) => ({
          label: `${doctor.fullName} (${doctor.specialityCodes[0]})`,
          value:
            doctor.doctorId +
            "," +
            doctor.servicePrices.find(
              (consultation) =>
                consultation.consultationType === fillingSteps[0]
            )?.firstPrice,
        }))
      ),
    {
      enabled: isClinic,
    }
  );

  return (
    <>
      <div className="mb-2 mt-6 text-Regular14">{tDesktop("PatientIIN")}</div>
      <Controller
        control={control}
        render={({ field }) => (
          <DesktopInputText
            label="patientIIN"
            desktopDrawer
            inputClassName="pl-3"
            showAsterisk={false}
            placeholder={tDesktop("EnterPatientIIN")}
            value={searchInfo?.iin}
            name="patientIIN"
            onChange={(value) => {
              field.onChange(value);
            }}
          />
        )}
        name="patientIIN"
      />
      <div className="mb-2 mt-6 text-Regular14">{t("PhoneNumber")}</div>
      <Controller
        control={control}
        render={({ field }) => (
          <DesktopInputText
            label="patientPhone"
            isPhone
            desktopDrawer
            placeholder={tDesktop("EnterPatientNumber")}
            value={searchInfo?.phoneNumber}
            name="patientPhone"
            onChange={(value) => {
              field.onChange(value);
            }}
          />
        )}
        name="patientPhone"
      />
      <div className="mb-2 mt-1 text-secondaryText">
        {tDesktop("WillSendConfirmationNotificationToApp")}
      </div>
      <div className="mb-2 mt-6 text-Regular14">{t("PatientFullName")}</div>
      <Controller
        control={control}
        render={({ field }) => (
          <DesktopInputText
            label="patientName"
            desktopDrawer
            placeholder={tDesktop("EnterPatientFullName")}
            showAsterisk={false}
            inputClassName="pl-3"
            value={searchInfo?.fullname}
            name="patientPhone"
            onChange={(value) => field.onChange(value)}
          />
        )}
        name="patientName"
      />
      <div className="mb-2 mt-6 text-Regular14">{t("Service")}</div>
      <Controller
        control={control}
        rules={{ required: tDesktop("ChooseService") }}
        render={({ field }) => (
          <Select
            className="w-full"
            size="large"
            options={isClinic ? clinicServiceDataList : doctorServiceDataList}
            placeholder={tDesktop("ChooseService")}
            onChange={(value) => {
              field.onChange(value);
              setDoctorServicePrice(value);
            }}
          />
        )}
        name="service"
      />
      {isClinic && isDoctorService(fillingSteps[0] ?? "") && (
        <>
          <div className="mb-2 mt-6 text-Regular14">
            {tDesktop("WhichDoctorBook")}
          </div>
          <Controller
            control={control}
            render={({ field }) => (
              <Select
                className="w-full"
                placeholder={tDesktop("ChooseDoctor")}
                size="large"
                options={doctorsDataList}
                onChange={(value) => {
                  field.onChange(value);
                  setDoctorData({
                    doctorId: value.split(",")[0],
                    clinicId: user?.role_id,
                    price: Number(value.split(",")[1]),
                  });
                }}
              />
            )}
            name="doctor"
          />
          {doctorData?.price && (
            <div className="mb-2 mt-1 text-secondaryText">
              {tDesktop("InitialAppointment", { price: doctorData?.price })}
            </div>
          )}
        </>
      )}
    </>
  );
};
