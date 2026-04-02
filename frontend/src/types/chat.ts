import type { ChatGroup } from "./chat-group";


export interface ChatHistory {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  chatGroup?: ChatGroup;
}

export interface ChatRequest {
  userId: number;
  question: string;
  chatGroupId: number;
}


