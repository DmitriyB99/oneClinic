import type { FC } from "react";
import { Fragment } from "react";
import { useQuery } from "react-query";

import { Divider } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { superAdminApis } from "@/shared/api";
import { Button, EditIcon } from "@/shared/components";
import { dateFormat } from "@/shared/config";

export const MedCard: FC = () => {
  const { query } = useRouter();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");

  const { data: userMedCard, isSuccess } = useQuery(
    ["userMedCard", query.profileId],
    () =>
      superAdminApis
        .getPatientMedCard(String(query.profileId))
        .then((res) => res.data)
  );

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row items-center justify-between">
        <p className="m-0 mb-2 p-0 text-Bold20">{t("Allergy")}</p>
        <EditIcon width={18} height={18} />
      </div>
      {isSuccess &&
        (Object.keys(userMedCard.allergies).length > 0 ? (
          Object.keys(userMedCard.allergies).map((key: string) => (
            <Fragment key={key}>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <p className="m-0 text-Regular12 text-gray-secondary">
                    {userMedCard.allergies[key]}
                  </p>
                  <p className="m-0 mt-1 text-Regular16">{key}</p>
                </div>
              </div>
              <Divider className="mt-3" />
            </Fragment>
          ))
        ) : (
          <>
            <p>{tDesktop("AllergyAbsent")}</p>
            <Divider className="mt-1" />
          </>
        ))}
      <div className="flex flex-row items-center justify-between">
        <p className="m-0 mb-2 p-0 text-Bold20">{t("DrugIntolerance")}</p>
        <EditIcon width={18} height={18} />
      </div>
      {isSuccess &&
        (userMedCard.drugsIntolerance?.length > 0 ? (
          userMedCard.drugsIntolerance?.map(
            (text: string, index: number, arr: string[]) => (
              <Fragment key={text}>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <p className="m-0 mt-1 text-Regular16">{text}</p>
                  </div>
                </div>
                {arr.length - 1 === index && <Divider className="mt-3" />}
              </Fragment>
            )
          )
        ) : (
          <>
            <p>{tDesktop("NoIntolerance")}</p>
            <Divider className="mt-1" />
          </>
        ))}
      <div className="flex flex-row items-center justify-between">
        <p className="m-0 mb-2 p-0 text-Bold20">{t("Vaccines")}</p>
        <EditIcon width={18} height={18} />
      </div>
      {isSuccess &&
        (Object.keys(userMedCard.vaccinesToDate).length > 0 ? (
          Object.keys(userMedCard.vaccinesToDate).map((key: string) => (
            <Fragment key={key}>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <p className="m-0 text-Regular12 text-gray-secondary">
                    {dayjs(userMedCard.vaccinesToDate[key]).format(dateFormat)}
                  </p>
                  <p className="m-0 mt-1 text-Regular16">{key}</p>
                </div>
              </div>
              <Divider className="mt-3" />
            </Fragment>
          ))
        ) : (
          <>
            <p>{tDesktop("NoVaccines")}</p>
            <Divider className="mt-1" />
          </>
        ))}
      <div className="flex flex-row items-center justify-between">
        <p className="m-0 mb-2 p-0 text-Bold20">{t("Infections")}</p>
        <EditIcon width={18} height={18} />
      </div>
      {isSuccess &&
        (Object.keys(userMedCard.infectionsToDate).length > 0 ? (
          Object.keys(userMedCard.infectionsToDate).map((key: string) => (
            <Fragment key={key}>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <p className="m-0 text-Regular12 text-gray-secondary">
                    {dayjs(userMedCard.infectionsToDate[key]).format(
                      dateFormat
                    )}
                  </p>
                  <p className="m-0 mt-1 text-Regular16">{key}</p>
                </div>
              </div>
              <Divider className="mt-3" />
            </Fragment>
          ))
        ) : (
          <>
            <p>{tDesktop("NoInfections")}</p>
            <Divider className="mt-1" />
          </>
        ))}
      <Button className="!h-10">{t("AddBooking")}</Button>
    </div>
  );
};
