'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MemoizedReactMarkdown = memo(
  ReactMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

export function Markdown({ content }: { content: string }) {
  return (
    <MemoizedReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre: ({ node, ...props }) => (
          <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
            <pre {...props} />
          </div>
        ),
        code: ({ node, ...props }) => (
          <code className="bg-black/10 rounded-lg p-1" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-4 last:mb-0" {...props} />
        ),
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  );
}
