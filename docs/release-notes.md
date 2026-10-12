## Aeris 1.0.0

首个公开版本，面向 ucode 版 LuCI。

- 浅色与深色主题、可收起侧栏、菜单搜索、响应式导航和登录页。
- 统一按钮、输入、Tab、弹窗及原生 LuCI 控件样式。
- 读取真实系统与网络状态的 Aeris 概览：WAN 流量、内存、接口、设备信息与 DHCP 租约。
- `.ipk` 供 opkg 环境使用；`.apk` 供 OpenWrt 25.12 的 apk 环境使用。无需刷机，安装时保留当前主题选择。
- Apache-2.0，附源码、SHA256SUMS 和 IPK 文件清单。

### 安装

从本页 Assets 下载对应安装包，参考 [安装与恢复](https://github.com/wizcheu/luci-theme-aeris/blob/main/docs/install.md)，安装后在“系统 → 系统 → 语言和界面”选择 Aeris。

### 范围

需要 ucode 版 LuCI，不支持旧版 Lua LuCI。系统、网络和插件设置使用原生真实表单；仓库 `preview/` 内的 30 个重排管理页面是独立设计样板，不在安装包内。构建和布局验证不代表所有固件及第三方插件已完成真机验收。
