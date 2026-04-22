import { useSetting } from '../hooks/useSetting'
import { SettingRow, Switch, Select } from '../components/SettingRow'

export function GeneralPage() {
  const [language, setLanguage] = useSetting('language', 'zh-CN')
  const [launchAtLogin, setLaunchAtLogin] = useSetting('launchAtLogin', false)
  const [allowHorizontalDrag, setAllowHorizontalDrag] = useSetting('allowHorizontalDrag', false)
  const [displayChoice, setDisplayChoice] = useSetting('displayChoice', 'auto')

  return (
    <div>
      <h2 className="text-[16px] font-semibold mb-1">General / 常规</h2>
      <p className="text-[11px] text-white/40 mb-5">基础应用配置</p>

      <SettingRow label="Language / 语言" description="应用显示语言">
        <Select
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'system', label: 'System / 跟随系统' },
            { value: 'zh-CN', label: '简体中文' },
            { value: 'en', label: 'English' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Launch at Login / 开机启动" description="系统登录时自动启动应用">
        <Switch checked={launchAtLogin} onChange={setLaunchAtLogin} />
      </SettingRow>

      <SettingRow label="Allow Horizontal Drag / 允许拖动" description="沿屏幕顶部左右拖动面板位置">
        <Switch checked={allowHorizontalDrag} onChange={setAllowHorizontalDrag} />
      </SettingRow>

      <SettingRow label="Display / 显示器" description="选择面板显示在哪块屏幕上">
        <Select
          value={displayChoice}
          onChange={setDisplayChoice}
          options={[
            { value: 'auto', label: 'Auto / 自动' },
            { value: 'screen_0', label: 'Screen 1' },
            { value: 'screen_1', label: 'Screen 2' },
          ]}
        />
      </SettingRow>
    </div>
  )
}
