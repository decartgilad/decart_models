'use client'

import { TopBar } from '@/ui/patterns/TopBar'
import { Button, Input, Textarea, Badge, Progress, Spinner, ModelCard, FeatureCard, VideoUploadTile, VideoPromptRail, UploadTile, ModelHeader, Stage, StatusBanner, PromptRail } from '@/ui/design-system'
import { DecartLogo } from '@/components/DecartLogo'
import { notFound } from 'next/navigation'

export default function DesignSystemPage() {
  // Guard behind development environment
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }
  return (
    <div className="min-h-screen bg-bg">
      {/* Top Bar */}
      <div className="fixed inset-x-0 top-0 z-40 bg-bg border-b border-border">
        <div className="mx-auto max-w-[1440px] px-xl">
          <div className="flex items-center justify-between py-lg">
            {/* Decart logo - left */}
            <DecartLogo />
            
            {/* TopBar - right */}
            <TopBar onGetAPIClick={() => alert('Get API clicked!')} />
          </div>
        </div>
      </div>

      {/* Main content with top padding */}
      <div className="pt-20 mx-auto max-w-[1440px] px-xl py-xl">
        <div className="space-y-xxl">
          
          {/* Page Header */}
          <div className="mb-xxl">
            <h1 className="text-[46px] leading-[0.98] tracking-[-0.04em] text-fg font-sans mb-lg">Design System</h1>
            <p className="font-mono text-sm leading-loose text-subfg">
              Visual reference for all typography, components, and spacing used in the Decart interface.
            </p>
          </div>

          {/* Typography Section */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Typography</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              {/* Hero / Model Title */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Hero / Model Title</h3>
                <div className="text-[46px] leading-[0.98] tracking-[-0.04em] text-fg font-sans mb-md">Lucy 14b</div>
                <div className="font-mono text-xs text-subfg leading-loose">
                  Font: TT Commons, Size: 46px, Line-height: 0.98, Letter-spacing: -0.04em, Color: White
                </div>
              </div>

              {/* Hero Subtitle */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Hero Subtitle</h3>
                <div className="font-mono text-sm leading-loose text-subfg mb-md">High quality Image to video model</div>
                <div className="font-mono text-xs text-subfg leading-loose">
                  Font: Replica Mono, Size: 14px, Line-height: 1.51, Color: Gray #4D565F
                </div>
              </div>

              {/* Section Titles */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Section Titles</h3>
                <div className="text-xl text-subfg font-sans leading-snug mb-md">Models</div>
                <div className="font-mono text-xs text-subfg leading-loose">
                  Font: TT Commons, Size: 22px, Line-height: 1.31, Color: Gray #4D565F
                </div>
              </div>

              {/* List Item Titles */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">List Item Titles</h3>
                <div className="text-xl text-fg font-sans leading-snug mb-md">Quick Image to Live</div>
                <div className="font-mono text-xs text-subfg leading-loose">
                  Font: TT Commons, Size: 22px, Line-height: 1.31, Color: White
                </div>
              </div>

              {/* Preview Hint */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Preview Hint</h3>
                <div className="font-mono text-md tracking-[-0.03em] text-fg leading-loose mb-md">Your video will appear here</div>
                <div className="font-mono text-xs text-subfg leading-loose">
                  Font: Replica Mono, Size: 16px, Line-height: 1.51, Letter-spacing: -0.03em, Color: White
                </div>
              </div>

              {/* Input Placeholder */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Input Placeholder</h3>
                <input 
                  placeholder="Type your request" 
                  className="w-full bg-transparent border border-border rounded-xs p-md text-lg leading-snug placeholder:text-subfg font-sans mb-md"
                />
                <div className="font-mono text-xs text-subfg leading-loose">
                  Font: TT Commons, Size: 18px, Line-height: 1.31, Color: Gray #4D565F
                </div>
              </div>
            </div>
          </section>

          {/* Buttons Section */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Buttons</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              {/* Primary Button */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Primary Button</h3>
                <div className="mb-md">
                  <Button>Generate</Button>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose">
                  Font: Replica Mono, Size: 14px, Line-height: 1.51, Color: Black on White, Size: 154×39px
                </div>
              </div>

              {/* Get API Button */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Get API Button</h3>
                <div className="relative w-[110px] h-[36px] mb-md">
                  {/* Border container - fixed, no hover */}
                  <div 
                    className="absolute w-[110px] h-[36px] left-0 top-0 border border-white rounded-[40px] bg-transparent pointer-events-none"
                    style={{ boxSizing: 'border-box' }}
                  ></div>
                  {/* Button content with inner hover effect */}
                  <div 
                    className="absolute left-0 right-0 top-0 bottom-0 font-mono text-[12px] leading-[141%] flex items-center justify-center text-white bg-transparent rounded-[40px] cursor-pointer transition-colors hover:bg-white/10"
                    style={{ textAlign: 'center' }}
                  >
                    Get API
                  </div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Size: 110px × 36px (width × height)</div>
                  <div>Shape: Rounded rectangle (40px radius)</div>
                  <div>Font: Replica Mono 12px, line-height: 141%</div>
                  <div>Border: 1px solid white</div>
                  <div>Hover: Inner area only (white 10% opacity)</div>
                  <div>Border: Fixed, unaffected by hover</div>
                </div>
              </div>

              {/* Secondary Button */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Secondary Button</h3>
                <div className="mb-md">
                  <Button variant="secondary">Models</Button>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose">
                  Font: Replica Mono, Size: 12px, Border: 1px White, Radius: 18px
                </div>
              </div>
            </div>
          </section>

          {/* Form Components */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Form Components</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              {/* Input */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Input</h3>
                <div className="mb-md">
                  <Input placeholder="Type your request" />
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Font: TT Commons 18px</div>
                  <div>Border: 1px gray, focus: primary</div>
                  <div>Placeholder: Gray text</div>
                </div>
              </div>

              {/* Textarea */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Textarea</h3>
                <div className="mb-md">
                  <Textarea placeholder="Type your request" rows={3} />
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Font: TT Commons 18px</div>
                  <div>Resizable: Vertical only</div>
                  <div>Auto-height: Based on content</div>
                </div>
              </div>

              {/* Badge */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Badge</h3>
                <div className="flex gap-md mb-md">
                  <Badge>Default</Badge>
                  <Badge kind="success">Success</Badge>
                  <Badge kind="danger">Error</Badge>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Font: Replica Mono 12px</div>
                  <div>Variants: default, success, error</div>
                  <div>Rounded corners, colored backgrounds</div>
                </div>
              </div>
            </div>
          </section>

          {/* UI Components */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">UI Components</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              {/* Progress */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Progress Bar</h3>
                <div className="mb-md">
                  <Progress value={65} />
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Height: 4px</div>
                  <div>Background: Gray 20%</div>
                  <div>Progress: White</div>
                  <div>Animated when indeterminate</div>
                </div>
              </div>

              {/* Spinner */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Spinner</h3>
                <div className="flex justify-center mb-md">
                  <Spinner />
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Size: 24×24px, Border: 2px</div>
                  <div>Color: Primary blue</div>
                  <div>Animation: Spin (infinite)</div>
                  <div>Usage: Loading states</div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Status Banner</h3>
                <div className="mb-md">
                  <StatusBanner 
                    kind="danger" 
                    title="Generation failed"
                    message="Please try again later"
                  />
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>States: success, error, warning</div>
                  <div>Border: Colored with opacity</div>
                  <div>Background: Colored 10% opacity</div>
                </div>
              </div>
            </div>
          </section>

          {/* Component Cards */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Component Cards</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              {/* Model Card - Selected */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Model Card - Selected</h3>
                <div className="mb-md">
                  <ModelCard
                    title="Lucy 14b"
                    subtitle="High quality Image to video model"
                    selected={true}
                    onClick={() => {}}
                  />
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Width: 437px, Min-height: 77px, Radius: 5px</div>
                  <div>Swatch: 68×68px (radius 7px)</div>
                  <div>Border: White when selected</div>
                  <div>Layout: Text center-aligned, icon top-aligned</div>
                  <div>Icon: Custom arrow SVG (11×11px) at top</div>
                  <div>Font: TT Commons 22px title, 18px subtitle</div>
                  <div>Title: Multi-line allowed</div>
                  <div>Description: Single line, ellipsis overflow</div>
                </div>
              </div>

              {/* Feature Card */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Feature Card</h3>
                <div className="mb-md">
                  <FeatureCard
                    title="Quick Image to Live"
                    subtitle="Fast multi image to video no prompt"
                    selected={false}
                    comingSoon={true}
                    onClick={() => {}}
                  />
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Width: 437px, Min-height: 77px, Radius: 5px</div>
                  <div>Swatch: 68×68px (radius 7px)</div>
                  <div>Border: Gray, Pink accent swatch</div>
                  <div>Layout: Center-aligned with arrow icon</div>
                  <div>Icon: Custom arrow SVG (11×11px, dimmed)</div>
                  <div>Font: TT Commons 22px title, 18px subtitle</div>
                  <div>Title: Multi-line allowed</div>
                  <div>Description: Single line, ellipsis overflow</div>
                </div>
              </div>
            </div>
          </section>

          {/* Model Header */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Model Header</h2>
            
            <div className="bg-panel p-xl rounded-xs border border-border">
              <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Model Header - With Icon</h3>
              <div className="mb-md">
                <ModelHeader
                  model={{
                    slug: 'lucy-14b',
                    name: 'Lucy 14B',
                    description: 'High quality Image to video model',
                    code: 'Lucy14b',
                    enabled: true,
                    icon: '/fav_lucy14b.png'
                  }}
                />
              </div>
              <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                <div>Layout: Flex items-end justify-between</div>
                <div>Icon: 68×68px (radius 7px) - same as ModelCard</div>
                <div>Title: 46px TT Commons, tracking -0.04em</div>
                <div>Description: 14px Replica Mono</div>
                <div>Right label: 14px Replica Mono</div>
                <div>Spacing: mb-xl bottom margin</div>
                <div>Sync: Icons match ModelCard registry</div>
              </div>
            </div>
          </section>

          {/* Upload Tiles */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Upload Components</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              {/* Image Upload Tile */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Upload Tile - Image</h3>
                  <div className="flex items-start gap-xl">
                    <div className="h-[105px] w-[105px] border border-border rounded-xs flex flex-col items-center justify-center flex-shrink-0 cursor-pointer hover:bg-white/10 transition-colors overflow-hidden">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        className="text-subfg mb-2"
                      >
                        <path d="M4.75 25.3333L11.8275 18.2558C12.0936 17.9896 12.4096 17.7785 12.7573 17.6344C13.1051 17.4903 13.4778 17.4162 13.8542 17.4162C14.2306 17.4162 14.6033 17.4903 14.951 17.6344C15.2988 17.7785 15.6147 17.9896 15.8808 18.2558L22.1667 24.5416M22.1667 24.5416L24.5417 26.9166M22.1667 24.5416L25.2858 21.4225C25.552 21.1563 25.8679 20.9451 26.2157 20.8011C26.5634 20.657 26.9361 20.5829 27.3125 20.5829C27.6889 20.5829 28.0616 20.657 28.4094 20.8011C28.7571 20.9451 29.073 21.1563 29.3392 21.4225L33.25 25.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 3.95831C12.3025 3.95831 8.95373 3.95831 6.7339 5.85515C6.41723 6.12537 6.12431 6.41828 5.85515 6.7339C3.95831 8.95373 3.95831 12.3025 3.95831 19C3.95831 25.6975 3.95831 29.0462 5.85515 31.2661C6.12537 31.5827 6.41828 31.8756 6.7339 32.1448C8.95373 34.0416 12.3025 34.0416 19 34.0416C25.6975 34.0416 29.0462 34.0416 31.2661 32.1448C31.5827 31.8746 31.8756 31.5817 32.1448 31.2661C34.0416 29.0462 34.0416 25.6975 34.0416 19M24.5416 8.70831C25.4758 7.74723 27.9616 3.95831 29.2916 3.95831C30.6216 3.95831 33.1075 7.74723 34.0416 8.70831M29.2916 4.74998V15.0416" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="font-mono text-xs text-subfg leading-loose tracking-[-0.03em]">Upload</div>
                    </div>
                  <div className="flex-1">
                    <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                      <div>Size: 105×105px</div>
                      <div>Radius: 5px</div>
                      <div>Border: 1px Gray</div>
                      <div>Font: Replica Mono 12px</div>
                      <div>Features: Drag & drop, Click to select</div>
                      <div>States: Empty, Image preview</div>
                      <div>Hover: White overlay (10% opacity)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Upload Tile */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Video Upload Tile - States</h3>
                <div className="space-y-lg">
                  {/* Empty State */}
                  <div className="flex items-start gap-xl">
                    <VideoUploadTile 
                      onFileSelect={(file) => console.log('Video selected:', file.name)}
                    />
                    <div className="flex-1">
                      <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                        <div><strong>Empty State:</strong></div>
                        <div>Size: 105×105px</div>
                        <div>Radius: 5px</div>
                        <div>Border: 1px Gray</div>
                        <div>Font: Replica Mono 12px</div>
                        <div>Features: Drag & drop, Click to select</div>
                        <div>Icon: Custom video upload icon</div>
                        <div>Hover: White overlay (10% opacity)</div>
                      </div>
                    </div>
                  </div>

                  {/* Loading State */}
                  <div className="flex items-start gap-xl">
                    <VideoUploadTile 
                      state="uploading"
                      onFileSelect={(file) => console.log('Video selected:', file.name)}
                    />
                    <div className="flex-1">
                      <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                        <div><strong>Loading State:</strong></div>
                        <div>Spinner: 24px blue spinner</div>
                        <div>Text: "Uploading" in Replica Mono</div>
                        <div>Border: Primary blue color</div>
                      </div>
                    </div>
                  </div>

                  {/* Error State */}
                  <div className="flex items-start gap-xl">
                    <VideoUploadTile 
                      state="error"
                      errorMessage="Invalid video format"
                      onFileSelect={(file) => console.log('Video selected:', file.name)}
                    />
                    <div className="flex-1">
                      <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                        <div><strong>Error State:</strong></div>
                        <div>Icon: Red X symbol</div>
                        <div>Border: Red error color</div>
                        <div>Message: Custom error text</div>
                        <div>Video: Only accepts video/* files</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prompt Components */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Prompt Components</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              {/* Standard Prompt Bar */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Image Prompt Bar</h3>
                <div className="border border-fg p-lg rounded-sm w-full mb-lg">
                  <div className="grid grid-cols-[105px_1fr_154px] gap-lg items-start h-[107px]">
                    {/* Upload tile */}
                    <div className="h-[105px] w-[105px] border border-border rounded-xs flex flex-col items-center justify-center">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        className="text-subfg mb-2"
                      >
                        <path d="M4.75 25.3333L11.8275 18.2558C12.0936 17.9896 12.4096 17.7785 12.7573 17.6344C13.1051 17.4903 13.4778 17.4162 13.8542 17.4162C14.2306 17.4162 14.6033 17.4903 14.951 17.6344C15.2988 17.7785 15.6147 17.9896 15.8808 18.2558L22.1667 24.5416M22.1667 24.5416L24.5417 26.9166M22.1667 24.5416L25.2858 21.4225C25.552 21.1563 25.8679 20.9451 26.2157 20.8011C26.5634 20.657 26.9361 20.5829 27.3125 20.5829C27.6889 20.5829 28.0616 20.657 28.4094 20.8011C28.7571 20.9451 29.073 21.1563 29.3392 21.4225L33.25 25.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 3.95831C12.3025 3.95831 8.95373 3.95831 6.7339 5.85515C6.41723 6.12537 6.12431 6.41828 5.85515 6.7339C3.95831 8.95373 3.95831 12.3025 3.95831 19C3.95831 25.6975 3.95831 29.0462 5.85515 31.2661C6.12537 31.5827 6.41828 31.8756 6.7339 32.1448C8.95373 34.0416 12.3025 34.0416 19 34.0416C25.6975 34.0416 29.0462 34.0416 31.2661 32.1448C31.5827 31.8746 31.8756 31.5817 32.1448 31.2661C34.0416 29.0462 34.0416 25.6975 34.0416 19M24.5416 8.70831C25.4758 7.74723 27.9616 3.95831 29.2916 3.95831C30.6216 3.95831 33.1075 7.74723 34.0416 8.70831M29.2916 4.74998V15.0416" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="font-mono text-xs text-subfg leading-loose tracking-[-0.03em]">Upload</div>
                    </div>
                    {/* Text input */}
                    <div className="h-[93px] flex items-start pt-0">
                      <div className="text-lg text-subfg font-sans">Type your request</div>
                    </div>
                    {/* Generate button */}
                    <div className="h-[39px] w-[154px] bg-fg text-inverse font-mono text-sm leading-loose flex items-center justify-center gap-2">
                      Generate
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Layout: Grid 105px + flex + 154px</div>
                  <div>Upload: Image files only</div>
                  <div>Preview: Image thumbnail</div>
                </div>
              </div>

              {/* Video Prompt Bar */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Video Prompt Bar</h3>
                <VideoPromptRail
                  onSubmit={(prompt, uploadResult) => console.log('Video prompt:', prompt, 'Upload result:', uploadResult)}
                />
                <div className="font-mono text-xs text-subfg leading-loose space-y-1 mt-lg">
                  <div>Layout: Grid 105px + flex + 154px</div>
                  <div>Upload: Video files only</div>
                  <div>Preview: Video with auto-play</div>
                  <div>Icon: Custom video upload icon</div>
                  <div>Error: "no video been uploaded"</div>
                </div>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Colors</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg">
              <div className="text-center">
                <div className="w-20 h-20 bg-bg border border-border rounded-xs mb-md mx-auto"></div>
                <div className="font-mono text-xs text-fg">#000000</div>
                <div className="font-mono text-xs text-subfg">Background</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-fg rounded-xs mb-md mx-auto"></div>
                <div className="font-mono text-xs text-fg">#FFFFFF</div>
                <div className="font-mono text-xs text-subfg">Foreground</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-subfg rounded-xs mb-md mx-auto"></div>
                <div className="font-mono text-xs text-fg">#4D565F</div>
                <div className="font-mono text-xs text-subfg">Gray</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-xs mb-md mx-auto"></div>
                <div className="font-mono text-xs text-fg">#8BBAF5</div>
                <div className="font-mono text-xs text-subfg">Blue</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-accent rounded-xs mb-md mx-auto"></div>
                <div className="font-mono text-xs text-fg">#EEB3FA</div>
                <div className="font-mono text-xs text-subfg">Pink</div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-red rounded-xs mb-md mx-auto"></div>
                <div className="font-mono text-xs text-fg">#F58B8B</div>
                <div className="font-mono text-xs text-subfg">Error</div>
              </div>
            </div>
          </section>

          {/* Error States */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Error States</h2>
            
            <div className="bg-panel p-xl rounded-xs border border-border">
              <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Form Errors</h3>
              
              {/* Prompt Bar with Error */}
              <div className="border border-fg p-lg rounded-sm w-full max-w-[600px] mb-lg">
                <div className="grid grid-cols-[105px_1fr_154px] gap-lg items-start h-[107px]">
                  <div className="h-[105px] w-[105px] border border-border rounded-xs flex flex-col items-center justify-center">
                    <div className="w-[38px] h-[38px] mb-2 text-subfg">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                    </div>
                    <div className="font-mono text-xs text-subfg leading-loose tracking-[-0.03em]">Upload</div>
                  </div>
                  <div className="h-[93px] flex items-start pt-0">
                    <div className="text-lg text-subfg font-sans">Type your request</div>
                  </div>
                  <div className="h-[39px] w-[154px] bg-fg text-inverse font-mono text-sm leading-loose flex items-center justify-center gap-2">
                    Generate
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              <div className="mt-lg py-md font-mono text-sm leading-loose" style={{color: '#F58B8B'}}>
                Error: no picture been uploaded
              </div>
              
              <div className="font-mono text-xs text-subfg leading-loose space-y-1 mt-lg">
                <div>Position: Below component with mt-lg</div>
                <div>Padding: py-md (12px vertical)</div>
                <div>Font: Replica Mono 14px</div>
                <div>Color: #F58B8B (exact hex value)</div>
                <div>Trigger: Form validation errors</div>
              </div>
            </div>
          </section>

          {/* Spacing Scale */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Spacing Scale</h2>
            
            <div className="space-y-md">
              {[
                { name: 'xs', value: '4px', class: 'w-1' },
                { name: 'sm', value: '8px', class: 'w-2' },
                { name: 'md', value: '12px', class: 'w-3' },
                { name: 'lg', value: '16px', class: 'w-4' },
                { name: 'xl', value: '24px', class: 'w-6' },
                { name: 'xxl', value: '32px', class: 'w-8' },
                { name: 'xxxl', value: '40px', class: 'w-10' },
              ].map(({ name, value, class: className }) => (
                <div key={name} className="flex items-center gap-md">
                  <div className={`h-4 bg-primary ${className}`}></div>
                  <div className="font-mono text-sm text-fg">{name}</div>
                  <div className="font-mono text-xs text-subfg">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Loaders & Progress */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Loaders & Progress</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              {/* Spinner Loader */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Spinner Loader</h3>
                <div className="flex justify-center mb-lg">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Size: 24×24px, Border: 2px</div>
                  <div>Color: Primary (#8BBAF5)</div>
                  <div>Animation: Spin (infinite)</div>
                  <div>Usage: Upload states, processing</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Progress Bar</h3>
                <div className="mb-lg">
                  <div className="w-full h-1 bg-subfg/20 overflow-hidden rounded">
                    <div className="h-full w-1/3 bg-fg animate-[progress_1.2s_ease_infinite]" />
                  </div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Height: 4px, Background: Gray 20%</div>
                  <div>Progress: White, animated</div>
                  <div>Animation: Sliding progress</div>
                  <div>Usage: Video generation status</div>
                </div>
              </div>

              {/* Loading Text */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Loading Text</h3>
                <div className="text-center mb-lg">
                  <div className="font-mono text-sm text-fg leading-loose">Processing...</div>
                  <div className="font-mono text-sm text-fg leading-loose">Generating…</div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Font: Replica Mono 14px</div>
                  <div>Color: White</div>
                  <div>Usage: Button states, status updates</div>
                </div>
              </div>
            </div>
          </section>

          {/* Error States */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Error States</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              {/* Error Text */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Error Text</h3>
                <div className="font-mono text-sm leading-loose mb-md whitespace-nowrap" style={{color: '#F58B8B'}}>
                  Error: no picture been uploaded
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Font: Replica Mono 14px</div>
                  <div>Color: #F58B8B (exact hex)</div>
                  <div>Usage: Form validation, upload errors</div>
                </div>
              </div>

              {/* Error Banner */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Error Banner</h3>
                <div className="w-full border border-[#F58B8B]/60 bg-[#F58B8B]/10 rounded-sm p-lg mb-lg">
                  <div className="font-mono text-sm text-fg leading-loose">Error</div>
                  <div className="text-sm text-subfg leading-loose">Video generation failed. Please try again.</div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Border: #F58B8B 60% opacity</div>
                  <div>Background: #F58B8B 10% opacity</div>
                  <div>Usage: Stage errors, API failures</div>
                </div>
              </div>
            </div>
          </section>

          {/* Status Indicators */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Status Indicators</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-xl">
              {/* Idle State */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Idle State</h3>
                <div className="text-center mb-lg">
                  <div className="font-mono text-md tracking-[-0.03em] text-fg leading-loose">Your video will appear here</div>
                  <div className="font-mono text-sm text-subfg leading-loose">Send your request first</div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Primary: 16px, Secondary: 14px</div>
                  <div>Usage: Empty stage state</div>
                </div>
              </div>

              {/* Success State */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Success State</h3>
                <div className="w-full aspect-video bg-border rounded-xs flex items-center justify-center mb-lg">
                  <div className="text-subfg text-sm">Video Preview</div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Shows generated content</div>
                  <div>Usage: Completed jobs</div>
                </div>
              </div>

              {/* Running State */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Running State</h3>
                <div className="flex justify-center mb-lg">
                  <div className="w-1/2 h-1 bg-subfg/20 overflow-hidden rounded">
                    <div className="h-full w-1/3 bg-fg animate-[progress_1.2s_ease_infinite]" />
                  </div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Shows progress animation</div>
                  <div>Usage: Job processing</div>
                </div>
              </div>

              {/* Failed State */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Failed State</h3>
                <div className="w-full border border-[#F58B8B]/60 bg-[#F58B8B]/10 rounded-sm p-md mb-lg">
                  <div className="font-mono text-xs text-fg">Error</div>
                  <div className="text-xs text-subfg">Generation failed</div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Shows error details</div>
                  <div>Usage: Failed jobs</div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive States */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Interactive States</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              {/* Hover States */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Hover Effects</h3>
                <div className="space-y-md mb-lg">
                  <div className="h-9 px-4 border border-fg rounded-full text-xs font-mono text-fg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    Hover Me
                  </div>
                  <div className="h-[77px] w-full px-lg py-md rounded-xs border border-border flex items-center gap-md hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="w-[48px] h-[48px] rounded-sm bg-primary flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="text-lg text-fg font-sans">Card Hover</div>
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Effect: White 10% opacity overlay</div>
                  <div>Transition: smooth color change</div>
                  <div>Usage: All interactive elements</div>
                </div>
              </div>

              {/* Focus States */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Focus States</h3>
                <div className="space-y-md mb-lg">
                  <input 
                    className="w-full h-9 px-3 bg-transparent border border-border rounded-xs text-sm font-sans focus:border-primary focus:outline-none transition-colors" 
                    placeholder="Focus me"
                  />
                  <button className="h-9 px-4 bg-fg text-inverse font-mono text-sm rounded-xs focus:ring-2 focus:ring-primary focus:outline-none">
                    Button Focus
                  </button>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Border: Changes to primary color</div>
                  <div>Ring: 2px primary color (buttons)</div>
                  <div>Usage: Form inputs, buttons</div>
                </div>
              </div>

              {/* Disabled States */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Disabled States</h3>
                <div className="space-y-md mb-lg">
                  <button className="h-9 px-4 bg-fg text-inverse font-mono text-sm rounded-xs opacity-50 cursor-not-allowed" disabled>
                    Disabled Button
                  </button>
                  <input 
                    className="w-full h-9 px-3 bg-transparent border border-border rounded-xs text-sm font-sans opacity-50 cursor-not-allowed" 
                    placeholder="Disabled input"
                    disabled
                  />
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Opacity: 50% for all elements</div>
                  <div>Cursor: not-allowed</div>
                  <div>Usage: Unavailable actions</div>
                </div>
              </div>
            </div>
          </section>

          {/* Animations */}
          <section className="space-y-xl">
            <h2 className="text-xl text-subfg font-sans leading-snug">Animations</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              {/* Transitions */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Transitions</h3>
                <div className="space-y-md mb-lg">
                  <div className="w-16 h-16 bg-primary rounded-xs transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer"></div>
                  <div className="text-sm text-subfg">Hover to see transition</div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Duration: 300ms (standard)</div>
                  <div>Easing: ease-in-out</div>
                  <div>Properties: colors, transforms</div>
                  <div>Usage: Hover effects, state changes</div>
                </div>
              </div>

              {/* Keyframe Animations */}
              <div className="bg-panel p-xl rounded-xs border border-border">
                <h3 className="text-lg text-fg font-sans leading-snug mb-lg">Keyframe Animations</h3>
                <div className="flex justify-center space-x-4 mb-lg">
                  <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="font-mono text-xs text-subfg leading-loose space-y-1">
                  <div>Pulse: Opacity fade in/out</div>
                  <div>Bounce: Vertical movement</div>
                  <div>Spin: 360° rotation</div>
                  <div>Usage: Loading states, attention</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
