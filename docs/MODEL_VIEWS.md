# Model Views System

This project uses a registry-based system for model-specific UI components, allowing each model to have completely custom interfaces while sharing common logic through hooks.

## Architecture

```
src/
  app/
    models/
      layout.tsx              # Fixed TopBar + Sidebar layout
      [slug]/
        page.tsx              # Dynamic route using registry
  components/
    models/
      registry.ts             # Slug → Component mapping
      Lucy14bView.tsx         # Custom UI for Lucy 14b
      Lucy5bView.tsx          # Custom UI for Lucy 5b  
      DefaultModelView.tsx    # Fallback for unmapped models
  hooks/
    jobs/useJobCreation.ts    # Shared job creation logic
    jobs/useJobStatus.ts      # Shared job polling logic
    upload/useFileUpload.ts   # Shared file upload logic
```

## How It Works

1. **Fixed Layout**: `app/models/layout.tsx` provides persistent TopBar and Sidebar
2. **Dynamic Views**: `[slug]/page.tsx` looks up the model and gets its view from registry
3. **Registry Mapping**: `registry.ts` maps model slugs to React components
4. **Shared Logic**: All views use the same hooks for consistent behavior

## Adding New Model Views

1. **Create View Component**:
   ```tsx
   // src/components/models/MyModelView.tsx
   'use client'
   import type { ModelViewProps } from './registry'
   
   export default function MyModelView({ model }: ModelViewProps) {
     // Your custom UI here
     return <div>Custom UI for {model.name}</div>
   }
   ```

2. **Register in Registry**:
   ```tsx
   // src/components/models/registry.ts
   export const MODEL_VIEWS = {
     'lucy-14b': Lucy14bView,
     'lucy-5b': Lucy5bView,
     'my-model': MyModelView,  // Add your mapping
   }
   ```

3. **Ensure Model Exists**:
   ```tsx
   // src/lib/models.ts - Make sure your model is defined
   { 
     slug: 'my-model', 
     name: 'My Model', 
     code: 'MyModel', 
     enabled: true 
   }
   ```

## View Examples

### Lucy14bView
- Single-column layout with large video stage
- Horizontal prompt bar at bottom
- Upload tile + textarea + generate button

### Lucy5bView  
- Two-column layout (input | output)
- Side-by-side input and video sections
- Different styling with gradients and cards

### DefaultModelView
- Fallback for unmapped models
- Shows setup instructions and model metadata
- Helpful for development and debugging

## Shared Hooks

All views have access to:

- `useFileUpload()` - File selection, upload, drag & drop
- `useJobCreation(model)` - Model-scoped job creation
- `useJobStatus(model, jobId)` - Auto-polling job status with model context

## Navigation Benefits

- **No Layout Rerender**: TopBar and Sidebar stay fixed when switching models
- **Model Isolation**: Each model can have completely different UI/UX
- **Shared State**: Common logic (uploads, jobs) handled consistently
- **Easy Extension**: Add new models by creating view + registry entry

## Testing

Navigate between:
- `/models/lucy-14b` - See custom Lucy 14b interface
- `/models/lucy-5b` - See different Lucy 5b interface  
- `/models/splice` - See fallback view (if model exists but no custom view)
