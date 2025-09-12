'use client'

import { Button } from '../design-system/Button'

interface TopBarProps {
  onGetAPIClick?: () => void
}

export function TopBar({ onGetAPIClick }: TopBarProps) {
  return (
    <div className="flex items-center">
      {/* Blue circle */}
      <img 
        src="/user_icon.png" 
        alt="User" 
        className="w-9 h-9 rounded-full mr-3 object-cover"
      />
      
      {/* Get API button */}
      <div className="relative w-[110px] h-[36px]">
        {/* Border container - fixed, no hover */}
        <div 
          className="absolute w-[110px] h-[36px] left-0 top-0 border border-white rounded-[40px] bg-transparent pointer-events-none"
          style={{ boxSizing: 'border-box' }}
        ></div>
        {/* Clickable button with inner hover effect */}
        <button
          onClick={onGetAPIClick}
          className="absolute left-0 right-0 top-0 bottom-0 font-mono text-[12px] leading-[141%] flex items-center justify-center text-white bg-transparent rounded-[40px] transition-colors"
          style={{ textAlign: 'center' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Get API
        </button>
      </div>
    </div>
  )
}
