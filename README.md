# Decart Models

Interactive AI model platform for image-to-video generation and real-time video editing.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp env.local.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Documentation

- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and structure
- **[Model Views Guide](docs/MODEL_VIEWS.md)** - How to create and customize model interfaces

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Query + React Hooks
- **Database**: Supabase
- **AI Models**: FAL AI (Lucy 14B, Lucy 5B, Splice)

## Available Models

- **Lucy 14B**: High-quality image-to-video generation
- **Lucy 5B**: Fast image-to-video generation  
- **Splice**: Real-time video editing

## License

MIT