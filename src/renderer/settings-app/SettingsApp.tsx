import { useState, useEffect } from 'react'
import { GeneralPage } from './pages/GeneralPage'
import { BehaviorPage } from './pages/BehaviorPage'
import { AppearancePage } from './pages/AppearancePage'
import { SoundPage } from './pages/SoundPage'
import { HooksPage } from './pages/HooksPage'
import { AboutPage } from './pages/AboutPage'
import { useI18n } from './hooks/useI18n'
import { AppLogo } from '../components/AppLogo'

type SettingsTab =
  | 'general'
  | 'behavior'
  | 'appearance'
  | 'sound'
  | 'hooks'
  | 'about'

interface NavItem {
  id: SettingsTab
  labelKey: string
}

const navItems: NavItem[] = [
  { id: 'general', labelKey: 'nav.general' },
  { id: 'behavior', labelKey: 'nav.behavior' },
  { id: 'appearance', labelKey: 'nav.appearance' },
  { id: 'sound', labelKey: 'nav.sound' },
  { id: 'hooks', labelKey: 'nav.hooks' },
  { id: 'about', labelKey: 'nav.about' },
]

function NotchDivider() {
  return (
    <div
      className="shrink-0 w-full"
      style={{
        height: '0.5px',
        backgroundImage: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.25) 80%, transparent 100%)',
        backgroundSize: '8px 0.5px',
        backgroundRepeat: 'repeat-x',
      }}
    />
  )
}

export function SettingsApp() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const { t } = useI18n()

  useEffect(() => {
    document.title = t('window.settingsTitle')
    window.ipcAPI.setWindowTitle(t('window.settingsTitle'))
  }, [t])

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
    <div className="flex h-screen w-full bg-black text-white/90 overflow-hidden select-none rounded-b-2xl">
      {/* Sidebar */}
      <div className="w-[180px] shrink-0 flex flex-col">
        {/* Logo header */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-3">
          <AppLogo size={28} />
          <span className="text-[13px] font-semibold text-white/90">Settings</span>
        </div>

        <NotchDivider />

        {/* Nav */}
        <div className="flex-1 flex flex-col py-2 px-2">
          {navItems.map((item) => {
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-[6px] rounded-lg text-left text-[13px] transition-colors ${
                  active
                    ? 'bg-white/10 text-[#66FF80] font-medium'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {t(item.labelKey)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 w-px bg-white/5" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5">
        {renderPage()}
      </div>
    </div>
  )
}
