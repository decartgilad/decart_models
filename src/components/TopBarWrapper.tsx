'use client'

import { TopBar } from '@/ui/patterns/TopBar'

export function TopBarWrapper() {
  const handleGetAPIClick = () => {
    alert('Get API clicked!')
  }

  return <TopBar onGetAPIClick={handleGetAPIClick} />
}
