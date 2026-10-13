# Aeris

Aeris 是一个面向 **ucode 版 LuCI** 的 OpenWrt 主题。提供浅色与深色外观、可收起侧栏、菜单搜索、手机导航，以及读取真实设备状态的网络概览。当前版本为 **1.0.1**。

[下载安装包](https://github.com/wizcheu/luci-theme-aeris/releases/latest) · [安装与恢复](docs/install.md) · [构建与发布](docs/releasing.md) · [文档目录](docs/README.md)

## 发布范围

安装包包含主题外壳、登录页、通用 LuCI 控件样式和网络概览。概览通过只读 RPC 展示 WAN 流量、内存、网络接口、设备信息和 IPv4 DHCP 租约；流量历史从打开页面后开始采样，DHCP 租约不等同于设备在线状态。

系统、网络与服务配置继续由原生 LuCI 表单处理。`preview/` 中重排的 30 个管理页面是独立的交互设计样板，**不包含在安装包中，也没有接入真实配置写入**。详见[设计覆盖清单](docs/backend-coverage.md)。当前不宣称所有第三方插件已完成真机兼容性验证。

## 下载与使用

| 设备环境 | 下载文件 |
| --- | --- |
| 使用 `opkg` 且安装了 ucode LuCI，例如 OpenWrt 24.10 | `luci-theme-aeris_1.0.1-r1_all.ipk` |
| 使用 `apk` 的 OpenWrt 25.12 | `luci-theme-aeris-1.0.1-r1.apk` |
| 旧版 Lua LuCI | 不支持 |

这是主题软件包，不是固件，无需刷机。`all` 表示主题没有 CPU 架构相关的可执行文件；仍需满足上表的 LuCI 和包管理器要求。衍生固件以实际运行环境为准。

1. 从 [Releases](https://github.com/wizcheu/luci-theme-aeris/releases) 的 **Assets** 下载对应安装包；不要把自动生成的 Source code ZIP 当作安装包。
2. 参考[安装文档](docs/install.md)安装。
3. 在 **系统 → 系统 → 语言和界面 → 主题** 选择 **Aeris**，保存并应用。

安装时会注册 Aeris，保留当前主题选择。卸载前可切回原主题。

## 开发与本地预览

无 npm 运行依赖，也不使用 CDN、远程字体或外部图表库。

```sh
python3 scripts/preview.py
```

打开 `http://127.0.0.1:8099`。本地服务器只监听回环地址，使用独立样本数据；所有设置、上传、诊断、登录和重启交互均不连接路由器。可用 `/?state=empty`、`/?state=loading`、`/?state=error` 查看特殊状态。

```sh
npm test
python3 scripts/check.py
python3 scripts/build.py
```

修改模板后，用带 fs 模块的 ucode 更新生成页面：

```sh
ucode -L "$PWD/preview/stubs" scripts/render-preview.uc
```

## 目录

| 目录 | 内容 |
| --- | --- |
| `htdocs/` | 主题样式、组件、菜单与真实状态概览 |
| `ucode/` | LuCI 页头、页尾和登录模板 |
| `root/` | 主题注册、菜单及只读 RPC 权限 |
| `preview/` | 本地交互样板、样本数据及生成页面，不进入安装包 |
| `scripts/`、`tests/` | 打包、校验、模板生成和测试 |
| `docs/` | 安装、发布、设计与组件文档 |

视觉方向参考 [Ecme](https://github.com/ThemeNate/Ecme-lite)，未引入其源码或品牌素材。Apache-2.0；兼容层来源和版权说明见 [NOTICE](NOTICE) 与 [LICENSE](LICENSE)。
