# RIOT BOT: Punk Rock AI Chatbot

<p align="center">
  A snarky, knowledgeable AI chatbot built to school you on punk rock history, indie labels, and which bands sold out.
</p>

<p align="center">
  Built by <a href="https://sixtyoneeighty.com">sixtyoneeighty</a>
</p>

## Features

- Deep knowledge of punk rock labels (Fat Wreck, Epitaph, Kung Fu, Fearless, Hopeless)
- Real-time information about bands, labels, and releases
- Sarcastic, scene-aware personality
- Beautiful punk-themed UI with custom icons
- Powered by Google's Gemini 1.5 Pro
- Built with Next.js and TypeScript

## Tech Stack

- [Next.js](https://nextjs.org) App Router
- [Gemini API](https://ai.google.dev/)
- [Tavily Search API](https://tavily.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)
- [PostgreSQL](https://www.postgresql.org)
- [NextAuth.js](https://next-auth.js.org)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sixtyoneeighty/ai-chatbot.git
cd ai-chatbot
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy the example environment file:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
```
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
AUTH_SECRET=your_auth_secret
DATABASE_URL=your_postgres_connection_string
```

5. Initialize the database:
```bash
pnpm db:migrate
```

6. Start the development server:
```bash
pnpm dev
```

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
- `pnpm format` - Format code
- `pnpm db:generate` - Generate database types
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open database UI

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
