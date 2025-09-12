# AI Models

## Available Models

### Lucy 14B (`lucy14b.ts`)
- **Purpose**: High-quality image-to-video generation
- **Provider**: FAL AI  
- **Input**: Images (PNG/JPEG, max 10MB)
- **Output**: MP4 videos (720p, 1-10 seconds)

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