import type { FC } from "react";
import { useCallback } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useQuery } from "react-query";

import { DownloadOutlined } from "@ant-design/icons";
import { Alert, Spin } from "antd";
import clsx from "clsx";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { superAdminApis } from "@/shared/api";
import { ArrowLeftIcon, Button } from "@/shared/components";

interface Messages {
  content?: string;
  created: Date;
  fileUrl?: string;
  senderId: string;
}

const images = ["jpg", "png", "gif", "jpeg"];

export const MessagesInfoAdmin: FC<{
  chatRoomId: string;
  doctorId: string;
  onClose: () => void;
}> = ({ chatRoomId, onClose, doctorId }) => {
  const router = useRouter();
  const tDesktop = useTranslations("Desktop.Admin");

  const {
    isLoading,
    isError,
    data: messages,
  } = useQuery(["getDoctorMessagesByIdInfo", chatRoomId], () =>
    superAdminApis.getDoctorMessagesInfo(chatRoomId).then((res) => res.data)
  );

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
                  alt={message.content}
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
            {message.content}
          </p>
        );
      }
      if (message.content) {
        return <p className="mb-2 text-Regular16">{message.content}</p>;
      }
    },
    [router]
  );

  if (isError) {
    return (
      <Alert
        type="error"
        message={tDesktop("ErrorOccurredWhileUploadingData")}
      />
    );
  }

  return (
    <div>
      <Button size="s" variant="tertiary" onClick={onClose}>
        <ArrowLeftIcon />
      </Button>
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <Spin />
        </div>
      )}
      {messages?.content.map((message, index) => (
        <div
          key={index}
          className={clsx("ml-5 mt-5 w-message rounded-xl px-5 py-3", {
            "mr-auto rounded-bl bg-gray-1": message.senderId !== doctorId,
            "ml-auto mr-5 rounded-br bg-colorPrimaryBg":
              message.senderId === doctorId,
          })}
        >
          {renderMessage(message)}
          <p className="mb-0 text-right text-Regular10 text-secondaryText">
            {format(new Date(message.created), "hh:mm dd.MM")}
          </p>
        </div>
      ))}
    </div>
  );
};
