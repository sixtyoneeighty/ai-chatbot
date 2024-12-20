import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  type Message,
  message,
  vote,
} from './schema';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    console.log('Attempting to get user from database:', email);
    const result = await db.select().from(user).where(eq(user.email, email));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to get user from database:', error);
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    console.log('Attempting to create user in database:', email);
    const result = await db.insert(user).values({ email, password: hash });
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to create user in database:', error);
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    console.log('Attempting to save chat in database:', id);
    const result = await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to save chat in database:', error);
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    console.log('Attempting to delete chat by id from database:', id);
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    const result = await db.delete(chat).where(eq(chat.id, id));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to delete chat by id from database:', error);
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    console.log('Attempting to get chats by user from database:', id);
    const result = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to get chats by user from database:', error);
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    console.log('Attempting to get chat by id from database:', id);
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    console.log('Database query result:', selectedChat);
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database:', error);
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    console.log('Attempting to save messages in database:', messages);
    const result = await db.insert(message).values(messages);
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to save messages in database:', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    console.log('Attempting to get messages by chat id from database:', id);
    const result = await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to get messages by chat id from database:', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    console.log('Attempting to upvote message in database:', messageId);
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      const result = await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
      console.log('Database query result:', result);
      return result;
    }
    const result = await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to upvote message in database:', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    console.log('Attempting to get votes by chat id from database:', id);
    const result = await db.select().from(vote).where(eq(vote.chatId, id));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to get votes by chat id from database:', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: 'text' | 'code';
  content: string;
  userId: string;
}) {
  try {
    console.log('Attempting to save document in database:', id);
    const result = await db.insert(document).values({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    });
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to save document in database:', error);
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    console.log('Attempting to get document by id from database:', id);
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));
    console.log('Database query result:', documents);
    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database:', error);
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    console.log('Attempting to get document by id from database:', id);
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));
    console.log('Database query result:', selectedDocument);
    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database:', error);
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    console.log('Attempting to delete documents by id after timestamp from database:', id);
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    const result = await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database:',
      error,
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    console.log('Attempting to save suggestions in database:', suggestions);
    const result = await db.insert(suggestion).values(suggestions);
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to save suggestions in database:', error);
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    console.log('Attempting to get suggestions by document version from database:', documentId);
    const result = await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database:',
      error,
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    console.log('Attempting to get message by id from database:', id);
    const result = await db.select().from(message).where(eq(message.id, id));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to get message by id from database:', error);
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    console.log('Attempting to delete messages by id after timestamp from database:', chatId);
    const result = await db
      .delete(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database:',
      error,
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    console.log('Attempting to update chat visibility in database:', chatId);
    const result = await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
    console.log('Database query result:', result);
    return result;
  } catch (error) {
    console.error('Failed to update chat visibility in database:', error);
    throw error;
  }
}
