import { cn } from '@/lib/utils';
import { SpikedHeart, SafetyPin, Mohawk, GuitarPick, Anarchy } from '../icons/punk-icons';

interface PunkThemeProps {
  variant?: 'user' | 'assistant';
  children: React.ReactNode;
}

const punkGradients = {
  user: 'bg-gradient-to-r from-pink-600 to-purple-600',
  assistant: 'bg-gradient-to-r from-red-600 to-black',
};

const punkBorders = {
  user: 'border-pink-500',
  assistant: 'border-red-500',
};

export function PunkMessage({ variant = 'user', children }: PunkThemeProps) {
  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border-2 shadow-lg',
        'before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:opacity-10',
        punkGradients[variant],
        punkBorders[variant]
      )}
    >
      <div className="absolute -top-3 -left-3">
        {variant === 'assistant' ? (
          <Mohawk className="w-6 h-6 text-red-500" />
        ) : (
          <SafetyPin className="w-6 h-6 text-pink-500" />
        )}
      </div>
      <div className="relative text-white font-mono">{children}</div>
      <div className="absolute -bottom-3 -right-3">
        {variant === 'assistant' ? (
          <Anarchy className="w-6 h-6 text-red-500" />
        ) : (
          <GuitarPick className="w-6 h-6 text-pink-500" />
        )}
      </div>
    </div>
  );
}

export function PunkContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <SpikedHeart className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl font-bold text-white font-mono">RIOT BOT</h1>
          <SpikedHeart className="w-8 h-8 text-red-500" />
        </div>
        {children}
        <div className="fixed bottom-4 right-4 text-xs text-gray-500 opacity-70 hover:opacity-100 transition-opacity font-mono">
          Punk Rock Chatbot by{' '}
          <a 
            href="https://sixtyoneeighty.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-red-400 transition-colors"
          >
            sixtyoneeighty
          </a>
        </div>
      </div>
    </div>
  );
}

export function PunkInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <input
        {...props}
        className={cn(
          'w-full p-3 rounded-lg',
          'bg-gray-800 text-white font-mono',
          'border-2 border-red-500',
          'focus:outline-none focus:ring-2 focus:ring-pink-500',
          'placeholder:text-gray-400',
          props.className
        )}
      />
      <SafetyPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
    </div>
  );
}
