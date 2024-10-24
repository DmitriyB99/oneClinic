import { api } from "@/shared/api/instance";

export const chatApi = {
  createChat: (params: Record<string, string>) =>
    api.post("/main/chat", null, { params }),
  createGroupChat: (data: { members: string[]; name: string }) =>
    api.post("/main/chat", data),
  getTicket: (chatRoomId?: string) =>
    api.get("/main/chat/ticket", { params: { chatRoomId } }),
  getMessageHistory: (
    chatRoomId: string,
    page: number,
    size: number,
    sort = "created,desc"
  ) =>
    api.get("/main/chat/message", { params: { chatRoomId, page, size, sort } }),
  getChatInfo: (chatRoomId: string) =>
    api.get("main/chat", { params: { chatRoomId } }),
  getChats: (page: number, size: number) =>
    api.get("main/chat", { params: { page, size } }),
  uploadFile: (data: { chatRoomId: string; file: FileList }) =>
    api.post("main/chat/upload", data, {
      headers: { "content-type": "multipart/form-data" },
    }),
  createChatAi: () => api.post("main/chat/ai"),
  getLastConsultation: (chatRoomId: string) =>
    api.get(`main/booking-consultation/slots/nearest/chat-room/${chatRoomId}`),
  updateOnlineConsultationStatus: (slotId: string) =>
    api.put(
      "/main/booking-consultation/slots/start",
      {},
      { params: { slotId } }
    ),
};
