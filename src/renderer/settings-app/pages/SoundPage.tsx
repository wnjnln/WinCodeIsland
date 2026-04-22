import { useSetting } from '../hooks/useSetting'
import { SettingRow, Switch, Slider } from '../components/SettingRow'

export function SoundPage() {
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
      <h2 className="text-[16px] font-semibold mb-1">Sound / 声音</h2>
      <p className="text-[11px] text-white/40 mb-5">音效开关与音量配置</p>

      <SettingRow label="Enable Sound Effects / 启用音效" description="全局音效开关">
        <Switch checked={soundEnabled} onChange={setSoundEnabled} />
      </SettingRow>

      <SettingRow label="Volume / 音量" description="全局音效音量">
        <Slider value={volume} min={0} max={100} step={5} onChange={setVolume} suffix="%" />
      </SettingRow>

      <div className="mt-4 mb-2 text-[12px] font-medium text-white/60">Sessions / 会话事件</div>

      <SettingRow label="Session Start / 会话开始" description="新会话启动时播放">
        <Switch checked={soundEventStart} onChange={setSoundEventStart} />
      </SettingRow>

      <SettingRow label="Task Complete / 任务完成" description="任务成功完成时播放">
        <Switch checked={soundEventComplete} onChange={setSoundEventComplete} />
      </SettingRow>

      <SettingRow label="Task Error / 任务出错" description="任务失败或报错时播放">
        <Switch checked={soundEventError} onChange={setSoundEventError} />
      </SettingRow>

      <div className="mt-4 mb-2 text-[12px] font-medium text-white/60">Interaction / 交互事件</div>

      <SettingRow label="Approval Needed / 需要授权" description="需要用户授权时播放">
        <Switch checked={soundEventApproval} onChange={setSoundEventApproval} />
      </SettingRow>

      <SettingRow label="Prompt Submit / 提交提示" description="用户提交问题时播放">
        <Switch checked={soundEventSubmit} onChange={setSoundEventSubmit} />
      </SettingRow>

      <div className="mt-4 mb-2 text-[12px] font-medium text-white/60">System / 系统事件</div>

      <SettingRow label="Boot Sound / 启动音效" description="应用启动时播放">
        <Switch checked={soundEventBoot} onChange={setSoundEventBoot} />
      </SettingRow>
    </div>
  )
}
