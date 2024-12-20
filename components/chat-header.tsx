'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontalIcon } from './icons';
import { Button } from './ui/button';
import { VisibilityType } from '@/lib/types';

export function ChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex h-12 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => {
            router.push('/');
          }}
        >
          <MoreHorizontalIcon />
          <span className="sr-only">Menu</span>
        </Button>
      </div>
    </div>
  );
}
