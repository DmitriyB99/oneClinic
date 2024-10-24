import type { ReactElement } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import clsx from "clsx";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { PatientCardDialog } from "@/entities/myDoctorPatients";
import { chatApi } from "@/shared/api";
import {
  ArrowLeftIcon,
  Avatar,
  Button,
  Navbar,
  UserCircleIcon,
  VideoCameraFilledIcon,
  CircularArrowsIcon,
  MicFilledIcon,
  PutPhoneIcon,
} from "@/shared/components";
import { CallContext } from "@/shared/contexts/callContext";
import { UserContext } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";

export default function CallPage() {
  const tMob = useTranslations("Mobile.Call");
  const router = useRouter();
  const {
    isOffer,
    start,
    handleOffer,
    stop,
    minutes,
    seconds,
    state = "inCall",
    makeCall,
    toggleCamera,
    isCameraOn,
    isMicOn,
    changeCamera,
    stream,
    toggleMic,
    isSocketConnected,
    generatedStream,
    chatRoomName,
  } = useContext(CallContext);
  const { user } = useContext(UserContext);

  const chatRoomId = useMemo(
    () =>
      router.query.chatRoomId && !Array.isArray(router.query.chatRoomId)
        ? router.query.chatRoomId
        : "",
    [router.query]
  );

  const { data: member } = useQuery(
    ["getChatInfo", chatRoomId],
    () =>
      chatApi.getChatInfo(chatRoomId).then((re) => ({
        memberId: re.data.members.find((id: string) => id !== user?.user_id),
        memberName: re.data.name,
        chatRoomType: re.data.chatRoomType,
      })),
    { enabled: !!chatRoomId && !!user }
  );

  const redirectToProfile = useCallback(() => {
    if (member?.chatRoomType !== "AI_CHAT" && user?.role === "doctor") {
      router.push({
        pathname: `/myDoctor/patients/${member?.memberId}`,
      });
    }
  }, [member?.chatRoomType, member?.memberId, user?.role, router]);

  const [patientCardDialogOpen, setPatientCardDialogOpen] = useState(false);

  useEffect(() => {
    if (
      isSocketConnected &&
      (state === "acceptCall" || state === "initCall") &&
      !generatedStream
    ) {
      start();
    }
  }, [isSocketConnected, start, state, generatedStream, router]);

  useEffect(() => {
    if (isOffer === false && stream && state === "acceptCall") {
      handleOffer();
    }
    if (isOffer === true && stream && state === "initCall") {
      makeCall(router.query.chatRoomId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, isOffer, state]);

  return (
    <>
      <div className="absolute left-0 top-0 z-0 h-screen w-screen bg-[url('/callBg.png')] bg-cover" />
      <div>
        <div
          onClick={() =>
            user?.role === "doctor" && setPatientCardDialogOpen(true)
          }
        >
          <Navbar
            title={chatRoomName}
            description={state === "inCall" ? `${minutes}:${seconds}` : ""}
            leftButtonOnClick={() =>
              router.push(`/chat/${router.query.chatRoomId}`)
            }
            leftButtonClassName="bg-ToolBar"
            buttonIcon={<ArrowLeftIcon />}
            className="z-[100] !bg-transparent px-4 text-center !text-white"
          />
        </div>
        {state !== "inCall" && (
          <div className="relative mb-2 mt-6 text-center text-Medium32 text-white">
            {state === "inCall"
              ? tMob("CallInProgress")
              : tMob("WaitingForAnswer")}
          </div>
        )}
        {state !== "inCall" && (
          <div className="relative text-center text-Regular16 text-white">
            {minutes}:{seconds}
          </div>
        )}
        {state !== "inCall" && (
          <div className="mt-[62px] flex w-full justify-center">
            <Avatar
              size="xl"
              icon={<UserCircleIcon size="xxl" color="white" />}
            />
          </div>
        )}
        <div className="absolute bottom-[60px] left-0 flex w-full justify-between px-6">
          <Button
            variant="tertiary"
            className="z-[100] flex h-14 w-14 flex-col justify-center rounded-[50%] border-none !p-0"
            onClick={changeCamera}
          >
            <div className="mx-auto flex h-full w-full items-center justify-center rounded-[50%] bg-ToolBar">
              <CircularArrowsIcon color="white" width={32} height={32} />
            </div>
          </Button>
          <Button
            variant="tertiary"
            className="z-[100] flex h-14 w-14 flex-col justify-center rounded-[50%] border-none !p-0"
            onClick={toggleCamera}
          >
            <div
              className={clsx(
                "mx-auto flex h-full w-full items-center justify-center rounded-[50%]",
                {
                  "bg-white": !isCameraOn,
                  "bg-ToolBar": isCameraOn,
                }
              )}
            >
              <VideoCameraFilledIcon
                color={!isCameraOn ? "black" : "white"}
                width={32}
                height={32}
              />
            </div>
          </Button>
          <Button
            variant="tertiary"
            className="z-[100] flex h-14 w-14 flex-col justify-center rounded-[50%] border-none !p-0"
            onClick={toggleMic}
          >
            <div
              className={clsx(
                "mx-auto flex h-full w-full items-center justify-center rounded-[50%]",
                {
                  "bg-white": !isMicOn,
                  "bg-ToolBar": isMicOn,
                }
              )}
            >
              <MicFilledIcon
                color={!isMicOn ? "black" : "white"}
                width={32}
                height={32}
              />
            </div>
          </Button>
          <Button
            variant="tertiary"
            className="z-[100] flex h-14 w-14 flex-col justify-center rounded-[50%] border-none !p-0"
            onClick={stop}
          >
            <div className="mx-auto flex h-full w-full items-center justify-center rounded-[50%] bg-red">
              <PutPhoneIcon color="white" width={32} height={32} />
            </div>
          </Button>
        </div>
      </div>
      <PatientCardDialog
        isOpen={patientCardDialogOpen}
        setIsOpen={setPatientCardDialogOpen}
        onMedicalCardClick={redirectToProfile}
        onWriteOutDirectionClick={() =>
          router.push({
            pathname: `/newRecord`,
            query: { chatRoomId: router.query.chatRoomId },
          })
        }
      />
    </>
  );
}

CallPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="bg-white">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
