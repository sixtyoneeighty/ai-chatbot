'use client';

import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from 'ai';
import cx from 'classnames';
import { motion } from 'framer-motion';
import type React from 'react';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
} from 'react';
import { toast } from 'sonner';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';

import { sanitizeUIMessages } from '@/lib/utils';
import { punkSuggestedActions, punkPlaceholders } from '@/lib/constants';

import { ArrowUpIcon, PaperclipIcon, StopIcon } from './icons';
import { PreviewAttachment } from './preview-attachment';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const getRandomPlaceholder = () => {
  const index = Math.floor(Math.random() * punkPlaceholders.length);
  return punkPlaceholders[index];
};

export function MultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  handleSubmit,
  messages,
  append,
}: {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments?: Attachment[];
  setAttachments?: Dispatch<SetStateAction<Attachment[]>>;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    options?: ChatRequestOptions | undefined,
  ) => void;
  messages: Message[];
  append: (message: CreateMessage) => Promise<void>;
}) {
  const [placeholder] = useState(getRandomPlaceholder());
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { width: windowWidth = 1920, height: windowHeight = 1080 } =
    useWindowSize();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || '';
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    window.history.replaceState({}, '', `/chat/${chatId}`);

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setLocalStorageInput('');

    if (windowWidth && windowWidth > 768) {
      textareaRef.current?.focus();
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    windowWidth,
    chatId,
  ]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      toast.error('Failed to upload file, please try again!');
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
    >
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background pr-8">
              <Textarea
                ref={inputRef}
                tabIndex={0}
                rows={1}
                value={input}
                onChange={handleInput}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();

                    if (isLoading) {
                      toast.error('Please wait for the model to finish its response!');
                    } else {
                      submitForm();
                    }
                  }
                }}
                placeholder={placeholder}
                spellCheck={false}
                className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                autoFocus
              />
              <div
                className={cx('absolute right-0 top-4 sm:right-4', {
                  'cursor-not-allowed opacity-50': isLoading,
                })}
              >
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || input === ''}
                  variant="ghost"
                >
                  <ArrowUpIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>

          {messages.length === 0 && (
            <div className="mx-auto max-w-2xl px-4">
              <div className="rounded-lg border bg-background p-8">
                <h1 className="mb-2 text-lg font-semibold">
                  Welcome to RIOT BOT
                </h1>
                <p className="mb-2 leading-normal text-muted-foreground">
                  Your snarky guide to the underground punk scene. I've got encyclopedic knowledge of indie labels, rare releases, and which bands sold out. Try asking about:
                </p>
                <div className="mt-4 flex flex-col items-start space-y-2">
                  {punkSuggestedActions.map((action) => (
                    <Button
                      key={action.action}
                      variant="link"
                      className="h-auto p-0 text-base"
                      onClick={() => {
                        setInput(action.action);
                      }}
                    >
                      <span className="text-primary">{action.title}</span>{' '}
                      <span className="text-muted-foreground">
                        {action.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
