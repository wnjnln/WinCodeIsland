# WinClaudeIsland

Windows 版的 Claude Code 状态悬浮面板。

## 手动配置 Hook

1. 将 `bridge/winclaude-island-bridge.js` 复制到任意目录（例如 `C:\Tools\`）
2. 编辑 `~/.claude/settings.json`，在 `hooks` 中按如下示例添加事件（以 `SessionStart` 为例，其余事件同理）：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node C:\\Tools\\winclaude-island-bridge.js",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

需要配置的事件列表：
- SessionStart, SessionEnd
- UserPromptSubmit, PreToolUse, PostToolUse, PostToolUseFailure
- PermissionRequest, PermissionDenied
- Stop, SubagentStart, SubagentStop
- Notification, PreCompact

`PermissionRequest` 和 `Notification` 的 `timeout` 建议设为 `86400`，其余为 `5`。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```
