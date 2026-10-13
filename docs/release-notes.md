## Aeris 1.0.2

统一输入操作行的视觉对齐，并修复管理页面设计预览中的标签间距。

- 输入框旁的添加、执行等操作按钮与输入框等高；覆盖 NTP 动态列表、表单列表和原生 LuCI 组合控件。
- 所有横向管理 Tab 下方统一保留 24px 间距，修复软件包页面搜索框紧贴标签栏的问题。
- 同步更新设计预览和安装包中的公共样式。

### 下载与安装

`opkg` 环境下载 `.ipk`，使用 `apk` 的环境下载 `.apk`。参考 [安装与恢复](https://github.com/wizcheu/luci-theme-aeris/blob/main/docs/install.md)。

### 范围

保留原生 LuCI 表单、事件和 RPC。`preview/` 中的重排管理页面仍为独立设计样板，未作为替代管理页面打包。历史版本说明见各版本的 [Releases](https://github.com/wizcheu/luci-theme-aeris/releases)。
