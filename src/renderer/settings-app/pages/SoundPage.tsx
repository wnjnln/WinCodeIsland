import { useSetting } from '../hooks/useSetting'
import { useI18n } from '../hooks/useI18n'
import { SettingRow, Switch, Slider } from '../components/SettingRow'

export function SoundPage() {
  const { t } = useI18n()
  const [soundEnabled, setSoundEnabled] = useSetting('soundEnabled', true)
  const [volume, setVolume] = useSetting('volume', 50)
  const [soundEventStart, setSoundEventStart] = useSetting('soundEventStart', true)
  const [soundEventComplete, setSoundEventComplete] = useSetting('soundEventComplete', true)
  const [soundEventError, setSoundEventError] = useSetting('soundEventError', true)
  const [soundEventApproval, setSoundEventApproval] = useSetting('soundEventApproval', true)
  const [soundEventSubmit, setSoundEventSubmit] = useSetting('soundEventSubmit', false)
  const [soundEventBoot, setSoundEventBoot] = useSetting('soundEventBoot', true)

  return (
    <div>
      <h2 className="text-[16px] font-semibold mb-1">{t('sound.title')}</h2>
      <p className="text-[11px] text-white/40 mb-5">{t('sound.subtitle')}</p>

      <SettingRow label={t('soundEnabled.label')} description={t('soundEnabled.desc')}>
        <Switch checked={soundEnabled} onChange={setSoundEnabled} />
      </SettingRow>

      <SettingRow label={t('volume.label')} description={t('volume.desc')}>
        <Slider value={volume} min={0} max={100} step={5} onChange={setVolume} suffix="%" />
      </SettingRow>

      <div className="mt-4 mb-2 text-[12px] font-medium text-white/60">{t('soundEvents.title')}</div>

      <SettingRow label={t('soundEventStart.label')} description={t('soundEventStart.desc')}>
        <Switch checked={soundEventStart} onChange={setSoundEventStart} />
      </SettingRow>

      <SettingRow label={t('soundEventComplete.label')} description={t('soundEventComplete.desc')}>
        <Switch checked={soundEventComplete} onChange={setSoundEventComplete} />
      </SettingRow>

      <SettingRow label={t('soundEventError.label')} description={t('soundEventError.desc')}>
        <Switch checked={soundEventError} onChange={setSoundEventError} />
      </SettingRow>

      <div className="mt-4 mb-2 text-[12px] font-medium text-white/60">{t('interactionEvents.title')}</div>

      <SettingRow label={t('soundEventApproval.label')} description={t('soundEventApproval.desc')}>
        <Switch checked={soundEventApproval} onChange={setSoundEventApproval} />
      </SettingRow>

      <SettingRow label={t('soundEventSubmit.label')} description={t('soundEventSubmit.desc')}>
        <Switch checked={soundEventSubmit} onChange={setSoundEventSubmit} />
      </SettingRow>

      <div className="mt-4 mb-2 text-[12px] font-medium text-white/60">{t('systemEvents.title')}</div>

      <SettingRow label={t('soundEventBoot.label')} description={t('soundEventBoot.desc')}>
        <Switch checked={soundEventBoot} onChange={setSoundEventBoot} />
      </SettingRow>
    </div>
  )
}
