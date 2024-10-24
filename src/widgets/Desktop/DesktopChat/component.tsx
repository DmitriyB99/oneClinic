import type { FC } from "react";
import { useContext, useCallback, useMemo } from "react";
import { useQuery } from "react-query";

import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { DesktopChatForm } from "@/entities/desktopChat";
import { chatApi } from "@/shared/api/chat";
import {
  DesktopInputSearch,
  DesktopMessageCell,
  UserIcon,
} from "@/shared/components";
import { dateTimeFormat } from "@/shared/config";
import { CallContext } from "@/shared/contexts/callContext";

export const DesktopPageComponent: FC = () => {
  const { newMessages } = useContext(CallContext);
  const router = useRouter();
  const tDesktop = useTranslations("Desktop.Chat");

  const { data } = useQuery(["getChatsUser"], () =>
    chatApi.getChats(0, 99).then((res) => res.data.content)
  );

  const chatRoomId = useMemo(
    () => (router.query.chatRoomId as string) ?? null,
    [router.query]
  );

  const handleSelectRoom = useCallback(
    (value: string) => {
      router.push({ pathname: "/desktop/chat", query: { chatRoomId: value } });
    },
    [router]
  );

  const renderDate = useCallback(
    (id: string, created: Date) => {
      if (newMessages[id]) {
        return dayjs(new Date(newMessages[id].date)).format(dateTimeFormat);
      } else if (created) {
        return dayjs(new Date(created)).format(dateTimeFormat);
      }
      return "";
    },
    [newMessages]
  );

  return (
    <div className="flex h-full w-full flex-row px-7 py-4">
      <div className="h-full w-[336px] overflow-auto pl-3 pr-7">
        <DesktopInputSearch
          placeholder={tDesktop("SearchByUsersMessagesPoint")}
          className="h-12 w-full !rounded-3xl border border-primary-2"
        />
        <div className="mt-6 flex w-full flex-col gap-4">
          {/* eslint-disable  @typescript-eslint/no-explicit-any */}
          {data?.map((chat: any) => (
            <DesktopMessageCell
              key={chat.id}
              name={chat.name}
              mainIcon={<UserIcon size="xl" />}
              isOnline={chat.online}
              messageTime={renderDate(chat.id, chat.latestChatMessage?.created)}
              numberOfMessages={newMessages[chat.id]?.count}
              subheading={
                newMessages[chat.id]
                  ? newMessages[chat.id].message
                  : chat.latestChatMessage?.content
              }
              onClick={() => handleSelectRoom(chat.id)}
            />
          ))}
        </div>
      </div>
      {chatRoomId && <DesktopChatForm key={chatRoomId} chatId={chatRoomId} />}
    </div>
  );
};
