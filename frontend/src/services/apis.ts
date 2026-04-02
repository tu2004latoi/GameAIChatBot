import axios, { type AxiosInstance } from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:8080/api";

export const endPoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  users: {
    me: "/users/me",
  },
  chats: {
    list: "/chats",
    send: "/chats",
    detail: (id: number) => `/chats/${id}`,
    listByGroup: (id: number) => `/chats/group/${id}`,
  },
  chatGroups: {
    list: "/chat-groups",
    detail: (id: number) => `/chat-groups/${id}`,
  },
} as const;

export const authApis = (): AxiosInstance => {
  const token = Cookies.get("token");

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
  });
};

export default axios.create({
  baseURL: BASE_URL,
});