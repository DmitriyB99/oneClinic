import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";

import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useTranslations } from "next-intl";

import type {
  AuthDoctorWorkPlaceModel,
  WorkplaceModel,
} from "@/entities/login";
import { AuthDoctorWorkplaceScheduleDialog } from "@/entities/login";
import {
  Checkbox,
  Dialog,
  DividerSaunet,
  InputText,
  Island,
} from "@/shared/components";

export const AuthDoctorWorkPlaceDialog: FC<AuthDoctorWorkPlaceModel> = ({
  openWorkPlaceDialog,
  setOpenWorkPlaceDialog,
  workPlaces,
  setWorkPlaces,
}) => {
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");

  const [search, setSearch] = useState<string>("");
  const [workplaceScheduleDialogOpen, setWorkplaceScheduleDialogOpen] =
    useState<boolean>(false);
  const [activeWorkplace, setActiveWorkplace] = useState<WorkplaceModel>();

  const filteredWorkPlaces = useMemo(
    () =>
      workPlaces?.filter((workPlace) =>
        workPlace.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, workPlaces]
  );

  const handleUpdateClinicSchedule = useCallback(
    (updatedClinic?: WorkplaceModel) => {
      setWorkPlaces((prev) =>
        prev.map((place) => {
          if (place?.clinicId === updatedClinic?.clinicId) {
            return {
              ...place,
              checked: true,
              workPeriods: updatedClinic?.workPeriods ?? [],
            };
          }

          return place;
        })
      );
    },
    [setWorkPlaces]
  );

  const handleUpdateWorkplace = useCallback(
    (event: CheckboxChangeEvent, workPlace: WorkplaceModel) => {
      event.stopPropagation();

      setWorkPlaces((prev) => {
        const existingWorkplace = prev.find(
          (place) => place?.clinicId === workPlace?.clinicId
        );

        if (!existingWorkplace) {
          return [...prev, { ...workPlace, checked: event.target.checked }];
        }

        return prev.map((place) =>
          place?.clinicId === workPlace?.clinicId
            ? { ...place, checked: event.target.checked }
            : place
        );
      });

      if (event.target.checked) {
        setActiveWorkplace(workPlace);
      }
    },
    [setWorkPlaces]
  );

  const showScheduleDialog = useCallback((workPlace: WorkplaceModel) => {
    if (workPlace?.checked) {
      setWorkplaceScheduleDialogOpen(true);
      setActiveWorkplace(workPlace);
    }
  }, []);

  return (
    <>
      <Dialog
        className="h-9/10 !p-0"
        isOpen={openWorkPlaceDialog}
        setIsOpen={setOpenWorkPlaceDialog}
      >
        <div className="bg-gray-2">
          <Island className="my-2">
            <div className="mb-4 text-Bold24">{t("PlaceOfWork")}</div>
            <InputText
              label={tMob("NameOfMedicalInstitution")}
              name="clinicName"
              value={search}
              showAsterisk={false}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </Island>
          <Island>
            {filteredWorkPlaces?.map((workPlace, index) => (
              <div
                key={index}
                onClick={() => showScheduleDialog(workPlace)}
                onKeyDown={() => showScheduleDialog(workPlace)}
              >
                <div className="flex h-16 items-center justify-start">
                  <Checkbox
                    className="mr-3"
                    checked={workPlace.checked}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) =>
                      handleUpdateWorkplace(event, workPlace)
                    }
                  />
                  <div className="text-Regular16">{workPlace.name}</div>
                </div>
                <DividerSaunet className="m-0" />
              </div>
            ))}
          </Island>
        </div>
      </Dialog>
      <AuthDoctorWorkplaceScheduleDialog
        openWorkplaceScheduleDialog={workplaceScheduleDialogOpen}
        setOpenWorkplaceScheduleDialog={setWorkplaceScheduleDialogOpen}
        activeWorkplace={activeWorkplace}
        onWorkPeriodChanged={handleUpdateClinicSchedule}
      />
    </>
  );
};
