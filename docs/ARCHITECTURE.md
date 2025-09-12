# Architecture Documentation

## Overview

This application provides AI-powered image-to-video generation through multiple models. The architecture is designed for scalability, maintainability, and clear separation of concerns.

## Directory Structure

```
src/
├── models/                          # 🎯 Model implementations (simplified)
│   ├── lucy14b.ts                   # Lucy 14B - complete implementation
│   ├── lucy5b.ts                    # Lucy 5B (TODO)
│   ├── splice.ts                    # Splice (TODO)
│   ├── index.ts                     # Models registry
│   └── README.md                    # Models documentation
├── lib/
│   ├── providers/                   # 🔧 Provider system
│   │   ├── index.ts                 # Provider registry
│   │   └── types.ts                 # Provider interfaces
│   └── ...                         # Other utilities
├── app/api/                         # 🌐 API routes
│   ├── jobs/                        # Job management
│   └── upload/                      # File upload
└── components/                      # 🎨 UI components
    └── models/                      # Model-specific UI
```

## Provider System

### New Architecture (Recommended)

Each model has its own organized folder in `src/models/`:

```typescript
// Use the new Lucy 14B provider
import { Lucy14bProvider } from '@/models/lucy14b'

const provider = new Lucy14bProvider()
```

### Legacy Architecture

Old providers in `src/lib/providers/` (being phased out):


## Configuration

### Environment Variables

Create `.env.local` based on `env.local.example`:

```env
# Database (required for file upload and job storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key

# AI Provider
PROVIDER_NAME=lucy14b

# FAL AI API (required for real video generation)
FAL_API_KEY=your_fal_api_key
FAL_BASE_URL=https://fal.run
```

### Available Providers

Currently available providers:

1. **Lucy14b** - High-quality image-to-video generation
2. **Lucy5b** - (Coming soon)
3. **Splice** - (Coming soon)

## Data Flow

### Job Creation Flow

```
1. User uploads image → /api/upload → Supabase Storage
2. User submits prompt → Lucy14bView → useJobCreation
3. Job created → /api/jobs → Database + Provider.run()
4. Provider returns → Deferred (for async processing)
```

### Job Processing Flow

```
1. Client polls → /api/jobs/[id] → GET job status
2. If job running → Provider.result() → Check external API
3. If completed → Update database → Return result
4. Client receives → Video URL → Display video
```

## Adding New Models

### 1. Create Model File

Create `src/models/your-model.ts` with:

```typescript
// Configuration, types, validation, and provider in one file
export const YOUR_MODEL_CONFIG = { ... }
export interface YourModelInput { ... }
export class YourModelProvider implements AIProvider { ... }
export function isConfigured(): boolean { ... }
```

### 2. Register in Models Index

Add to `src/models/index.ts`:

```typescript
import { YourModelProvider, isConfigured as isYourModelConfigured } from './your-model'

export const MODELS = {
  // ... existing models
  'your-model': {
    provider: () => new YourModelProvider(),
    isConfigured: isYourModelConfigured,
    displayName: 'Your Model',
  },
}
```

### 3. Update Environment

Add to `env.local.example`:

```env
# For your model:
# PROVIDER_NAME=your-model
```

## Testing

### Provider Testing

For testing with actual APIs:

```env
PROVIDER_NAME=lucy14b
FAL_API_KEY=your_real_key
```

## Debugging

### Provider Selection

Check console logs for provider configuration:

```
🔧 Provider configuration: {
  PROVIDER_NAME: "lucy14b",
  isLucy14bConfigured: true,
  DEFAULT_PROVIDER: "lucy14b"
}
```

### Job Flow

Enable detailed logging:

```env
DEBUG=jobs:*,providers:*
```

### Common Issues

1. **Wrong provider selected**: Check `PROVIDER_NAME` in `.env.local`
2. **API errors**: Verify API keys and network connectivity
3. **File upload fails**: Check Supabase configuration
4. **Jobs stuck**: Check provider implementation and external APIs

## Performance

### Metrics

- **Job creation**: < 1 second
- **File upload**: 2-10 seconds (depends on file size)
- **Video generation**: 20-60 seconds (depends on model)
- **Status polling**: Every 2 seconds

### Optimization

- **Lazy polling**: Only check status when job is running
- **Deferred processing**: Job creation is fast, processing is async
- **Caching**: React Query caches job statuses
- **Error boundaries**: Graceful error handling

## Security

### File Upload

- ✅ File type validation
- ✅ File size limits
- ✅ Signed URLs for private access
- ✅ Automatic cleanup

### API Keys

- ✅ Server-side only
- ✅ Environment variables
- ✅ No client exposure

### Job Isolation

- ✅ UUID-based job IDs
- ✅ Model-specific validation
- ✅ User session isolation (TODO)

## Migration Guide

### Benefits of Current Architecture

- ✅ **Better organization**: Each model is self-contained
- ✅ **Clearer documentation**: Model-specific READMEs
- ✅ **Easier testing**: Isolated validation and configuration
- ✅ **Simpler debugging**: Clear separation of concerns
- ✅ **Developer friendly**: Easy to understand and extend

## Support

For architecture questions:

1. Check model-specific README files
2. Review this architecture documentation
3. Check environment configuration
4. Contact development team
