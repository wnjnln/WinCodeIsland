import { useSetting } from '../hooks/useSetting'
import { useI18n } from '../hooks/useI18n'
import { SettingRow, Switch, Select } from '../components/SettingRow'

export function GeneralPage() {
  const { t } = useI18n()
  const [language, setLanguage] = useSetting('language', 'zh-CN')
  const [launchAtLogin, setLaunchAtLogin] = useSetting('launchAtLogin', false)
  const [allowHorizontalDrag, setAllowHorizontalDrag] = useSetting('allowHorizontalDrag', false)
  const [displayChoice, setDisplayChoice] = useSetting('displayChoice', 'auto')

  return (
    <div>
      <h2 className="text-[16px] font-semibold mb-1">{t('general.title')}</h2>
      <p className="text-[11px] text-white/40 mb-5">{t('general.subtitle')}</p>

      <SettingRow label={t('language.label')} description={t('language.desc')}>
        <Select
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'system', label: t('language.system') },
            { value: 'zh-CN', label: t('language.zh') },
            { value: 'en', label: t('language.en') },
          ]}
        />
      </SettingRow>

      <SettingRow label={t('launchAtLogin.label')} description={t('launchAtLogin.desc')}>
        <Switch checked={launchAtLogin} onChange={setLaunchAtLogin} />
      </SettingRow>

      <SettingRow label={t('allowHorizontalDrag.label')} description={t('allowHorizontalDrag.desc')}>
        <Switch checked={allowHorizontalDrag} onChange={setAllowHorizontalDrag} />
      </SettingRow>

      <SettingRow label={t('display.label')} description={t('display.desc')}>
        <Select
          value={displayChoice}
          onChange={setDisplayChoice}
          options={[
            { value: 'auto', label: t('display.auto') },
            { value: 'screen_0', label: 'Screen 1' },
            { value: 'screen_1', label: 'Screen 2' },
          ]}
        />
      </SettingRow>
    </div>
  )
}
