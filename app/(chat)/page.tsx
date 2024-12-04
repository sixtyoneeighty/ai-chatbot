import { ModelSelector } from '@/components/model-selector';

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <h1 className="text-4xl font-bold mb-8">Chat</h1>
        <ModelSelector />
      </div>
    </main>
  );
}
