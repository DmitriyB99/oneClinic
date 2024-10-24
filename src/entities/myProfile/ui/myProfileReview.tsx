import type { FC } from "react";
import { useState } from "react";

import { EditOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { MyProfileReviewModel } from "@/entities/myProfile";
import { Button, Dialog, DividerSaunet } from "@/shared/components";

import { MyProfileReviewEditDialog } from "./myProfileReviewEditDialog";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface MyProfileReviewProps extends MyProfileReviewModel {
  refetchClinicReviews: () => void;
  refetchDoctorReviews: () => void;
}

export const MyProfileReview: FC<MyProfileReviewProps> = ({
  clinic,
  doctor,
  created,
  id,
  comment,
  refetchClinicReviews,
  refetchDoctorReviews,
}) => {
  const t = useTranslations("Common");
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="mb-1 text-Regular16">
            {clinic?.name ||
              (doctor?.first_name && doctor?.last_name
                ? `${doctor.first_name} ${doctor.last_name}`
                : "")}
          </div>
          <div className="mb-3 text-Regular12 text-secondaryText">
            {format(new Date(created), "dd MMMM yyyy", { locale: ru })}
          </div>
        </div>
        <Button
          variant="tertiary"
          onClick={() => {
            setOpen(true);
          }}
        >
          <EditOutlined />
        </Button>
      </div>
      <div className="text-Regular14">{comment}</div>
      {/* {status && (
        <div
          className={clsx("mt-5 w-fit rounded-xl px-2 py-1 text-Regular12", {
            "bg-lightNeutral text-neutralStatus": status === "pending",
            "text-warningStatus bg-lightWarning": status === "rejected",
          })}
        >
          {status === "pending" && t("UnderСonsideration")}{" "}
          {status === "rejected" && t("RejectedByModerator")}
        </div>
      )} */}
      <DividerSaunet />
      <Dialog isOpen={open} setIsOpen={setOpen}>
        <MyProfileReviewEditDialog
          id={id}
          onClose={() => {
            setOpen(false);
          }}
          comment={comment}
          isClinicReview={!!clinic}
          refetchClinicReviews={refetchClinicReviews}
          refetchDoctorReviews={refetchDoctorReviews}
        />
      </Dialog>
    </div>
  );
};
