# AI Models

## Available Models

### Lucy 14B (`lucy14b.ts`)
- **Purpose**: High-quality image-to-video generation
- **Provider**: FAL AI  
- **Model**: `fal-ai/wan/v2.2-a14b/image-to-video`
- **Mode**: Asynchronous (15 second submission timeout)
- **Input**: Images (PNG/JPEG/WebP, max 10MB)
- **Output**: MP4 videos (720p, 17-121 frames)
- **Features**: 
  - Async job submission (Vercel compatible)
  - Polling for results via webhooks
  - Comprehensive error handling with retry
  - Detailed logging for debugging
  - Automatic frame calculation from duration

## Configuration

Add to `.env.local`:

```env
PROVIDER_NAME=lucy14b
FAL_API_KEY=your_fal_api_key
FAL_BASE_URL=https://fal.run
```

## Usage

```typescript
import { getModelProvider } from '@/config'

const provider = getModelProvider('lucy14b')
const result = await provider.run(input)
```

## Adding New Models

1. Create `your-model.ts` with provider implementation
2. Add to `MODELS` registry in `index.ts`  
3. Update this README