# 后台页面覆盖清单

本清单记录 `preview/` 中的本地交互样板，不代表安装包已替换对应的原生管理页面。正式主题使用真实 LuCI 菜单、表单与权限系统；网络概览已提供 RPC 读取适配器。

覆盖后台菜单中的 **30 个主页面**；另外保留 Aeris 网络概览和 39 类组件库。子路由支持直接访问，包括管理权 5 项、防火墙 6 项、OpenClash 6 项、实时信息 4 项。

全部新页面共用 Small 40px 按钮、20px 卡片标题、Ecme Default / Icons 横向 Tab、48px 填充输入、状态标签和 24px 圆角弹窗。

| 分类 | 页面 | 本地设计覆盖 |
| --- | --- | --- |
| 状态 | [系统状态](http://127.0.0.1:8099/cgi-bin/luci/admin/status/overview) | 系统信息、内存与存储、以太网端口、IPv4 上游、无线网络 |
| 状态 | [路由状态](http://127.0.0.1:8099/cgi-bin/luci/admin/status/routesj) | IPv4 / IPv6 邻居、活动路由与策略规则；邻居筛选 |
| 状态 | [防火墙状态](http://127.0.0.1:8099/cgi-bin/luci/admin/status/nftables) | 规则链筛选、折叠展开、匹配条件、流量计数与动作标签 |
| 状态 | [系统日志](http://127.0.0.1:8099/cgi-bin/luci/admin/status/logs) | 搜索、级别筛选、滚动、导出示例日志 |
| 状态 | [进程](http://127.0.0.1:8099/cgi-bin/luci/admin/status/processes) | CPU / 内存排序、进程搜索、操作菜单与确认窗口 |
| 状态 | [信道分析](http://127.0.0.1:8099/cgi-bin/luci/admin/status/channel_analysis) | 两个频段、dBm 面积图、图例、悬停与键盘查看、扫描列表 |
| 状态 | [实时信息](http://127.0.0.1:8099/cgi-bin/luci/admin/status/realtime) | 负载、带宽、无线和连接四个分类；共享图表与连接表 |
| 系统 | [系统设置](http://127.0.0.1:8099/cgi-bin/luci/admin/system/system) | 按实机字段组织常规、日志、时间同步、语言和界面 |
| 系统 | [管理权](http://127.0.0.1:8099/cgi-bin/luci/admin/system/admin) | 密码校验、SSH 访问、SSH 密钥、HTTPS 访问、仓库公钥 |
| 系统 | [软件包](http://127.0.0.1:8099/cgi-bin/luci/admin/system/package-manager) | 可用 / 已安装 / 更新，搜索、分页、模拟安装、源配置、上传窗口 |
| 系统 | [启动项](http://127.0.0.1:8099/cgi-bin/luci/admin/system/startup) | 服务搜索、开机开关、运行状态、操作菜单、本地启动脚本 |
| 系统 | [计划任务](http://127.0.0.1:8099/cgi-bin/luci/admin/system/crontab) | Cron 格式说明、可编辑脚本、保存与复位 |
| 系统 | [挂载点](http://127.0.0.1:8099/cgi-bin/luci/admin/system/mounts) | 文件系统容量、挂载点编辑、交换分区、自动挂载设置 |
| 系统 | [LED 配置](http://127.0.0.1:8099/cgi-bin/luci/admin/system/leds) | LED 动作列表、触发器、设备与默认状态编辑 |
| 系统 | [备份与更新](http://127.0.0.1:8099/cgi-bin/luci/admin/system/flash) | 备份、恢复、固件选择、重置确认、分区信息、额外备份文件 |
| 系统 | [Argon 主题设置](http://127.0.0.1:8099/cgi-bin/luci/admin/system/argon-config) | 壁纸来源、亮暗参数、主题模式、背景文件选择 |
| 系统 | [重启](http://127.0.0.1:8099/cgi-bin/luci/admin/system/reboot) | 设备状态、重启确认与完成状态 |
| 系统 | [终端](http://127.0.0.1:8099/cgi-bin/luci/admin/system/ttyd) | 终端容器和离线 help / status / clear 交互 |
| 服务 | [OpenClash](http://127.0.0.1:8099/cgi-bin/luci/admin/services/openclash) | 六个主分类；运行图表、模式选择、44 个插件字段、39 个覆写字段、订阅、配置编辑和三类日志 |
| 服务 | [动态 DNS](http://127.0.0.1:8099/cgi-bin/luci/admin/services/ddns) | 服务状态、域名与 IP、服务编辑、凭据输入外观、更新选项、全局设置 |
| 服务 | [网络唤醒](http://127.0.0.1:8099/cgi-bin/luci/admin/services/wol) | 默认设置、目标编辑、唤醒操作与示例输出 |
| 服务 | [UPnP IGD 和 PCP](http://127.0.0.1:8099/cgi-bin/luci/admin/services/upnp) | 端口映射、常规 / 高级服务设置、访问控制规则 |
| 网络 | [接口](http://127.0.0.1:8099/cgi-bin/luci/admin/network/network) | 接口 / 设备 / 全局设置，接口与设备编辑、DHCP 子分组、VLAN |
| 网络 | [无线](http://127.0.0.1:8099/cgi-bin/luci/admin/network/wireless) | 两个无线设备、站点列表、扫描、编辑、启停、删除、设备重启确认；五类编辑分组 |
| 网络 | [路由](http://127.0.0.1:8099/cgi-bin/luci/admin/network/routes) | 静态 IPv4 / IPv6 路由、IPv4 / IPv6 规则；新增和编辑 |
| 网络 | [DHCP](http://127.0.0.1:8099/cgi-bin/luci/admin/network/dhcp) | 静态与活动租约、dnsmasq 分组、odhcpd、中继与标签；租约新增和筛选 |
| 网络 | [DNS](http://127.0.0.1:8099/cgi-bin/luci/admin/network/dns) | 常规、缓存、端口、DNS 记录、DNSSEC 空状态、过滤、转发、限制、日志、解析文件和 IP 集 |
| 网络 | [网络诊断](http://127.0.0.1:8099/cgi-bin/luci/admin/network/diagnostics) | Ping / Traceroute / Nslookup、地址输入、协议选择、示例输出 |
| 网络 | [防火墙](http://127.0.0.1:8099/cgi-bin/luci/admin/network/firewall) | 区域、端口转发、通信规则、NAT、IP 集和自定义规则；表单编辑与状态标签 |
| 网络 | [Turbo ACC 网络加速](http://127.0.0.1:8099/cgi-bin/luci/admin/network/turboacc) | 运行指标、快速转发、硬件卸载、桥接、IPv6 与拥塞控制设置 |

## 数据与实现边界

- 所有地址、主机、配置和日志均为示例；字段元数据只保留名称、分组、类型和已脱敏选项。没有复制路由器密码、订阅凭据或实际配置值。
- 页面内保存、复位、编辑、删除和运行操作只影响当前预览。刷新页面恢复示例数据。上传控件只选择本地文件；终端、网络诊断、安装、重启、刷写和网络唤醒不执行远程操作。
- 本轮是页面设计与交互样板，未接入真实 UCI / RPC。插件的所有条件依赖、安装能力、服务端校验、厂商扩展与实时轮询尚未作固件级验收；OpenClash 第三方登录等扩展界面未复刻。
- 发布包只包含主题运行文件；不打包 `preview/`、本地样本、组件库和这些重排页面的适配器。

## 文件组织

- `preview/routes.json`：本地路由、侧栏菜单与模板的统一清单。
- `preview/admin-pages.js`：28 个新增或重做页面的设计适配与示例交互。
- `preview/backend-fields.json`：214 个表单字段的元数据；系统与接口继续使用原有专用设计适配器。
- `htdocs/luci-static/aeris/admin-pages.css`：页内布局、监控、表格、终端和响应式样式。
- `htdocs/luci-static/aeris/ui.js/css`：共享控件；本轮补充负数图表范围、紧凑小数刻度与 Tab 自动滚动。
