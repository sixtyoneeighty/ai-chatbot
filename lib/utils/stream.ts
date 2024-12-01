import { Stream } from 'openai/streaming';

export async function streamToString(stream: Stream<any>): Promise<string> {
  const chunks: string[] = [];
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      chunks.push(content);
    }
  }
  return chunks.join('');
}
