import { TopBarWrapper } from '@/components/TopBarWrapper'
import { SidebarModels } from '@/components/navigation/SidebarModels'
import { DecartLogo } from '@/components/DecartLogo'

export default function ModelsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Top Bar */}
      <div className="fixed inset-x-0 top-0 z-40 bg-bg border-border">
        <div className="px-xl relative">
          <div className="flex items-center justify-between py-xl">
            {/* Decart logo - left */}
            <DecartLogo />
            
            {/* TopBar - right */}
            <TopBarWrapper />
          </div>
          {/* Vertical line connecting to sidebar */}
          <div className="absolute bottom-0 w-px h-px  translate-y-full" style={{ left: 'calc(24px + 461px)', height: 'calc(100vh - 96px)' }}></div>
        </div>
      </div>

      {/* Main content with top padding */}
      <div className="pt-24 flex" style={{ height: 'calc(100vh - 96px)' }}>
        <div className="flex w-full px-xl">
          <SidebarModels />
          <main className="flex-1 py-xl pl-xl overflow-hidden flex flex-col justify-start max-w-5xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
