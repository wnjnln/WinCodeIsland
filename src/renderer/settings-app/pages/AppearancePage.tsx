import { useSetting } from '../hooks/useSetting'
import { SettingRow, Select, Slider } from '../components/SettingRow'

export function AppearancePage() {
  const [maxVisibleSessions, setMaxVisibleSessions] = useSetting('maxVisibleSessions', 5)
  const [collapsedWidthScale, setCollapsedWidthScale] = useSetting('collapsedWidthScale', 100)
  const [notchHeightMode, setNotchHeightMode] = useSetting('notchHeightMode', 'matchNotch')
  const [customNotchHeight, setCustomNotchHeight] = useSetting('customNotchHeight', 37)
  const [contentFontSize, setContentFontSize] = useSetting('contentFontSize', 11)
  const [aiMessageLines, setAiMessageLines] = useSetting('aiMessageLines', 1)
  const [showAgentDetails, setShowAgentDetails] = useSetting('showAgentDetails', false)

  return (
    <div>
      <h2 className="text-[16px] font-semibold mb-1">Appearance / 外观</h2>
      <p className="text-[11px] text-white/40 mb-5">面板尺寸、字体和内容显示配置</p>

      <SettingRow label="Max Visible Sessions / 最大会话数" description="面板中最多显示的会话数量">
        <Select
          value={maxVisibleSessions}
          onChange={setMaxVisibleSessions}
          options={[
            { value: 3, label: '3' },
            { value: 5, label: '5' },
            { value: 8, label: '8' },
            { value: 10, label: '10' },
            { value: 99, label: 'Unlimited / 无限制' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Island Width Scale / 宽度缩放" description="折叠状态下岛的宽度百分比">
        <Slider
          value={collapsedWidthScale}
          min={50}
          max={150}
          step={10}
          onChange={setCollapsedWidthScale}
          suffix="%"
        />
      </SettingRow>

      <SettingRow label="Top Bar Height / 顶部栏高度" description="面板顶部对齐方式">
        <Select
          value={notchHeightMode}
          onChange={setNotchHeightMode}
          options={[
            { value: 'matchNotch', label: 'Match Notch / 匹配刘海' },
            { value: 'matchMenuBar', label: 'Match Menu Bar / 匹配菜单栏' },
            { value: 'custom', label: 'Custom / 自定义' },
          ]}
        />
      </SettingRow>

      {notchHeightMode === 'custom' && (
        <SettingRow label="Custom Height / 自定义高度" description="面板顶部高度 (pt)">
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

      <SettingRow label="Content Font Size / 内容字体" description="会话卡片等内容区域字体大小">
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

      <SettingRow label="AI Reply Lines / AI回复行数" description="每个会话显示的 AI 回复行数">
        <Select
          value={aiMessageLines}
          onChange={setAiMessageLines}
          options={[
            { value: 0, label: 'Unlimited / 无限制' },
            { value: 1, label: '1 line' },
            { value: 2, label: '2 lines' },
            { value: 3, label: '3 lines' },
            { value: 5, label: '5 lines' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Show Agent Details / 显示详情" description="在会话卡片中显示 agent 活动详情">
        <div
          onClick={() => setShowAgentDetails(!showAgentDetails)}
          className={`w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer ${
            showAgentDetails ? 'bg-[#66FF80]/80' : 'bg-white/15'
          }`}
        >
          <span
            className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
              showAgentDetails ? 'left-[22px]' : 'left-[2px]'
            }`}
          />
        </div>
      </SettingRow>
    </div>
  )
}
