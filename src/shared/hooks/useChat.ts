import { useCallback, useEffect, useMemo, useState } from "react";

export interface NewMessages {
  [key: string]: { count: number; date: Date; message: string };
}

export const useChat = (lastJsonMessage: { [key: string]: string }) => {
  const [newMessages, setNewMessages] = useState<NewMessages>({});

  useEffect(() => {
    if (lastJsonMessage !== null && lastJsonMessage.command === "MESSAGE") {
      setNewMessages((prev) => ({
        ...prev,
        [lastJsonMessage.chatRoomId]: {
          message: lastJsonMessage.content,
          date: new Date(),
          count: prev[lastJsonMessage.chatRoomId]
            ? prev[lastJsonMessage.chatRoomId].count + 1
            : 1,
        },
      }));
    }
  }, [lastJsonMessage]);

  const readMessages = useCallback((id: string) => {
    setNewMessages((prev) => {
      delete prev[id];
      return { ...prev };
    });
  }, []);

  const total = useMemo(
    () => Object.values(newMessages).reduce((acc, nm) => acc + nm.count, 0),
    [newMessages]
  );
  return { newMessages, total, readMessages };
};
