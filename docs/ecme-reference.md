# Ecme 组件参考 · 2026-10-12

本轮通过浏览器逐页查看实际页面与交互状态。参考站：<https://ecme-react.themenate.net>。

| 参考页面 | 观察到的特征 | Aeris 的应用 |
| --- | --- | --- |
| `/ui-components/input` | 灰底填充，48px 高，12px 圆角，标签在上方 | 原生输入、选择器、密码、文本域共享控件规则 |
| `/ui-components/button` | 主按钮实色、默认按钮描边、次要按钮无边框；Small 40px、Medium 48px | 操作层级、图标与文字的间距 |
| `/ui-components/select` | 圆角白色弹层、宽松选项、柔和阴影、焦点描边 | LuCI dropdown 与预览键盘交互 |
| `/ui-components/tabs` | Default / Icons：透明底、14px 粗体与 2px 下划线 | 全站横向 Tabs；时间范围使用独立 Segment |
| `/ui-components/switcher` | 44 × 24px 胶囊轨道，20px 白色滑块 | LuCI Flag 与预览开关 |
| `/ui-components/checkbox` | 20px 方形复选框，较柔和圆角 | 复选框和单选项 |
| `/ui-components/dialog` | 520px 宽、24px 圆角、靠上展示、模糊遮罩 | 接口编辑弹窗与组件演示 |
| `/ui-components/alert` | 浅色实底、无描边、图标搭配文字 | 成功、警告和错误反馈 |
| `/concepts/account/settings` | 卡片内侧导航、双列表单、宽松纵向间距 | 第二轮的表单布局参考 |
| `/concepts/projects/project-details/27` | 开放白底，纵向图标导航，45px 高、2px 蓝色描边的选中胶囊 | 第三轮系统设置布局，以用户截图为准 |
| `/ui-components/segment` | 48px 整体、4px 内边距、12px 圆角、白色选中块和轻阴影 | 共享 Segment，概览流量筛选 |
| `/guide/shared-component-doc/abbreviate-number` | K / M 简写大数值 | 接口数据包数量展示 |
| `/concepts/customers/customer-list` | 标题和操作同排、搜索、宽松表格、图标身份、状态标签 | 网络接口列表 |
| `/auth/sign-in-simple` | 开放白底、窄内容列、左对齐品牌、32px 标题、填充输入框 | 登录模板 |

原站按钮蓝色实测为 #2a85ff；Aeris 采用更深的 #2563eb，以提高白色按钮文字的对比度。没有复制 Ecme 源码或品牌素材。

组件库扩展时补充查看了 Drawer 与 DatePicker 的官方 Demo。采用抽屉标题/滚动内容/底部操作与弹出日历的基础结构；完整覆盖清单见 ui-library.md。

### Charts 悬停与交互规范补充

参考 https://ecme-react.themenate.net/ui-components/graph/charts ，实际触发 Basic Line 悬停：显示垂直虚线、实心数据点和浮层中的月份/系列名称/数值。浮层为浅色边框、轻阴影，避免整张卡片发光。Aeris 使用共享 SVG 交互层实现，并补充键盘访问和移动端边界处理。

## 后台页面扩展 · Upload

再次查看 [Ecme Upload](https://ecme-react.themenate.net/ui-components/upload)：基础上传入口与 Drag and Drop 示例。拖放区域计算样式为 2px dashed 中性边框、8px 圆角，悬停边框使用主色。已更新共享 Upload 样式，并用于备份、固件、软件包和配置文件选择。新页面其余元素继续复用已核对的 Card、Table、Tabs、Dialog、Select、Button 与 Charts 规范。


## Tabs — Default / Icons（本轮重新核对）

来源：[Ecme Tabs](https://ecme-react.themenate.net/ui-components/tabs)。Default 与 Icons 的结构一致：列表 1px 底边；单项 `padding:12px 20px`、14px/21px、700 字重、2px 透明底边，选中项底边与文字为主题色。实测单项 47px、列表 48px；Icons 18px，图文间距 6px。全站横向分类取消原 Soft / Pill 外观，沿用 Aeris 的主题色与深色变量。
