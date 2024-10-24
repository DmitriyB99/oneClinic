import { ReactElement, useMemo } from "react";
import { useQuery } from "react-query";

import { PlusOutlined } from "@ant-design/icons";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  Avatar,
  Button,
  InteractiveList,
  Navbar,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import { patientFamilyApi } from "@/shared/api/patient/family";

export default function Family() {
  const t = useTranslations("Common");
  const router = useRouter();

  const { data: myFamilyData } = useQuery(["getMyFamily"], () =>
    patientFamilyApi?.getFamily()
  );

  const [myId] = useMemo(() => {
    const myProfile = myFamilyData?.data?.family_members?.find(
      (familyMember) => familyMember?.is_mine
    );
    return [myProfile?.id, myProfile?.familyId];
  }, [myFamilyData?.data]);

  return (
    <div className="bg-white">
      <Navbar
        title={t("MyFamily")}
        leftButtonOnClick={() => router?.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="mb-4 !p-0"
      />
      <div className="px-4">
        <InteractiveList
          list={
            myFamilyData?.data?.family_members?.map((myFamilyMember) => ({
              startIcon: <Avatar size="m" src={myFamilyMember?.photo_url} />,
              id: myFamilyMember?.id,
              title: `${myFamilyMember?.name} ${myFamilyMember?.surname}`,
              description: myFamilyMember?.is_mine
                ? t("I")
                : myFamilyMember?.family_member_type?.name ?? "",
            })) ?? []
          }
          onClick={(id) => {
            if (myId === id) {
              router.push(`/medicalCard`);
            } else {
              router.push(`/medicalCard/${id}`);
            }
          }}
        />
        <Button
          variant="tertiary"
          className="ml-1"
          onClick={() => {
            router.push(`/my/family/familyMember`);
          }}
        >
          <PlusOutlined /> <span className="ml-5">{t("AddFamilyMember")} </span>
        </Button>
      </div>
    </div>
  );
}

Family.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="bg-white h-full">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
