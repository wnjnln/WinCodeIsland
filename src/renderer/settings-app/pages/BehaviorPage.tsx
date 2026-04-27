import { useSetting } from '../hooks/useSetting'
import { useI18n } from '../hooks/useI18n'
import { SettingRow, Switch, Select } from '../components/SettingRow'

export function BehaviorPage() {
  const { t } = useI18n()
  const [hideInFullscreen, setHideInFullscreen] = useSetting('hideInFullscreen', true)
  const [hideWhenNoSession, setHideWhenNoSession] = useSetting('hideWhenNoSession', false)
  const [smartSuppress, setSmartSuppress] = useSetting('smartSuppress', true)
  const [collapseOnMouseLeave, setCollapseOnMouseLeave] = useSetting('collapseOnMouseLeave', true)
  const [idleSessionCleanup, setIdleSessionCleanup] = useSetting('idleSessionCleanup', 30)
  const [sessionRotationInterval, setSessionRotationInterval] = useSetting('sessionRotationInterval', 5)

  return (
    <div>
      <h2 className="text-[16px] font-semibold mb-1">{t('behavior.title')}</h2>
      <p className="text-[11px] text-white/40 mb-5">{t('behavior.subtitle')}</p>

      <SettingRow label={t('hideInFullscreen.label')} description={t('hideInFullscreen.desc')}>
        <Switch checked={hideInFullscreen} onChange={setHideInFullscreen} />
      </SettingRow>

      <SettingRow label={t('hideWhenNoSession.label')} description={t('hideWhenNoSession.desc')}>
        <Switch checked={hideWhenNoSession} onChange={setHideWhenNoSession} />
      </SettingRow>

      <SettingRow label={t('smartSuppress.label')} description={t('smartSuppress.desc')}>
        <Switch checked={smartSuppress} onChange={setSmartSuppress} />
      </SettingRow>

      <SettingRow label={t('collapseOnMouseLeave.label')} description={t('collapseOnMouseLeave.desc')}>
        <Switch checked={collapseOnMouseLeave} onChange={setCollapseOnMouseLeave} />
      </SettingRow>

      <SettingRow label={t('idleSessionCleanup.label')} description={t('idleSessionCleanup.desc')}>
        <Select
          value={idleSessionCleanup}
          onChange={setIdleSessionCleanup}
          options={[
            { value: 0, label: t('idleSessionCleanup.never') },
            { value: 10, label: '10 min' },
            { value: 30, label: '30 min' },
            { value: 60, label: '1 hour' },
            { value: 120, label: '2 hours' },
          ]}
        />
      </SettingRow>

      <SettingRow label={t('sessionRotation.label')} description={t('sessionRotation.desc')}>
        <Select
          value={sessionRotationInterval}
          onChange={setSessionRotationInterval}
          options={[
            { value: 3, label: '3 sec' },
            { value: 5, label: '5 sec' },
            { value: 8, label: '8 sec' },
            { value: 10, label: '10 sec' },
          ]}
        />
      </SettingRow>
    </div>
  )
}
