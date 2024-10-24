import type { ReactElement } from "react";
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
import { Input as InputAntd } from "antd";
import { Spin, Upload } from "antd";
import clsx from "clsx";
import { format } from "date-fns";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useGesture } from "@use-gesture/react";
import { ChatDialog, ForwardMessageDialog } from "@/widgets/chat";

import { chatApi } from "@/shared/api/chat";
import { doctorsApi } from "@/shared/api/doctors";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  Avatar,
  Button,
  CloseIcon,
  DividerSaunet,
  EditIcon,
  GPTIcon,
  MessageReadIcon,
  MessageUnreadIcon,
  Navbar,
  UploadIcon,
  VideoCameraIcon,
} from "@/shared/components";
import { CallContext } from "@/shared/contexts/callContext";
import { UserContext } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";
import { useMediaQuery } from "@/shared/utils";

const images = ["jpg", "png", "gif", "jpeg"];

interface Messages {
  id?: number;
  content?: string;
  created: Date;
  fileUrl?: string;
  message: string;
  senderId: string;
}

const newMessages1 = [
  {
    id: 0,
    content: "Hello",
    created: new Date(),
    fileUrl: "/hhtp",
    message: "from newMessages1",
    senderId: "65087d908c97b960550a79d0",
  },
  {
    id: 1,
    content: "Hello buddy",
    created: new Date(),
    fileUrl: "",
    message: "newMessages1",
    senderId: "65087d908c97b960550a79d0",
  },
];

const messageHistory1 = [
  {
    id: 2,
    content: "Hello buddy",
    created: new Date(),
    fileUrl: "",
    message: "Hello",
    senderId: "65087d908c97b960550a79d0",
  },
  {
    id: 3,
    content: "Hello buddy",
    created: new Date(),
    fileUrl: "",
    message: "Hello",
    senderId: "65087d908c97b960550a79d0",
  },
];

//65087d908c97b960550a79d0
export default function ChatRoomPage() {
  const t = useTranslations("Common");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [loadFile, setLoadFile] = useState(false);

  const [messageHistory, setMessageHistory] = useState<Messages[]>([]);
  const [newMessages, setNewMessages] = useState<Messages[]>([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(true);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const {
    lastJsonMessage,
    sendJsonMessage,
    readMessages,
    newMessages: newMessagesContext,
    initCall,
    state,
  } = useContext(CallContext);
  const isMobile = useMediaQuery();

  const chatRoomId = useMemo(
    () =>
      router.query.chatRoomId && !Array.isArray(router.query.chatRoomId)
        ? router.query.chatRoomId
        : "",
    [router.query]
  );
  //TODO unlock after back update

  // useEffect(() => {
  //   if (chatRoomId) {
  //     sendJsonMessage({
  //       command: "CHAT_ROOM_STATUS_GET",
  //       chatRoomId,
  //     });
  //   }
  // }, [chatRoomId, sendJsonMessage]);

  // const { data: member, isLoading: loadChatInfo } = useQuery(  NEWTODO: раскомментить и убрать member ниже после бэка
  //   ["getChatInfo", chatRoomId],
  //   () =>
  //     chatApi.getChatInfo(chatRoomId).then((re) => ({
  //       memberId: re.data.members.find((id: string) => id !== user?.user_id),
  //       memberName: re.data.name,
  //       chatRoomType: re.data.chatRoomType,
  //     })),
  //   { enabled: !!chatRoomId && !!user }
  // );
  const member = {
    memberId: "123",
    memberName: "Имя Фамилия Отчество",
    chatRoomType: "CHAT",
  };

  let loadChatInfo = false;

  const { data: doctorInfo, isLoading: loadDoctorProfile } = useQuery(
    ["getChatDoctorProfile", member],
    () => doctorsApi.getDoctorById(member?.memberId),
    { enabled: user?.role === "patient" && !!member?.memberId }
  );

  // const { data: userInfo, isLoading: loadUserProfile } = useQuery(
  //   ["getChatUserProfile", member],
  //   () => superAdminApis.getPatientProfile(member?.memberId),
  //   { enabled: user?.role === "doctor" && !!member?.memberId }
  // );

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
      (!loadingMsg && messageHistory.length === 0) ||
      (messageHistory[0] &&
        lastJsonMessage?.content !== messageHistory?.[0]?.content),
    [lastJsonMessage?.content, loadingMsg, messageHistory]
  );

  useEffect(() => {
    if (
      lastJsonMessage !== null &&
      (lastJsonMessage.command === "MESSAGE" ||
        lastJsonMessage.command === "MESSAGE_AI") &&
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

  const startCall = useCallback(() => {
    if (isMobile) {
      initCall(chatRoomId);
    } else {
      router.push(`/desktop/configCall/${chatRoomId}?isOffer=true`);
    }
  }, [chatRoomId, initCall, isMobile, router]);

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

  const onSendingFile = useCallback(() => {
    setLoadFile(true);
    sendJsonMessage({
      command: "SENDING_FILE",
      content: true,
      chatRoomId,
    });
  }, [chatRoomId, sendJsonMessage]);

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
          <>
            <div
              className="max-h-full w-full flex-1 p-2 mb-4"
              style={{
                backgroundColor: "#F0DDE1",
                borderLeft: "4px solid",
                borderRadius: "8px",
                borderLeftColor: "#F62F5A",
              }}
            >
              <div className="text-Medium12 text-gray-secondary">
                Сарсенбай С.
              </div>
              <div className="text-Regular14">
                Вам нужно будет сначала сдать анализы для начала
              </div>
            </div>
            <p className="mb-2 text-Regular16">
              {message.message ?? message.content}
            </p>
          </>
        );
      }
    },
    [router]
  );

  const redirectToProfile = useCallback(() => {
    if (member?.chatRoomType !== "AI_CHAT") {
      if (user?.role === "patient") {
        router.push({
          pathname: `/doctor/${doctorInfo?.data.id}`,
        });
      } else if (user?.role === "doctor") {
        router.push({
          pathname: `/myDoctor/patients/${member?.memberId}`,
        });
      }
    }
  }, [
    member?.chatRoomType,
    member?.memberId,
    user?.role,
    router,
    doctorInfo?.data.id,
  ]);

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
    t,
    user?.role,
  ]);

  const canCall = useMemo(
    () => state !== "inCall" && member?.chatRoomType !== "AI_CHAT",
    [member?.chatRoomType, state]
  );

  const renderContextMenu = () => (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-20"
      style={{ background: "#999495B2" }}
    >
      <div className="bg-white p-5 rounded-xl w-auto">
        <div className="flex items-center justify-between">
          <div
            className="w-full text-left text-Regular16 cursor-pointer"
            onClick={() => console.log("Reply")}
          >
            Ответить
          </div>
        </div>

        <DividerSaunet />
        <div className="flex items-center justify-between">
          <div
            className="w-full text-left text-Regular16 cursor-pointer"
            onClick={() => handleCopyMessage()}
          >
            Скопировать
          </div>
        </div>

        <DividerSaunet />
        <div className="flex items-center justify-between">
          <div
            className="w-full text-left text-Regular16 cursor-pointer"
            onClick={() => {
              setIsOpenForwardDialog(true);
              setContextMenuVisible(false);
            }}
          >
            Переслать
          </div>
        </div>

        <DividerSaunet />
        <div className="flex items-center justify-between">
          <div
            className="w-full text-left text-Regular16 cursor-pointer"
            onClick={() => {
              setIsOpenEditMessage(true);
              setContextMenuVisible(false);
            }}
          >
            Редактировать
          </div>
        </div>

        <DividerSaunet />
        <div className="flex items-center justify-between">
          <div
            className="w-full text-left text-red text-Regular16 cursor-pointer"
            onClick={() => {
              setIsOpenDeleteDialog(true);
              setContextMenuVisible(false);
            }}
          >
            Удалить
          </div>
        </div>
      </div>
    </div>
  );

  const [selectedMessage, setSelectedMessage] =
    useState<HTMLElement | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] =
    useState<number | null>(null);

  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy message: ", err);
      });
  };

  const handleCopyMessage = () => {
    if (selectedMessageId !== null) {
      const messageToCopy = newMessages1.find(
        (msg) => msg.id === selectedMessageId
      );
      if (messageToCopy) {
        copyToClipboard(messageToCopy.message);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Проверяем, находится ли клик вне контекстного меню
      if (!selectedMessage?.contains(target)) {
        setContextMenuVisible(false);
      }
    };

    if (contextMenuVisible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenuVisible, selectedMessage]);

  const longPress = useGesture({
    onPointerDown: ({ event }) => {
      // Начало нажатия
      setPressTimer(
        setTimeout(() => {
          const target = event.target as HTMLElement;
          const messageElement = target.closest("[data-id]");
          const messageId = messageElement
            ? parseInt(messageElement.getAttribute("data-id") || "")
            : null;

          if (messageId !== null) {
            setSelectedMessageId(messageId);
            setContextMenuVisible(true);
          }
        }, 500)
      ); // 500 мс для определения долгого нажатия
    },
    onPointerUp: () => {
      // Завершение нажатия
      if (pressTimer) {
        clearTimeout(pressTimer);
        setPressTimer(null);
      }
    },
    onPointerLeave: () => {
      // Если пользователь уходит с элемента до завершения долгого нажатия
      if (pressTimer) {
        clearTimeout(pressTimer);
        setPressTimer(null);
      }
    },
  });

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenEditMessage, setIsOpenEditMessage] = useState(false);
  const [isOpenForwardDialog, setIsOpenForwardDialog] = useState(false);
  const doctorsList = [
    {
      startIcon: (
        <Avatar
          size={40}
          isOnline
          // style={{ borderRadius: "12px" }}
          src="doctor-profile.png"
        />
      ),
      id: 124,
      title: "Дмитрий Семейкин",
      description: "Врач",
    },
    {
      startIcon: (
        <Avatar
          size={40}
          isOnline
          // style={{ borderRadius: "12px" }}
          src="doctor-profile.png"
        />
      ),
      id: 124,
      title: "Георгий Евдакимов",
      description: "Хирург",
    },
    {
      startIcon: (
        <Avatar
          size={40}
          // style={{ borderRadius: "12px" }}
          src="doctor-profile.png"
        />
      ),
      id: 124,
      title: "Василий Иванов",
      description: "Терапевт",
    },
    {
      startIcon: (
        <Avatar
          size={40}
          // style={{ borderRadius: "12px" }}
          src="doctor-profile.png"
        />
      ),
      id: 124,
      title: "Дмитрий Семейкин",
      description: "Врач",
    },
    {
      startIcon: (
        <Avatar
          size={40}
          // style={{ borderRadius: "12px" }}
          src="doctor-profile.png"
        />
      ),
      id: 124,
      title: "Георгий Евдакимов",
      description: "Хирург",
    },
    {
      startIcon: (
        <Avatar
          size={40}
          // style={{ borderRadius: "12px" }}
          src="doctor-profile.png"
        />
      ),
      id: 124,
      title: "Василий Иванов",
      description: "Терапевт",
    },
  ];
  return (
    <>
      <ChatDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
      />
      <ForwardMessageDialog
        list={doctorsList}
        isOpen={isOpenForwardDialog}
        setIsOpen={setIsOpenForwardDialog}
      />
      <div className="flex h-full flex-col">
        {loadChatInfo || loadDoctorProfile ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div onClick={() => redirectToProfile()}>
              <Navbar
                title={
                  member?.chatRoomType === "AI_CHAT"
                    ? "OneClinic AI Bot"
                    : member?.memberName
                }
                description={renderDescription}
                avatar={
                  member?.chatRoomType === "AI_CHAT" ? (
                    <GPTIcon size="lg" className="!bg-lightGreen" />
                  ) : (
                    doctorInfo?.data.photoUrl
                  )
                }
                leftButtonOnClick={() => router.push("/chat")}
                buttonIcon={<ArrowLeftIcon />}
                rightIcon={canCall ? <VideoCameraIcon /> : undefined}
                rightIconOnClick={canCall ? startCall : undefined}
                className="top-0 px-4"
              />
            </div>
            <DividerSaunet className="m-0" />
            {/*  окошко при открытии консультации с врачом */}
            <div className="relative flex h-full flex-col-reverse overflow-y-auto bg-white px-4 pb-3">
              {messageHistory.length ? (
                <>
                  <div className="w-[316px] mx-auto my-auto bg-lightRed rounded-3xl p-6">
                    <div className="text-Bold16 mb-3">
                      Консультация с врачом
                    </div>
                    <div className="text-Regular14 mb-3">
                      ✅ Длительность консультации 20 минут
                    </div>
                    <div className="text-Regular14 mb-3">
                      ✅ Получите назначение от врача онлайн{" "}
                    </div>
                    <div className="text-Regular14 mb-3">
                      ✅ Сообщения и данные о консультации обезопасены и
                      засекречены
                    </div>
                  </div>
                  <div className="mx-auto mt-12 flex flex-col items-center text-Regular12 text-secondaryText">
                    <p className="mb-0">Открыта сессия онлайн-консультации.</p>
                    <p>Опишите свою проблему врачу или свяжитесь по видео</p>
                  </div>
                </>
              ) : (
                <>
                  <div ref={messagesEndRef} />
                  {newMessages1.map((message, index) => (
                    <div
                      //@ts-ignore
                      {...longPress()}
                      key={index}
                      className={clsx(
                        "mt-3 w-message rounded-2xl px-4 pb-2 pt-4",
                        {
                          "mr-auto rounded-bl bg-gray-1":
                            message.senderId === user?.user_id, // NEWTODO: изменить наоборот, === на !=== и ниже так же
                          "ml-auto rounded-br bg-lightRed":
                            message.senderId !== user?.user_id,
                          // "z-1000": selectedMessage.message
                          "z-[1000]": selectedMessageId === message.id,
                        }
                      )}
                      data-id={message.id}
                    >
                      {renderMessage(message)}
                      <div className="flex items-center justify-end">
                        <p className="mb-0 pr-1">
                          <MessageReadIcon width={16} height={16} />
                        </p>
                        <p className="mb-1 text-right text-Regular10 text-secondaryText">
                          {format(new Date(message.created), "hh:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {messageHistory1.map((message, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "mt-3 w-message rounded-2xl px-4 pb-2 pt-4",
                        {
                          "mr-auto rounded-bl bg-gray-1":
                            message.senderId !== user?.user_id,
                          "ml-auto rounded-br bg-brand-superLight":
                            message.senderId === user?.user_id,
                        }
                      )}
                    >
                      {index === messageHistory.length - 10 ? (
                        <VisibilitySensor onChange={loadMore}>
                          {renderMessage(message)}
                        </VisibilitySensor>
                      ) : (
                        renderMessage(message)
                      )}
                      <div className="flex items-center justify-end">
                        <p className="mb-0 pr-1">
                          <MessageUnreadIcon width={12} height={12} />
                        </p>
                        <p className="mb-0 text-right text-Regular10 text-secondaryText">
                          {format(new Date(message.created), "hh:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loadingMsg && (
                    <div className="text-center">
                      {t("LoadingMessagesWithDots")}
                    </div>
                  )}
                </>
              )}
            </div>
            {contextMenuVisible && renderContextMenu()}
            {isOpenEditMessage && (
              <div className="left-0 flex items-center max-h-half w-full border-x-0 border-b-0 border-solid border-t-gray-1 bg-white p-3">
                <div className="ml-1">
                  <EditIcon />
                </div>

                <div
                  className="max-h-full w-full flex-1 p-2 ml-4"
                  style={{
                    borderLeft: "4px solid",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                    borderLeftColor: "#AEEFA2",
                  }}
                >
                  <div className="text-Medium12 text-positiveStatus">
                    Редактирование
                  </div>
                  <div className="text-Regular14">
                    Вам нужно будет сначала сдать анализы для начала
                  </div>
                </div>
                <Button
                  icon={<CloseIcon />}
                  iconButton
                  transparent
                  // className="mt-auto"
                  onClick={() => {
                    setIsOpenEditMessage(false);
                  }}
                />
              </div>
            )}

            <div className="left-0 flex max-h-half w-full border-x-0 border-b-0 border-solid border-t-gray-1 bg-white p-3">
              <Upload
                showUploadList={false}
                beforeUpload={onSendingFile}
                customRequest={updloadFile}
                data={(file) => ({ file, chatRoomId })}
              >
                <Button
                  iconButton
                  loading={loadFile}
                  icon={<UploadIcon />}
                  className={clsx("mt-auto bg-gray-2", { "bg-red": loadFile })}
                />
              </Upload>
              <div className="max-h-full w-full flex-1 px-2">
                <InputAntd.TextArea
                  value={message}
                  onFocus={onTyping}
                  onBlur={onTypingStop}
                  onChange={(event) => setMessage(event.target.value)}
                  autoSize
                  className="!h-9 max-h-full !rounded-[20px] border-none bg-gray-2 px-4 py-2 text-Regular16"
                  placeholder={t("Message")}
                  style={{ resize: "none" }}
                />
              </div>
              <Button
                icon={<ArrowUpIcon color="white" />}
                iconButton
                className="mt-auto"
                onClick={() => {
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
                    command:
                      member?.chatRoomType === "AI_CHAT"
                        ? "MESSAGE_AI"
                        : "MESSAGE",
                    content: message,
                    chatRoomId,
                  });
                  setMessage("");
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

ChatRoomPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
