import { api } from "@/shared/api/instance";

export const storiesApi = {
  getStories() {
    return api.get("/main/story");
  },
};
