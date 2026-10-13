# 安装与恢复

## 安装前确认

Aeris 1.0.2 需要 ucode 版 LuCI。通过 SSH 检查：

```sh
test -f /usr/share/ucode/luci/runtime.uc && echo 'ucode LuCI available'
command -v opkg || command -v apk
uci -q get luci.main.mediaurlbase
```

记下最后一行的原主题路径，方便恢复。包依赖 `luci-base` 和 `rpcd-mod-luci`。没有 ucode 运行时的旧版 Lua LuCI 不在支持范围。

[OpenWrt 官方安装文档](https://openwrt.org/faq/how_to_install_packages)说明：24.10 及更早版本通常使用 opkg，25.12 起使用 apk。衍生固件请以 `command -v` 的实际结果为准。

## 下载

打开 [Aeris Releases](https://github.com/wizcheu/luci-theme-aeris/releases/latest)，展开 **Assets**：

- `.ipk`：用于 opkg。
- `.apk`：用于 OpenWrt apk；不是 Android 安装包。
- `SHA256SUMS`：安装包和源码压缩包校验值。
- `manifest.json`：IPK 的文件清单与校验值。
- `luci-theme-aeris-source.tar.gz`：源码，供开发或集成进固件构建树使用。

发布附件可直接下载，不需要从 Actions 的临时构建产物中寻找安装包。GitHub 自动附带的 Source code ZIP / tar.gz 也属于源码。

可把安装包上传到路由器 `/tmp/`，运行 `sha256sum 文件名`，与同一 Release 的 `SHA256SUMS` 对照。

## opkg 安装

在 LuCI **系统 → 软件包** 中更新列表、上传 `.ipk` 并安装；也可以通过 SSH：

```sh
cd /tmp
opkg update
opkg install ./luci-theme-aeris_1.0.2-r1_all.ipk
```

不要使用 `--force-depends` 绕过缺失依赖。如果固件源没有依赖包，应先解决固件源与版本不匹配的问题。

## apk 安装

把 `.apk` 上传到 `/tmp/`，核对校验值后执行：

```sh
cd /tmp
apk update
apk add --allow-untrusted ./luci-theme-aeris-1.0.2-r1.apk
```

该主题是第三方 Release 附件，未由设备内置的 OpenWrt 官方密钥签名，因此本次本地安装需要 `--allow-untrusted`。不要把 `.ipk` 改扩展名后交给 apk，也不要用于 Alpine Linux 或 Android。

## 启用

安装完成后刷新 LuCI；如果没有出现新菜单，可退出并重新登录。在 **系统 → 系统 → 语言和界面** 中选择 **Aeris**，保存并应用。

也可以用 SSH 选择主题：

```sh
uci set luci.main.mediaurlbase='/luci-static/aeris'
uci commit luci
```

然后强制刷新浏览器。主题的 **Aeris 概览** 位于状态菜单；首次进入需要约 5 秒取得第二次流量采样。安装包保留原生 LuCI 的系统、网络和服务配置流程，不安装本地预览样板。

## 升级、切回与卸载

下载新版本的对应包，使用相同的 `opkg install` 或 `apk add --allow-untrusted` 命令安装新文件，再刷新页面。

卸载前，在语言和界面中选回原主题。若页面无法加载，通过 SSH 把 `luci.main.mediaurlbase` 改回安装前记录的路径并提交，然后清理 LuCI 临时缓存：

```sh
rm -f /tmp/luci-indexcache.*
rm -rf /tmp/luci-modulecache/
```

确认原主题恢复后，按设备的包管理器执行其中一条：

```sh
opkg remove luci-theme-aeris
# 或
apk del luci-theme-aeris
```

卸载钩子会移除 Aeris 的主题注册。它不会修改无线、接口或防火墙配置。

## 当前验证范围

详见[验证记录](validation.md)。本项目提供源码检查、包结构与生命周期测试、状态计算测试和浏览器布局验证；这不等同于所有 OpenWrt 分支及第三方插件的真机安装验收。反馈问题时请提供固件版本、包管理器、浏览器版本、页面路径和脱敏后的错误信息。
