import type { ReactElement } from "react";
import { useContext, useEffect } from "react";

import { Spin } from "antd";
import { useRouter } from "next/router";

import { CallContext } from "@/shared/contexts/callContext";
import { MainLayout } from "@/shared/layout";

export default function CallPageAccept() {
  const { query, push } = useRouter();
  const chatRoomId = query.chatRoomId as string;
  const { acceptCall, isSocketConnected, state } = useContext(CallContext);

  useEffect(() => {
    if (chatRoomId && isSocketConnected && !state) {
      acceptCall(chatRoomId, false);
    } else if (isSocketConnected && !state) {
      push("/main");
    } else if (state === "inCall") {
      push("/main");
    }
  }, [acceptCall, chatRoomId, isSocketConnected, push, state]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spin size="large" />
    </div>
  );
}

CallPageAccept.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="bg-white">{page}</div>
    </MainLayout>
  );
};
