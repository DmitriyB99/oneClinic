import { useCallback, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { Divider } from "antd";
import { format } from "date-fns";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/navigation";

import { ChatCreateGroupDialog } from "@/features/chat";
import { chatApi } from "@/shared/api/chat";
import {
  CreateGroupChatIcon,
  GPTIcon,
  MessageCell,
  Navbar,
  UserIcon,
} from "@/shared/components";
import { CallContext } from "@/shared/contexts/callContext";
import { UserContext } from "@/shared/contexts/userContext";

export default function ChatPage() {
  const [isOpenGroup, setIsOpenGroup] = useState(false);

  const router = useRouter();
  const { newMessages } = useContext(CallContext);
  const { user } = useContext(UserContext);
  {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  }
  const { data, refetch } = useQuery(["getChatsUser"], () =>
    chatApi
      .getChats(0, 99)
      .then((res) =>
        res.data.content.filter((item: any) => item.chatRoomType !== "AI_CHAT")
      )
  );

  const fakeMessages = [
    {
      id: 1,
      name: "Сейсембай А.В.",
      latestChatMessage: {
        content: "test msg"
      },
    },
    {
      id: 2,
      name: "Клинка 'Рахат'",
      latestChatMessage: {
        content: "test msg"
      },
    },
  ];

  const { mutate: createAIChat } = useMutation(
    ["createAIChat"],
    () => chatApi.createChatAi(),
    {
      onSuccess: (res) => {
        router.push(`chat/${res.data.id}`);
      },
    }
  );

  const renderDate = useCallback(
    (id: string, created: Date) => {
      if (newMessages[id]) {
        return format(new Date(newMessages[id].date), "hh:mm dd.MM");
      } else if (created) {
        return format(new Date(created), "hh:mm dd.MM");
      }
      return "";
    },
    [newMessages]
  );

  return (
    <>
      <ChatCreateGroupDialog
        isOpen={isOpenGroup}
        toggleDialog={setIsOpenGroup}
        update={refetch}
      />
      <div className="flex flex-1 flex-col bg-white">
        <Navbar
          title="Сообщения"
          rightIcon={<CreateGroupChatIcon />}
          rightIconOnClick={() => setIsOpenGroup(true)}
        />
        <div className="h-full">
          <Divider className="my-0" />
          {/* eslint-disable  @typescript-eslint/no-explicit-any */}
          {user?.role !== "patient" && ( // NEWTODO: изменить !== на ===
            <>
              <MessageCell
                isGPT
                title="OneClinic AI Bot"
                onClick={() => createAIChat()}
                subheading="Качественные бесплатные консультации"
                mainIcon={<GPTIcon size="lg" className="!bg-lightRed" />}
              />
              <Divider className="my-0" />
            </>
          )}
          {fakeMessages?.map((chat: any, key: number) => (
            <>
              <MessageCell
                key={chat.id}
                title={chat.name}
                onClick={() => router.push(`chat/${chat.id}`)}
                subheading={
                  newMessages[chat.id]
                    ? newMessages[chat.id].message
                    : chat.latestChatMessage?.content
                }
                messageTime={renderDate(
                  chat.id,
                  chat.latestChatMessage?.created
                )}
                mainIcon={<UserIcon size="lg" />}
                numberOfMessages={newMessages[chat.id]?.count}
                isOnline={chat.online}
              />
              {key !== data?.length - 1 && <Divider className="my-0" />}
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
