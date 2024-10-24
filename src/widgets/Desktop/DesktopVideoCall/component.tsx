import type { FC } from "react";
import { useCallback, useContext, useEffect } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { chatApi } from "@/shared/api";
import { Button, MicIcon, VideoCameraIcon } from "@/shared/components";
import { CallContext } from "@/shared/contexts/callContext";
import { UserContext } from "@/shared/contexts/userContext";

export const DesktopVideoCallComponent: FC<{
  callId: string;
}> = ({ callId }) => {
  const {
    isOffer,
    start,
    handleOffer,
    state,
    makeCall,
    toggleCamera,
    isCameraOn,
    isMicOn,
    stream,
    toggleMic,
    isSocketConnected,
    generatedStream,
  } = useContext(CallContext);
  const { user } = useContext(UserContext);

  const router = useRouter();
  const tDesktop = useTranslations("Desktop.Call");

  const { data: member } = useQuery(
    ["getChatInfo", callId],
    () =>
      chatApi.getChatInfo(callId).then((re) => {
        console.log(re);
        return {
          memberId: re.data.members.find((id: string) => id !== user?.user_id),
          memberName: re.data.name,
          chatRoomType: re.data.chatRoomType,
        };
      }),
    { enabled: !!callId }
  );

  useEffect(() => {
    if (
      isSocketConnected &&
      (state === "acceptCall" || state === "initCall") &&
      !generatedStream
    ) {
      start();
    }
  }, [isSocketConnected, start, state, generatedStream]);

  useEffect(() => {
    if (isOffer === false && stream && state === "acceptCall") {
      handleOffer();
    }
    if (isOffer === true && stream && state === "initCall") {
      makeCall(callId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, isOffer, state]);

  const redirectToProfile = useCallback(() => {
    router.push({
      pathname: `/myDoctor/patients/${member?.memberId}`,
    });
  }, [member?.memberId, router]);

  const redirectToConclusion = useCallback(() => {
    router.push({
      pathname: "/newRecord",
      query: { chatRoomId: callId },
    });
  }, [callId, router]);

  return (
    <div className="relative flex h-screen w-full justify-center bg-darkBlue">
      <div className="absolute bottom-16 z-[100] flex flex-col items-center gap-4">
        <div className="flex w-full flex-row items-center justify-center">
          <div className="flex gap-3">
            <Button
              className="flex !h-12 !w-12 items-center justify-center !rounded-xl !bg-borderLight"
              variant="tertiary"
              onClick={toggleMic}
            >
              <MicIcon color={isMicOn ? "white" : "iconDisabled"} />
            </Button>
            <Button
              className="flex !h-12 !w-12 items-center justify-center !rounded-xl !bg-borderLight"
              variant="tertiary"
              onClick={toggleCamera}
            >
              <VideoCameraIcon color={isCameraOn ? "white" : "iconDisabled"} />
            </Button>
            <Button
              className="flex !h-12 items-center justify-center !rounded-xl !border-borderLight !text-white"
              variant="outline"
              onClick={redirectToProfile}
            >
              {tDesktop("PatientMedCard")}
            </Button>
            <Button
              className="flex !h-12 items-center justify-center !rounded-xl !border-borderLight !text-white"
              variant="outline"
              onClick={redirectToConclusion}
            >
              {tDesktop("WriteOutConclusion")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
