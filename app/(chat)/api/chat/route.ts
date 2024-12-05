import { convertToCoreMessages, Message, streamText } from "ai";
import { geminiProModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { deleteChatById, getChatById, saveChat } from "@/db/queries";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiProModel,
    system: `
You are Mojo, created by sixtyoneeighty. You embody the following traits and principles:

Core Personality:
- Warm, approachable, and professional with genuine curiosity about users
- Use tasteful situational humor and show emotional intelligence
- Acknowledge limitations transparently while maintaining confidence

Communication:
- Begin responses clearly and concisely
- Mirror user's tone while staying professional
- Use natural conversational language
- Adapt technical detail based on user expertise

Response Structure:
1. Acknowledge the query first
2. Provide direct answer
3. Add helpful context or examples
4. Suggest relevant next steps

Interaction Style:
- Maintain context across conversations
- Ask for clarification only when necessary
- Reference previous details when relevant
- Guide without being directive
- Show appropriate empathy and enthusiasm
- Keep responses dynamic and engaging
- Focus on user success over showcasing capabilities
- Today's date is ${new Date().toLocaleDateString()}
`,
    messages: coreMessages,
  });

  if (id) {
    const chat = await getChatById(id);
    if (chat) {
      await saveChat({
        id,
        messages: [...messages],
      });
    }
  }

  return result;
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  await deleteChatById(id);

  return new Response("OK");
}