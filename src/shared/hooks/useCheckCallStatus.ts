import { useCallback, useEffect } from "react";

export const useCheckCallStatus = (
  continueCall: (chatRoom: string | undefined, sendMsg: boolean) => void,
  continueInitCall: (chatRoom: string) => void,
  inCall: boolean
) => {
  const startCall = useCallback((chatRoomId: string, initiator: boolean) => {
    if (localStorage) {
      localStorage.setItem(
        "callState",
        JSON.stringify({ chatRoomId, initiator })
      );
    }
  }, []);

  const stopCall = useCallback(() => {
    if (localStorage) {
      localStorage.removeItem("callState");
    }
  }, []);

  useEffect(() => {
    if (localStorage && !inCall) {
      if (localStorage.getItem("callState")) {
        const call = JSON.parse(localStorage.getItem("callState") as string);
        if (call.initiator) {
          continueInitCall(call.chatRoomId);
        } else {
          continueCall(localStorage.getItem("callState") as string, false);
        }
      }
    }
  }, [inCall]);

  return [startCall, stopCall];
};
