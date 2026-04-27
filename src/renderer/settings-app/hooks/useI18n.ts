import { useSetting } from './useSetting'

const dict: Record<string, Record<string, string>> = {
  'zh-CN': {
    // SettingsApp nav
    'nav.general': '常规',
    'nav.behavior': '行为',
    'nav.appearance': '外观',
    'nav.sound': '声音',
    'nav.hooks': 'Hooks',
    'nav.about': '关于',

    // GeneralPage
    'general.title': '常规',
    'general.subtitle': '基础应用配置',
    'language.label': '语言',
    'language.desc': '应用显示语言',
    'language.system': '跟随系统',
    'language.zh': '简体中文',
    'language.en': 'English',
    'launchAtLogin.label': '开机启动',
    'launchAtLogin.desc': '系统登录时自动启动应用',
    'allowHorizontalDrag.label': '允许拖动',
    'allowHorizontalDrag.desc': '沿屏幕顶部左右拖动面板位置',
    'display.label': '显示器',
    'display.desc': '选择面板显示在哪块屏幕上',
    'display.auto': '自动',

    // BehaviorPage
    'behavior.title': '行为',
    'behavior.subtitle': '面板交互与会话行为配置',
    'hideInFullscreen.label': '全屏隐藏',
    'hideInFullscreen.desc': '任何应用进入全屏时自动隐藏面板',
    'hideWhenNoSession.label': '无会话隐藏',
    'hideWhenNoSession.desc': '无 AI 会话运行时完全隐藏面板',
    'smartSuppress.label': '智能抑制',
    'smartSuppress.desc': '当终端在前台时不自动展开面板',
    'collapseOnMouseLeave.label': '鼠标移开折叠',
    'collapseOnMouseLeave.desc': '鼠标移出面板区域后自动折叠',
    'idleSessionCleanup.label': '空闲清理',
    'idleSessionCleanup.desc': '自动清理无活动会话的时间',
    'idleSessionCleanup.never': '从不',
    'sessionRotation.label': '会话轮播',
    'sessionRotation.desc': '折叠栏切换活动会话的频率',

    // AppearancePage
    'appearance.title': '外观',
    'appearance.subtitle': '面板尺寸、字体和内容显示配置',
    'maxVisibleSessions.label': '最大会话数',
    'maxVisibleSessions.desc': '面板中最多显示的会话数量',
    'maxVisibleSessions.unlimited': '无限制',
    'collapsedWidthScale.label': '宽度缩放',
    'collapsedWidthScale.desc': '折叠状态下岛的宽度百分比',
    'notchHeightMode.label': '顶部栏高度',
    'notchHeightMode.desc': '面板顶部对齐方式',
    'notchHeightMode.matchNotch': '匹配刘海',
    'notchHeightMode.matchMenuBar': '匹配菜单栏',
    'notchHeightMode.custom': '自定义',
    'customHeight.label': '自定义高度',
    'customHeight.desc': '面板顶部高度 (pt)',
    'contentFontSize.label': '内容字体',
    'contentFontSize.desc': '会话卡片等内容区域字体大小',
    'aiMessageLines.label': 'AI 回复行数',
    'aiMessageLines.desc': '每个会话显示的 AI 回复行数',
    'aiMessageLines.unlimited': '无限制',
    'showAgentDetails.label': '显示详情',
    'showAgentDetails.desc': '在会话卡片中显示 agent 活动详情',

    // SoundPage
    'sound.title': '声音',
    'sound.subtitle': '音效开关与音量配置',
    'soundEnabled.label': '启用音效',
    'soundEnabled.desc': '全局音效开关',
    'volume.label': '音量',
    'volume.desc': '全局音效音量',
    'soundEvents.title': '会话事件',
    'soundEventStart.label': '会话开始',
    'soundEventStart.desc': '新会话启动时播放',
    'soundEventComplete.label': '任务完成',
    'soundEventComplete.desc': '任务成功完成时播放',
    'soundEventError.label': '任务出错',
    'soundEventError.desc': '任务失败或报错时播放',
    'interactionEvents.title': '交互事件',
    'soundEventApproval.label': '需要授权',
    'soundEventApproval.desc': '需要用户授权时播放',
    'soundEventSubmit.label': '提交提示',
    'soundEventSubmit.desc': '用户提交问题时播放',
    'systemEvents.title': '系统事件',
    'soundEventBoot.label': '启动音效',
    'soundEventBoot.desc': '应用启动时播放',

    // HooksPage
    'hooks.title': 'CLI Hooks',
    'hooks.subtitle': '管理各 CLI 工具的 Hook 安装状态',
    'hooks.installed': '已安装',
    'hooks.notInstalled': '未安装',
    'hooks.checking': '检查中',
    'hooks.install': '安装',
    'hooks.uninstall': '卸载',
    'hooks.working': '处理中',
    'hooks.desc1': 'Hooks 会自动将事件发送到 WinClaudeIsland 面板。',
    'hooks.desc2': '每个 CLI 独立管理，互不影响。',

    // AboutPage
    'about.version': '版本',
    'about.desc': 'Windows 实时 AI 编码助手状态面板',
    'about.ported': '基于 CodeIsland 移植的 Windows 版本',
    'about.checkUpdate': '检查更新',
    'about.checking': '检查中',
    'about.license': 'MIT 许可证',

    // Window title
    'window.settingsTitle': 'WinClaudeIsland 设置',
  },
  'en': {
    // SettingsApp nav
    'nav.general': 'General',
    'nav.behavior': 'Behavior',
    'nav.appearance': 'Appearance',
    'nav.sound': 'Sound',
    'nav.hooks': 'Hooks',
    'nav.about': 'About',

    // GeneralPage
    'general.title': 'General',
    'general.subtitle': 'Basic app configuration',
    'language.label': 'Language',
    'language.desc': 'Application display language',
    'language.system': 'System',
    'language.zh': '简体中文',
    'language.en': 'English',
    'launchAtLogin.label': 'Launch at Login',
    'launchAtLogin.desc': 'Auto-start app when system logs in',
    'allowHorizontalDrag.label': 'Allow Horizontal Drag',
    'allowHorizontalDrag.desc': 'Drag panel along top screen edge',
    'display.label': 'Display',
    'display.desc': 'Choose which screen to show panel on',
    'display.auto': 'Auto',

    // BehaviorPage
    'behavior.title': 'Behavior',
    'behavior.subtitle': 'Panel interaction and session behavior',
    'hideInFullscreen.label': 'Hide in Fullscreen',
    'hideInFullscreen.desc': 'Auto-hide panel when any app goes fullscreen',
    'hideWhenNoSession.label': 'Auto-hide When No Session',
    'hideWhenNoSession.desc': 'Fully hide panel when no AI session is running',
    'smartSuppress.label': 'Smart Suppress',
    'smartSuppress.desc': 'Do not auto-expand panel when terminal is focused',
    'collapseOnMouseLeave.label': 'Collapse on Mouse Leave',
    'collapseOnMouseLeave.desc': 'Auto-collapse when mouse leaves panel area',
    'idleSessionCleanup.label': 'Idle Cleanup',
    'idleSessionCleanup.desc': 'Auto-remove inactive sessions after',
    'idleSessionCleanup.never': 'Never',
    'sessionRotation.label': 'Session Rotation',
    'sessionRotation.desc': 'Rotate active sessions in collapsed bar',

    // AppearancePage
    'appearance.title': 'Appearance',
    'appearance.subtitle': 'Panel size, font and content display',
    'maxVisibleSessions.label': 'Max Visible Sessions',
    'maxVisibleSessions.desc': 'Maximum sessions shown in panel',
    'maxVisibleSessions.unlimited': 'Unlimited',
    'collapsedWidthScale.label': 'Width Scale',
    'collapsedWidthScale.desc': 'Collapsed island width percentage',
    'notchHeightMode.label': 'Top Bar Height',
    'notchHeightMode.desc': 'Panel top alignment mode',
    'notchHeightMode.matchNotch': 'Match Notch',
    'notchHeightMode.matchMenuBar': 'Match Menu Bar',
    'notchHeightMode.custom': 'Custom',
    'customHeight.label': 'Custom Height',
    'customHeight.desc': 'Panel top height (pt)',
    'contentFontSize.label': 'Content Font Size',
    'contentFontSize.desc': 'Font size for session cards and content',
    'aiMessageLines.label': 'AI Reply Lines',
    'aiMessageLines.desc': 'Number of AI reply lines per session',
    'aiMessageLines.unlimited': 'Unlimited',
    'showAgentDetails.label': 'Show Agent Details',
    'showAgentDetails.desc': 'Show agent activity details in session cards',

    // SoundPage
    'sound.title': 'Sound',
    'sound.subtitle': 'Sound effects and volume settings',
    'soundEnabled.label': 'Enable Sound Effects',
    'soundEnabled.desc': 'Global sound effects toggle',
    'volume.label': 'Volume',
    'volume.desc': 'Global sound effects volume',
    'soundEvents.title': 'Session Events',
    'soundEventStart.label': 'Session Start',
    'soundEventStart.desc': 'Play when a new session starts',
    'soundEventComplete.label': 'Task Complete',
    'soundEventComplete.desc': 'Play when task completes successfully',
    'soundEventError.label': 'Task Error',
    'soundEventError.desc': 'Play when task fails or errors',
    'interactionEvents.title': 'Interaction Events',
    'soundEventApproval.label': 'Approval Needed',
    'soundEventApproval.desc': 'Play when user approval is required',
    'soundEventSubmit.label': 'Prompt Submit',
    'soundEventSubmit.desc': 'Play when user submits a question',
    'systemEvents.title': 'System Events',
    'soundEventBoot.label': 'Boot Sound',
    'soundEventBoot.desc': 'Play when app launches',

    // HooksPage
    'hooks.title': 'CLI Hooks',
    'hooks.subtitle': 'Manage Hook installation status for each CLI',
    'hooks.installed': 'Installed',
    'hooks.notInstalled': 'Not Installed',
    'hooks.checking': 'Checking',
    'hooks.install': 'Install',
    'hooks.uninstall': 'Uninstall',
    'hooks.working': 'Working',
    'hooks.desc1': 'Hooks automatically send events to WinClaudeIsland panel.',
    'hooks.desc2': 'Each CLI is managed independently.',

    // AboutPage
    'about.version': 'Version',
    'about.desc': 'Real-time AI coding agent status panel for Windows',
    'about.ported': 'Windows port based on CodeIsland',
    'about.checkUpdate': 'Check for Updates',
    'about.checking': 'Checking',
    'about.license': 'MIT License',

    // Window title
    'window.settingsTitle': 'WinClaudeIsland Settings',
  },
}

export function useI18n() {
  const [language] = useSetting('language', 'zh-CN')

  const resolveLang = () => {
    if (language === 'system') {
      return navigator.language.startsWith('zh') ? 'zh-CN' : 'en'
    }
    return language === 'zh-CN' ? 'zh-CN' : 'en'
  }

  const t = (key: string): string => {
    const lang = resolveLang()
    return dict[lang]?.[key] ?? dict['en']?.[key] ?? key
  }

  return { t, language: resolveLang() }
}
