import { useSetting } from '../hooks/useSetting'
import { useI18n } from '../hooks/useI18n'
import { SettingRow, Select, Slider, Switch } from '../components/SettingRow'

export function AppearancePage() {
  const { t } = useI18n()
  const [maxVisibleSessions, setMaxVisibleSessions] = useSetting('maxVisibleSessions', 5)
  const [collapsedWidthScale, setCollapsedWidthScale] = useSetting('collapsedWidthScale', 100)
  const [notchHeightMode, setNotchHeightMode] = useSetting('notchHeightMode', 'matchNotch')
  const [customNotchHeight, setCustomNotchHeight] = useSetting('customNotchHeight', 37)
  const [contentFontSize, setContentFontSize] = useSetting('contentFontSize', 11)
  const [aiMessageLines, setAiMessageLines] = useSetting('aiMessageLines', 1)
  const [showAgentDetails, setShowAgentDetails] = useSetting('showAgentDetails', false)

  return (
    <div>
      <h2 className="text-[16px] font-semibold mb-1">{t('appearance.title')}</h2>
      <p className="text-[11px] text-white/40 mb-5">{t('appearance.subtitle')}</p>

      <SettingRow label={t('maxVisibleSessions.label')} description={t('maxVisibleSessions.desc')}>
        <Select
          value={maxVisibleSessions}
          onChange={setMaxVisibleSessions}
          options={[
            { value: 3, label: '3' },
            { value: 5, label: '5' },
            { value: 8, label: '8' },
            { value: 10, label: '10' },
            { value: 99, label: t('maxVisibleSessions.unlimited') },
          ]}
        />
      </SettingRow>

      <SettingRow label={t('collapsedWidthScale.label')} description={t('collapsedWidthScale.desc')}>
        <Slider
          value={collapsedWidthScale}
          min={50}
          max={150}
          step={10}
          onChange={setCollapsedWidthScale}
          suffix="%"
        />
      </SettingRow>

      <SettingRow label={t('notchHeightMode.label')} description={t('notchHeightMode.desc')}>
        <Select
          value={notchHeightMode}
          onChange={setNotchHeightMode}
          options={[
            { value: 'matchNotch', label: t('notchHeightMode.matchNotch') },
            { value: 'matchMenuBar', label: t('notchHeightMode.matchMenuBar') },
            { value: 'custom', label: t('notchHeightMode.custom') },
          ]}
        />
      </SettingRow>

      {notchHeightMode === 'custom' && (
        <SettingRow label={t('customHeight.label')} description={t('customHeight.desc')}>
          <Slider
            value={customNotchHeight}
            min={15}
            max={60}
            step={1}
            onChange={setCustomNotchHeight}
            suffix=""
          />
        </SettingRow>
      )}

      <SettingRow label={t('contentFontSize.label')} description={t('contentFontSize.desc')}>
        <Select
          value={contentFontSize}
          onChange={setContentFontSize}
          options={[
            { value: 10, label: '10px' },
            { value: 11, label: '11px' },
            { value: 12, label: '12px' },
            { value: 13, label: '13px' },
          ]}
        />
      </SettingRow>

      <SettingRow label={t('aiMessageLines.label')} description={t('aiMessageLines.desc')}>
        <Select
          value={aiMessageLines}
          onChange={setAiMessageLines}
          options={[
            { value: 0, label: t('aiMessageLines.unlimited') },
            { value: 1, label: '1 line' },
            { value: 2, label: '2 lines' },
            { value: 3, label: '3 lines' },
            { value: 5, label: '5 lines' },
          ]}
        />
      </SettingRow>

      <SettingRow label={t('showAgentDetails.label')} description={t('showAgentDetails.desc')}>
        <Switch checked={showAgentDetails} onChange={setShowAgentDetails} />
      </SettingRow>
    </div>
  )
}
