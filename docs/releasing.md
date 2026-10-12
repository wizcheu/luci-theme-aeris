# 构建与发布

## 本地 IPK

要求 Python 3.10+；测试另需 Node.js 22。

```sh
npm test
python3 scripts/check.py
python3 scripts/build.py
```

输出在 `dist/`，不提交到 Git。IPK 使用固定文件顺序、权限和时间戳，默认构建可重复；只打包 `htdocs/`、`ucode/`、`root/` 及许可文本。

## GitHub Actions

工作流为 [build.yml](../.github/workflows/build.yml)：

1. 检查版本、JSON、文档链接及 JavaScript / Shell 语法。
2. 测试安装包结构、可重复性、主题注册与卸载、流量计算和异常采样。
3. 使用固定版本 ucode 编译模板，检查生成页面是否与源码一致。
4. 生成通用 `.ipk` 和源码压缩包。
5. 使用固定提交的官方 [OpenWrt SDK Action](https://github.com/openwrt/gh-action-sdk) 和 OpenWrt 25.12.5 SDK 生成 `.apk`。
6. 版本标签触发的构建全部成功后，生成 `SHA256SUMS` 并创建 GitHub Release，上传安装包、源码和 IPK 文件清单。

普通分支提交仅产生 Actions artifacts；推送版本标签才发布 Release。GitHub Release 是给用户长期下载的入口，Actions artifacts 用于构建检查。参考 [GitHub Releases 文档](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)。

构建任务只拥有 `contents: read`；发布任务单独获得 `contents: write`。使用工作流自带的 `GITHUB_TOKEN`，无需在仓库保存个人访问令牌。工作流不连接开发者的路由器。

## 第一次发布

仓库名为 `wizcheu/luci-theme-aeris`，公开发布从 `v1.0.0` 开始。

```sh
git push -u origin main
git tag -a v1.0.0 -m 'Aeris 1.0.0'
git push origin v1.0.0
```

等待标签对应的工作流全部成功，Release 页面会出现附件。检查下载链接、两种安装包、校验值和发布说明，再把 Release 链接分享给用户。

## 后续版本

同步修改 `Makefile` 的 `PKG_VERSION`、`package.json` 的版本、主题页脚版本，以及安装文档中的文件名；更新 [release-notes.md](release-notes.md)。正常功能发布例如 `1.0.1`；仅重打包时可增加 `PKG_RELEASE`。

先运行本地检查，提交后创建相应的 `v1.0.1` 标签。版本标签必须与 `PKG_VERSION` 一致，否则构建会失败。发布后不要移动或复用同一标签覆盖不同源码；修复应使用新版本。

## 安装包与 SDK

`LUCI_PKGARCH=all`，主题不含 CPU 架构相关代码。APK 使用 SDK 正式打包，IPK 可由独立脚本打包。也可以把本仓库放到对应 OpenWrt 构建树的 `package/luci-theme-aeris`，更新并安装 LuCI feed 后选中主题进行构建。

保留原生 LuCI 表单和 RPC 权限边界，避免把 `preview/` 的样本或模拟操作带入发布包。
