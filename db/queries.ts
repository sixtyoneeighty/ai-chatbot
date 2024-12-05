import { Message } from "ai";

// Temporary in-memory storage
const users = new Map();
const chats = new Map();

export async function createUser({ id, email }: { id: string; email: string }) {
  users.set(id, { id, email });
  return { id, email };
}

export async function getUser({ id }: { id: string }) {
  return users.get(id);
}

export async function saveChat({ id, messages }: { id: string; messages: Message[] }) {
  chats.set(id, { id, messages });
  return { id, messages };
}

export async function getChatById(id: string) {
  return chats.get(id);
}

export async function deleteChatById(id: string) {
  chats.delete(id);
  return true;
}
