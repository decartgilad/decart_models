import { Button, Badge } from '@/ui/design-system'
import { DecartLogo } from '@/components/DecartLogo'
import Link from 'next/link'

// Mock model config for Splice landing page
const spliceModel = {
  id: 'splice',
  slug: 'splice',
  name: 'Splice',
  description: 'Advanced video-to-video AI transformation technology',
  icon: '/fav_splice.png',
  enabled: true,
  code: 'Splice'
}

export default function SpliceLandingPage() {
  return (
    <div className="min-h-screen bg-bg text-fg relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-border/50 backdrop-blur-sm bg-bg/80">
        <div className="max-w-7xl mx-auto px-xl py-lg">
          <div className="flex items-center justify-between">
            <DecartLogo />
            <div className="flex items-center gap-lg">
              <Link href="/models" className="text-subfg hover:text-fg transition-colors">
                Models
              </Link>
              <Link href="/models/splice">
                <Button variant="primary" size="sm">
                  Try Splice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-xl py-16">
        <div className="text-center space-y-8">
          {/* Demo Video */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="relative w-[960px] h-[540px] overflow-hidden shadow-2xl">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ outline: 'none', border: 'none' }}
                >
                  <source src="/exmp.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Main Title with Gradient */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl font-medium bg-gradient-to-r from-fg via-primary to-accent bg-clip-text text-transparent leading-none tracking-tight">
              Splice
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-medium text-fg leading-tight">
              Transform any video with 
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent"> Lucy14b precision</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-subfg leading-relaxed text-left">
                Splice revolutionizes video content creation by seamlessly transforming existing videos 
                into new visual narratives. Whether you're changing characters, environments, or entire scenes, 
                Splice maintains the original motion and timing while applying stunning AI-generated visuals.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
            <Link href="/models/splice">
              <Button variant="primary" size="lg">
                Start Creating
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              <span className="flex items-center gap-3">
                Watch Demo
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </section>


      {/* Video Examples Section */}
      <section className="max-w-6xl mx-auto px-xl py-xxl">
        <div className="text-center mb-xl">
          <h2 className="text-[22px] leading-[1.31] text-fg mb-md">
            See Splice in Action
          </h2>
          <p className="text-subfg">
            Examples of video transformations powered by Splice AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Before/After Example 1 */}
          <div className="space-y-md">
            <div className="flex items-center gap-sm mb-sm">
              <Badge variant="secondary">Before</Badge>
              <span className="text-subfg">→</span>
              <Badge variant="primary">After</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-md">
              {/* Before Video */}
              <div className="aspect-[9/16] rounded-md overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/before1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* After Video */}
              <div className="aspect-[9/16] rounded-md overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/after1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            
            <div className="text-sm text-subfg">
              <strong className="text-fg">Effortless Outfit Changes:</strong> Transform any person's clothing instantly while preserving their natural movements and expressions.
            </div>
          </div>

          {/* Before/After Example 2 */}
          <div className="space-y-md">
            <div className="flex items-center gap-sm mb-sm">
              <Badge variant="secondary">Before</Badge>
              <span className="text-subfg">→</span>
              <Badge variant="primary">After</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-md">
              {/* Before Video */}
              <div className="aspect-[9/16] rounded-md overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/before2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* After Video */}
              <div className="aspect-[9/16] rounded-md overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/after2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            
            <div className="text-sm text-subfg">
              <strong className="text-fg">Style Transformation:</strong> Change from casual wear to formal attire, or switch between completely different fashion styles seamlessly.
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-xl py-xxl">
        <div className="text-center mb-xl">
          <h2 className="text-[22px] leading-[1.31] text-fg mb-md">
            How Splice Works
          </h2>
          <p className="text-subfg">
            Simple steps to transform your videos with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          <div className="text-center space-y-md">
            <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center group hover:bg-primary/20 transition-colors duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent text-inverse text-xs font-bold rounded-full flex items-center justify-center">1</span>
            </div>
            <h3 className="text-lg text-fg">Upload Your Video</h3>
            <p className="text-subfg text-sm text-left">
              Upload any video file up to 100MB. We support MP4, MOV, AVI, WebM and more formats.
            </p>
          </div>

          <div className="text-center space-y-md">
            <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center relative group hover:bg-primary/20 transition-colors duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent text-inverse text-xs font-bold rounded-full flex items-center justify-center">2</span>
            </div>
            <h3 className="text-lg text-fg">Describe the Change</h3>
            <p className="text-subfg text-sm text-left">
              Write a prompt describing how you want to transform the video. Be specific about characters, scenes, or styles.
            </p>
          </div>

          <div className="text-center space-y-md">
            <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center relative group hover:bg-primary/20 transition-colors duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent text-inverse text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </div>
            <h3 className="text-lg text-fg">Get Your Result</h3>
            <p className="text-subfg text-sm text-left">
              Our AI processes your video and returns a transformed version maintaining all original motion and timing.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="max-w-6xl mx-auto px-xl py-xxl">
        <div className="text-center mb-xl">
          <h2 className="text-[22px] leading-[1.31] text-fg mb-md">
            Technical Specifications
          </h2>
        </div>

        {/* Data Model Image */}
        <div className="flex justify-center mb-xl">
          <div className="relative max-w-[960px] rounded-lg shadow-2xl">
            <img 
              src="/datamodel.webp" 
              alt="Splice Data Model Architecture"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
          <div className="space-y-lg">
            <div>
              <h3 className="text-lg text-fg mb-sm">Supported Formats</h3>
              <div className="space-y-xs">
                <p className="text-subfg text-sm text-left">• MP4, AVI, MOV, MKV, WebM</p>
                <p className="text-subfg text-sm text-left">• Maximum file size: 100MB</p>
                <p className="text-subfg text-sm text-left">• Both landscape and portrait orientations</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg text-fg mb-sm">Output Quality</h3>
              <div className="space-y-xs">
                <p className="text-subfg text-sm text-left">• Landscape: 1280 × 704 pixels</p>
                <p className="text-subfg text-sm text-left">• Portrait: 704 × 1280 pixels</p>
                <p className="text-subfg text-sm text-left">• High-quality MP4 output</p>
              </div>
            </div>
          </div>

          <div className="space-y-lg">
            <div>
              <h3 className="text-lg text-fg mb-sm">Processing Time</h3>
              <div className="space-y-xs">
                <p className="text-subfg text-sm text-left">• Typically 2-5 minutes per video</p>
                <p className="text-subfg text-sm text-left">• Depends on video length and complexity</p>
                <p className="text-subfg text-sm text-left">• Real-time progress updates</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg text-fg mb-sm">AI Features</h3>
              <div className="space-y-xs">
                <p className="text-subfg text-sm text-left">• Automatic prompt enhancement</p>
                <p className="text-subfg text-sm text-left">• Motion preservation technology</p>
                <p className="text-subfg text-sm text-left">• Advanced scene understanding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Video */}
      <section className="max-w-6xl mx-auto px-xl py-xxl">
        <div className="flex justify-center mb-xl">
          <div className="relative">
            <div className="relative w-[960px] h-[540px] overflow-hidden shadow-2xl">
              <video 
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                style={{ outline: 'none', border: 'none' }}
              >
                <source src="/Splice_v01.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Generation Speed */}
      <section className="max-w-6xl mx-auto px-xl">
        <div className="text-center mb-xl">
          <h2 className="text-[22px] leading-[1.31] text-fg mb-md">
            Lightning Fast Generation
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-xl text-subfg leading-relaxed">
              Transform your videos in just <span className="text-primary font-medium">6 seconds</span> with our optimized AI pipeline
            </p>
            <div className="max-w-3xl mx-auto">
              <p className="text-subfg leading-relaxed text-left">
                Our cutting-edge infrastructure processes video transformations at unprecedented speed. 
                While traditional video editing takes hours, Splice delivers professional-quality results 
                in seconds. This breakthrough in processing speed means you can iterate quickly, 
                experiment with different styles, and bring your creative vision to life without waiting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Example Video */}
      <section className="max-w-6xl mx-auto px-xl">
        <div className="flex justify-center mb-xl">
          <div className="relative">
            <div className="relative w-[960px] h-[540px] overflow-hidden shadow-2xl">
              <video 
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                style={{ outline: 'none', border: 'none' }}
              >
                <source src="/Splice_v02.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-xl">
        <div className="bg-panel border border-border rounded-lg p-xl text-center">
          <h2 className="text-[22px] leading-[1.31] text-fg mb-md">
            Ready to Transform Your Videos?
          </h2>
          <div className="max-w-2xl mx-auto mb-lg">
            <p className="text-subfg text-left">
              Join creators worldwide who are using Splice to bring their video ideas to life. 
              Start with your first transformation today.
            </p>
          </div>
          
          <div className="flex justify-center gap-md">
            <Link href="/models/splice">
              <Button variant="primary" size="lg">
                Try Splice Now
              </Button>
            </Link>
            <Link href="/models">
              <Button variant="secondary" size="lg">
                Explore Other Models
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-xxl">
        <div className="max-w-6xl mx-auto px-xl py-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-md">
              <span className="text-subfg text-sm">© 2024 Decart AI</span>
            </div>
            <div className="flex items-center gap-md text-sm text-subfg">
              <Link href="/models" className="hover:text-fg transition-colors">
                All Models
              </Link>
              <Link href="#" className="hover:text-fg transition-colors">
                Documentation
              </Link>
              <Link href="#" className="hover:text-fg transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


