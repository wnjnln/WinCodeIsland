import { useState } from 'react'
import { GeneralPage } from './pages/GeneralPage'
import { BehaviorPage } from './pages/BehaviorPage'
import { AppearancePage } from './pages/AppearancePage'
import { SoundPage } from './pages/SoundPage'
import { HooksPage } from './pages/HooksPage'
import { AboutPage } from './pages/AboutPage'

type SettingsTab =
  | 'general'
  | 'behavior'
  | 'appearance'
  | 'sound'
  | 'hooks'
  | 'about'

interface NavItem {
  id: SettingsTab
  label: string
  labelZh: string
}

const navItems: NavItem[] = [
  { id: 'general', label: 'General', labelZh: '常规' },
  { id: 'behavior', label: 'Behavior', labelZh: '行为' },
  { id: 'appearance', label: 'Appearance', labelZh: '外观' },
  { id: 'sound', label: 'Sound', labelZh: '声音' },
  { id: 'hooks', label: 'Hooks', labelZh: 'Hooks' },
  { id: 'about', label: 'About', labelZh: '关于' },
]

export function SettingsApp() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  const renderPage = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralPage />
      case 'behavior':
        return <BehaviorPage />
      case 'appearance':
        return <AppearancePage />
      case 'sound':
        return <SoundPage />
      case 'hooks':
        return <HooksPage />
      case 'about':
        return <AboutPage />
      default:
        return <GeneralPage />
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#1a1a1a] text-white/90 overflow-hidden select-none">
      {/* Sidebar */}
      <div className="w-[180px] shrink-0 bg-[#141414] border-r border-white/5 flex flex-col py-3">
        {navItems.map((item) => {
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mx-2 px-3 py-[6px] rounded-md text-left text-[13px] transition-colors ${
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <span className="opacity-60 mr-2">{item.label}</span>
              {item.labelZh}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderPage()}
      </div>
    </div>
  )
}
