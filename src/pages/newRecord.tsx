import type { ReactElement } from "react";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { useQuery } from "react-query";

import { Spin } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { AddNewRecordDialog } from "@/entities/myDoctorPatients";
import { chatApi, doctorsApi } from "@/shared/api";
import { Button, Island } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";
import { useMediaQuery } from "@/shared/utils";

function NewRecordPage() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const isMobile = useMediaQuery();
  const chatRoomId = useMemo(
    () => router.query.chatRoomId,
    [router.query.chatRoomId]
  );

  const { data: userProfile, isLoading: loadChatInfo } = useQuery(
    ["getChatInfo", chatRoomId],
    () =>
      chatApi.getChatInfo(String(chatRoomId)).then((re) => ({
        memberId: re.data.members.find((id: string) => id !== user?.user_id),
        memberName: re.data.name,
        chatRoomType: re.data.chatRoomType,
      })),
    { enabled: !!chatRoomId && !!user }
  );

  const { data: userId, isLoading: loadUserProfile } = useQuery(
    ["getPatientProfile", userProfile],
    () => doctorsApi.getPatientByProfileId(userProfile?.memberId),
    { enabled: !!userProfile?.memberId }
  );

  const { data: lastConsultationId, isLoading: loadConsultation } = useQuery(
    ["getLastConsultationId", userProfile],
    () => chatApi.getLastConsultation(String(chatRoomId)),
    { enabled: !!chatRoomId }
  );

  // useEffect(() => {
  //   if (!chatRoomId) {
  //     router.back();
  //   }
  // }, [chatRoomId, router]);

  const handleClosePage = useCallback(() => {
    if (router.query.final) {
      if (isMobile) {
        router.push(`chat/${chatRoomId}`);
      } else {
        router.push({ pathname: "/desktop/chat", query: { chatRoomId } });
      }
    } else {
      router.back();
    }
  }, [chatRoomId, isMobile, router]);

  // if (loadConsultation || loadUserProfile || loadChatInfo) {
  //   return <Spin />;
  // }

  // if (!lastConsultationId?.data?.id) {
  //   return (
  //     <Island
  //       isCard
  //       className="flex h-full w-full flex-col items-center justify-center gap-2"
  //     >
  //       Запись не найдена
  //       <Button size="m" block onClick={handleClosePage}>
  //         Назад
  //       </Button>
  //     </Island>
  //   );
  // }

  // if (!userId?.data?.id || !userProfile?.memberId) {
  //   return (
  //     <Island
  //       isCard
  //       className="flex h-full w-full flex-col items-center justify-center gap-2"
  //     >
  //       Пациент не найден
  //       <Button size="m" block onClick={handleClosePage}>
  //         Назад
  //       </Button>
  //     </Island>
  //   );
  // }

  return (
    <AddNewRecordDialog
      consultationId={'1'}
      userId={'userProfile.memberId'}
      userProfileId={'userId.data.id'}
      isOpen={true}
      setIsOpen={handleClosePage}
    />
  );
}

NewRecordPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="h-full bg-white">{page}</div>
    </MainLayout>
  );
};
export default NewRecordPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
