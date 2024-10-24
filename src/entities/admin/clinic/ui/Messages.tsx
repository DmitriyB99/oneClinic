import type { FC } from "react";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";

import { Alert } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { MessagesInfoAdmin } from "@/entities/admin/clinic/ui/MessagesInfo";
import { superAdminApis } from "@/shared/api";
import {
  DesktopMessageCell,
  SpinnerWithBackdrop,
  UserIcon,
} from "@/shared/components";
import { dateTimeFormat } from "@/shared/config";

import type { MessagesProps } from "../model";

export const ClinicMessages: FC<MessagesProps> = ({ status, id }) => {
  const [selectedChatRoomId, setSelectedChatRoomId] =
    useState<string | null>(null);
  const tDesktop = useTranslations("Desktop.Admin");
  const {
    isLoading,
    isError,
    data: chatRooms,
  } = useQuery(["getDoctorMessagesById", id], () =>
    superAdminApis.getDoctorMessages(id).then((res) => res.data)
  );

  const renderDate = useCallback(
    (created: Date) => dayjs(new Date(created)).format(dateTimeFormat),
    []
  );

  const handleCloseMessage = useCallback(() => {
    setSelectedChatRoomId(null);
  }, []);

  if (isError) {
    return (
      <Alert
        type="error"
        message={tDesktop("ErrorOccurredWhileUploadingData")}
      />
    );
  }
  if (status !== "ACTIVE") {
    return (
      <Alert
        type="info"
        message={tDesktop("NoDataAcceptApplicationRegistration")}
      />
    );
  }
  return (
    <div className="flex w-full flex-col">
      {isLoading && <SpinnerWithBackdrop />}
      {chatRooms?.totalElements === 0 && (
        <Alert type="info" message={tDesktop("NoMessages")} />
      )}
      <div className="flex flex-col gap-2">
        {selectedChatRoomId ? (
          <MessagesInfoAdmin
            chatRoomId={selectedChatRoomId}
            doctorId={id}
            onClose={handleCloseMessage}
          />
        ) : (
          chatRooms?.content.map((chat) => (
            <DesktopMessageCell
              key={chat.id}
              name={chat.name}
              mainIcon={<UserIcon size="xl" />}
              isOnline={chat.online}
              messageTime={renderDate(chat.latestChatMessage?.created)}
              subheading={chat.latestChatMessage?.content}
              onClick={() => setSelectedChatRoomId(chat.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
