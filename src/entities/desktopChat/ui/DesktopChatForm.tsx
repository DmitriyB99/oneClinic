import type { FC, FormEvent } from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useQuery } from "react-query";
import VisibilitySensor from "react-visibility-sensor";
import "react-photo-view/dist/react-photo-view.css";

import { DownloadOutlined } from "@ant-design/icons";
import { Spin, Upload } from "antd";
import clsx from "clsx";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { doctorsApi } from "@/shared/api";
import { chatApi } from "@/shared/api/chat";
import {
  DesktopCallingIcon,
  DesktopVideoIcon,
  DesktopPlusIcon,
  DesktopInputText,
  Button,
  Avatar,
  UserIcon,
} from "@/shared/components";
import { CallContext } from "@/shared/contexts/callContext";
import { UserContext } from "@/shared/contexts/userContext";

interface Messages {
  content?: string;
  created: Date;
  fileUrl?: string;
  message: string;
  senderId: string;
}

const images = ["jpg", "png", "gif", "jpeg"];

export const DesktopChatForm: FC<{ chatId: string }> = ({
  chatId: chatRoomId,
}) => {
  const [totalPages, setTotalPages] = useState(0);
  const [messageHistory, setMessageHistory] = useState<Messages[]>([]);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [loadFile, setLoadFile] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState<Messages[]>([]);
  const t = useTranslations("Common");

  const { user } = useContext(UserContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const {
    lastJsonMessage,
    sendJsonMessage,
    readMessages,
    newMessages: newMessagesContext,
    state,
  } = useContext(CallContext);

  const { data: member, isLoading: loadChatInfo } = useQuery(
    ["getChatInfo", chatRoomId],
    () =>
      chatApi.getChatInfo(chatRoomId).then((re) => ({
        memberId: re.data.members.find((id: string) => id !== user?.user_id),
        memberName: re.data.name,
        chatRoomType: re.data.chatRoomType,
      })),
    { enabled: !!chatRoomId && !!user }
  );
  const { data: doctorInfo, isLoading: loadDoctorProfile } = useQuery(
    ["getChatDoctorProfile", member],
    () => doctorsApi.getDoctorById(member?.memberId),
    { enabled: !!member?.memberId }
  );
  const getMessageHistory = useCallback(() => {
    if (chatRoomId) {
      setLoadingMsg(true);
      chatApi
        .getMessageHistory(chatRoomId, page, size)
        .then((re) => {
          setTotalPages(Math.round(re.data.totalElements / size));
          setMessageHistory((prev) => prev.concat(re.data.content));
        })
        .finally(() => setLoadingMsg(false));
    }
  }, [chatRoomId, page, size]);

  useEffect(() => {
    getMessageHistory();
  }, [getMessageHistory]);

  useEffect(() => {
    if (newMessagesContext[chatRoomId]) {
      return readMessages(chatRoomId);
    }
  }, [chatRoomId, newMessagesContext, readMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [newMessages]);

  const haveLastMessage = useMemo(
    () =>
      messageHistory[0] &&
      lastJsonMessage?.content !== messageHistory?.[0]?.content,
    [lastJsonMessage?.content, messageHistory]
  );

  useEffect(() => {
    if (
      lastJsonMessage !== null &&
      lastJsonMessage.command === "MESSAGE" &&
      lastJsonMessage.chatRoomId === chatRoomId &&
      haveLastMessage
    ) {
      setNewMessages((prev) =>
        [
          {
            message: lastJsonMessage.content,
            senderId: lastJsonMessage.senderId,
            fileUrl: lastJsonMessage.fileUrl,
            created: new Date(),
          } as Messages,
        ].concat(prev)
      );
    }
  }, [chatRoomId, haveLastMessage, lastJsonMessage, setNewMessages]);

  const loadMore = (isVisible: boolean) => {
    if (isVisible && totalPages > page + 1) {
      setPage((prev) => prev + 1);
    }
  };

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const updloadFile = (data: any) => {
    chatApi
      .uploadFile(data?.data)
      .then((response) => {
        setNewMessages((prev) =>
          [
            {
              created: new Date(),
              fileUrl: response.data.fileUrl,
              message: response.data.result,
              senderId: response.data.senderId,
            },
          ].concat(prev as [])
        );
      })
      .finally(() => {
        setLoadFile(false);
        sendJsonMessage({
          command: "SENDING_FILE",
          content: false,
          chatRoomId,
        });
      });
  };

  const onTyping = useCallback(() => {
    sendJsonMessage({
      command: "TYPING",
      content: true,
      chatRoomId,
    });
  }, [chatRoomId, sendJsonMessage]);

  const onTypingStop = useCallback(() => {
    sendJsonMessage({
      command: "TYPING",
      content: false,
      chatRoomId,
    });
  }, [chatRoomId, sendJsonMessage]);

  const startCall = useCallback(() => {
    window.open(`/desktop/configCall/${chatRoomId}?isOffer=true`, "_ blank");
  }, [chatRoomId]);

  const redirectToProfile = useCallback(() => {
    router.push(`/myDoctor/patients/${member?.memberId}`);
  }, [member?.memberId, router]);

  const renderMessage = useCallback(
    (message: Messages) => {
      if (message.fileUrl) {
        const extension = message.fileUrl.split(".").pop();
        if (images.includes(extension?.toLowerCase() ?? "")) {
          return (
            <PhotoProvider>
              <PhotoView src={message.fileUrl}>
                <img
                  src={message.fileUrl}
                  alt={message.message ?? message.content}
                  className="h-20 w-20"
                />
              </PhotoView>
            </PhotoProvider>
          );
        }
        return (
          <p className="mb-2 flex gap-2 break-all text-Regular16">
            <Button
              iconButton
              icon={<DownloadOutlined />}
              size="s"
              variant="tertiary"
              onClick={() => router.push(message.fileUrl ?? "")}
            />
            {message.message ?? message.content}
          </p>
        );
      }
      if (message.message ?? message.content) {
        return (
          <p className="mb-2 text-Regular16">
            {message.message ?? message.content}
          </p>
        );
      }
    },
    [router]
  );

  const sendMessgae = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setNewMessages((prev) =>
        [
          {
            message: message,
            senderId: user?.user_id || "",
            created: new Date(),
          },
        ].concat(prev)
      );
      sendJsonMessage({
        command: "MESSAGE",
        content: message,
        chatRoomId,
      });
      setMessage("");
    },
    [chatRoomId, message, sendJsonMessage, user?.user_id]
  );

  const onSendingFile = useCallback(() => {
    setLoadFile(true);
    sendJsonMessage({
      command: "SENDING_FILE",
      content: true,
      chatRoomId,
    });
  }, [chatRoomId, sendJsonMessage]);

  const renderDescription = useMemo(() => {
    if (
      lastJsonMessage?.command === "TYPING" &&
      lastJsonMessage?.content === "true"
    ) {
      return t("TypingWithDots");
    }
    if (
      lastJsonMessage?.command === "SENDING_FILE" &&
      lastJsonMessage?.content === "true"
    ) {
      return t("SendsFileWithDots");
    }
    if (member?.chatRoomType === "AI_CHAT") {
      return t("OnlineConsultant");
    } else if (member?.chatRoomType === "CHAT") {
      return t("Group");
    } else if (user?.role === "patient") {
      return t("Doctor");
    } else if (user?.role === "doctor") {
      return t("Patient");
    }
  }, [
    lastJsonMessage?.command,
    lastJsonMessage?.content,
    member?.chatRoomType,
    user?.role,
    t,
  ]);

  return (
    <div className="relative h-full w-[608px] rounded-3xl !border border-solid !border-gray-3 bg-gray-bgCard pb-20 pt-[88px]">
      {loadChatInfo || loadDoctorProfile ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="absolute left-0 top-0 flex h-[88px] w-full flex-row items-center justify-between rounded-t-3xl bg-blueGray">
            <div
              className="ml-5 flex cursor-pointer flex-row gap-3"
              onClick={redirectToProfile}
            >
              <Avatar
                icon={<UserIcon size="lg" />}
                src={doctorInfo?.data.photoUrl}
                size="m"
              />
              <div className="ml-2 flex w-[240px] flex-col gap-2 py-1">
                <span className="flex flex-row items-center justify-between">
                  <p className="m-0 p-0 text-Medium16">{member?.memberName}</p>
                </span>
                <span className="flex flex-row items-center justify-between">
                  <p className="m-0 flex flex-row items-center p-0 text-Regular12 text-darkPurple">
                    {renderDescription}
                  </p>
                </span>
              </div>
            </div>
            <div className="mr-5 flex flex-row items-center gap-3">
              {state !== "inCall" && (
                <div
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl"
                  onClick={startCall}
                >
                  <DesktopCallingIcon />
                </div>
              )}
              {state !== "inCall" && (
                <div
                  onClick={startCall}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-lightGreen"
                >
                  <DesktopVideoIcon />
                </div>
              )}
            </div>
          </div>
          {/*<div className="flex w-full justify-center">*/}
          {/*  <div className="mt-5 flex h-[48px] w-[482px] items-center gap-2 rounded-2xl bg-lightOrange">*/}
          {/*    <div className="ml-5">*/}
          {/*      <LockIcon width={24} height={24} />*/}
          {/*    </div>*/}
          {/*    <p className="m-0 p-0 text-Regular10">*/}
          {/*      Сообщения и звонки защищены сквозным шифрованием*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="relative flex h-full flex-col-reverse overflow-y-auto pb-4">
            <div ref={messagesEndRef} />
            {newMessages.map((message, index) => (
              <div
                key={index}
                className={clsx("ml-5 mt-5 w-message rounded-xl px-5 py-3", {
                  "mr-auto rounded-bl bg-gray-1":
                    message.senderId !== user?.user_id,
                  "ml-auto mr-5 rounded-br bg-colorPrimaryBg":
                    message.senderId === user?.user_id,
                })}
              >
                {renderMessage(message)}
                <p className="mb-0 text-right text-Regular10 text-secondaryText">
                  {format(new Date(message.created), "hh:mm dd.MM")}
                </p>
              </div>
            ))}
            {messageHistory.map((message, index) => (
              <div
                key={index}
                className={clsx("ml-5 mt-5 w-message rounded-xl px-5 py-3", {
                  "mr-auto rounded-bl bg-gray-1":
                    message.senderId !== user?.user_id,
                  "ml-auto mr-5 rounded-br bg-colorPrimaryBg":
                    message.senderId === user?.user_id,
                })}
              >
                {index === messageHistory.length - 10 ? (
                  <VisibilitySensor onChange={loadMore}>
                    {renderMessage(message)}
                  </VisibilitySensor>
                ) : (
                  renderMessage(message)
                )}

                <p className="mb-0 text-right text-Regular10 text-secondaryText">
                  {format(new Date(message.created), "hh:mm dd.MM")}
                </p>
              </div>
            ))}
            {loadingMsg && (
              <div className="text-center">{t("LoadingMessagesWithDots")}</div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex h-[80px] w-full flex-row items-center justify-evenly rounded-b-3xl bg-gray-0">
            {/*<div className="ml-5 flex w-[36px] flex-row items-center justify-between">*/}
            {/*  <DesktopPlusIcon />*/}
            {/*</div>*/}
            <Upload
              showUploadList={false}
              beforeUpload={onSendingFile}
              customRequest={updloadFile}
              data={(file) => ({ file, chatRoomId })}
            >
              <Button
                iconButton
                loading={loadFile}
                icon={<DesktopPlusIcon />}
                className="ml-5"
                variant="tertiary"
              />
            </Upload>
            <div className="w-full">
              <form onSubmit={sendMessgae}>
                <DesktopInputText
                  inputClassName="px-3"
                  placeholder="Say something ..."
                  label="say"
                  name="say"
                  showAsterisk={false}
                  type="text"
                  value={message}
                  onFocus={onTyping}
                  onBlur={onTypingStop}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
