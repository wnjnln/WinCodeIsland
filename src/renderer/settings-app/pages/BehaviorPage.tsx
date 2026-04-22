import { useSetting } from '../hooks/useSetting'
import { SettingRow, Switch, Select } from '../components/SettingRow'

export function BehaviorPage() {
  const [hideInFullscreen, setHideInFullscreen] = useSetting('hideInFullscreen', true)
  const [hideWhenNoSession, setHideWhenNoSession] = useSetting('hideWhenNoSession', false)
  const [smartSuppress, setSmartSuppress] = useSetting('smartSuppress', true)
  const [collapseOnMouseLeave, setCollapseOnMouseLeave] = useSetting('collapseOnMouseLeave', true)
  const [idleSessionCleanup, setIdleSessionCleanup] = useSetting('idleSessionCleanup', 30)
  const [sessionRotationInterval, setSessionRotationInterval] = useSetting('sessionRotationInterval', 5)

  return (
    <div>
      <h2 className="text-[16px] font-semibold mb-1">Behavior / 行为</h2>
      <p className="text-[11px] text-white/40 mb-5">面板交互与会话行为配置</p>

      <SettingRow label="Hide in Fullscreen / 全屏隐藏" description="任何应用进入全屏时自动隐藏面板">
        <Switch checked={hideInFullscreen} onChange={setHideInFullscreen} />
      </SettingRow>

      <SettingRow label="Auto-hide When No Session / 无会话隐藏" description="无 AI 会话运行时完全隐藏面板">
        <Switch checked={hideWhenNoSession} onChange={setHideWhenNoSession} />
      </SettingRow>

      <SettingRow label="Smart Suppress / 智能抑制" description="当终端在前台时不自动展开面板">
        <Switch checked={smartSuppress} onChange={setSmartSuppress} />
      </SettingRow>

      <SettingRow label="Collapse on Mouse Leave / 鼠标移开折叠" description="鼠标移出面板区域后自动折叠">
        <Switch checked={collapseOnMouseLeave} onChange={setCollapseOnMouseLeave} />
      </SettingRow>

      <SettingRow label="Idle Session Cleanup / 空闲清理" description="自动清理无活动会话的时间">
        <Select
          value={idleSessionCleanup}
          onChange={setIdleSessionCleanup}
          options={[
            { value: 0, label: 'Never / 从不' },
            { value: 10, label: '10 min' },
            { value: 30, label: '30 min' },
            { value: 60, label: '1 hour' },
            { value: 120, label: '2 hours' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Session Rotation / 会话轮播" description="折叠栏切换活动会话的频率">
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
