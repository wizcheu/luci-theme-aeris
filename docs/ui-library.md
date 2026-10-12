# Aeris UI 组件库

主题页头统一加载 `controls.js` / `controls.css` 和 `ui.js` / `ui.css`。全部组件使用原生 DOM、SVG 与主题变量，不依赖 React、在线字体或外部组件运行时。

入口为 `window.AerisUI`。组件工厂通常返回 `{ element, destroy(), ... }`；`icon()` 返回 SVG 节点，`dom()` 是安全文本优先的 DOM 帮助函数。`segment()` 和 `select()` 复用已有 `AerisControls` 实现，接口详见 [controls.md](controls.md)。

## 分类与覆盖

| 分类 | 组件 | 基础能力 |
| --- | --- | --- |
| Common | Button、Grid、Typography、Icons | 40/48px 按钮、三种视觉层级、加载/禁用、响应式网格、文字与 SVG 图标 |
| Feedback | Alert、Dialog、Drawer、Progress、Skeleton、Spinner、Toast | 提示与关闭、模态焦点、四方向抽屉、线性/环形进度、加载状态与通知 |
| Data Display | Avatar、Badge、Calendar、Cards、Carousel、Table、Tag、Timeline、Tooltip | 头像角标、日历、内容卡片、轮播、排序/行选择、状态标签、时间线、悬停说明 |
| Forms | Checkbox、Date Picker、Form Control、Input、Input Group、Radio、Segment、Select、Slider、Switcher、Time Input、Upload | 字段与校验外观、选择控件、日期/时间、滑块、文件选择 |
| Navigation | Dropdown、Menu、Pagination、Steps、Tabs | 操作菜单、页面导航、分页、步骤、Default / Icons 横向标签与纵向标签 |
| Graph | Charts、Maps | SVG 折线/面积/柱状图（正负坐标），GeoJSON Polygon/MultiPolygon 区域显示和选择 |

共 39 类基础样式与交互。这里覆盖本地 LuCI 主题所需的组件基础，不承诺与 Ecme React 组件全部属性一一兼容。

## 常用调用

```js
const UI = window.AerisUI;
const save = UI.button({
  label: '保存', variant: 'solid', size: 'sm',
  onClick() { UI.toast({ tone: 'success', message: '已保存' }); }
});
container.append(save.element);
save.setLoading(true);
save.setLoading(false);
```

按钮默认 `sm`：40px 高、12px 水平内边距；`md` 为 48px 高、20px 水平内边距。支持 `default` / `solid` / `plain` / `danger`、`icon`、`disabled`、`loading`、`block`、圆形图标按钮和 `setDisabled()` / `setLoading()`。

```js
const host = UI.input({ value: 'OpenWrt', onChange(value) { /* 更新草稿 */ } });
container.append(UI.field({
  label: '主机名', required: true, help: '用于识别设备。', control: host
}).element);
const value = host.getValue();
```

`input()` 可设置 `type`、`multiline`、`prefix`、`suffix`、`disabled`、`readonly`、`invalid`，返回 `control`、`getValue()`、`setValue()`、`setDisabled()`、`setInvalid()`。`field()` 负责标签、说明与错误外观；验证逻辑由调用方提供。

```js
const editor = UI.dialog({
  title: '编辑设置', children: host,
  actions: [
    { label: '取消', variant: 'plain' },
    { label: '保存', variant: 'solid', onClick() { /* 保存草稿 */ } }
  ]
});
editor.open();
```

`dialog()` / `drawer()` 支持 `open()`、`close()`、`destroy()`、描述、内容和底部操作；操作返回 `false` 时不关闭。Drawer 支持 `placement`、`width`、`height`。关闭后恢复触发元素焦点。调用方移除长期不用的实例时应调用 `destroy()`。

## 其他状态接口

- `progress()`：`getValue()` / `setValue()`。
- `checkbox()` / `switcher()`：布尔值读取、设置和禁用。
- `radioGroup()` / `tabs()` / `map()`：`getValue()` / `setValue()`。
- `slider()`：数值读取、设置，支持 min / max / step。
- `calendar()` / `datePicker()`：ISO 日期字符串，月份切换、min / max 与选中回调。
- `upload()`：`getFiles()` / `clear()`；只选择本地 File 对象，不上传。服务端传输、类型验证和大小限制由调用方实现。
- `table()`：columns / rows / rowKey，列排序与 render，`setRows()` / `getSelection()`。
- `pagination()`：`setPage()` / `getPage()` / `setTotal()`；数据请求由调用方负责。
- `steps()`：`setCurrent()` / `getCurrent()`。
- `carousel()`：`setIndex()` / `getIndex()`；手动切换，不自动播放。
- `chart()`：series、labels、line / area / bar，`setSeries()`；支持正负数值，可用 `min` / `max` 指定坐标范围，`formatAxis` 定制刻度。
- `map()`：GeoJSON 多边形边界拟合到 SVG 视口，不含在线瓦片、定位或 GIS 服务。演示用虚构网络区域。

## 预览

打开 `http://127.0.0.1:8099/cgi-bin/luci/admin/status/components`。按六个分类浏览，或搜索英文 / 中文名称；可用 `#common`、`#feedback`、`#display`、`#forms`、`#navigation`、`#graph` 直接进入分类。

## Search 与图表交互

`AerisUI.search({ label, placeholder, value, size: 'sm' | 'md', onChange })` 返回 `element`、`control`、`getValue()`、`setValue(value, emit = false)`、`setDisabled()`。Small 为 40px，Medium 为 48px。搜索图标、清空按钮、Escape 清空、灰底和整框聚焦状态统一封装。概览设备搜索、网络接口/设备搜索和组件库搜索使用同一个实现。

`AerisUI.chart()` 的折线、面积、柱状图均支持悬停指示线、数据点和共享数值浮层。聚焦图表后，左右方向键、Home、End 可查看数据，Escape 关闭提示。点击图例切换序列，至少保留一组。可用 `unit` 或 `formatValue(value)` 格式化数值。图表根据容器实际宽度重新绘制，避免直接缩放文字。

`AerisUI.chartInteraction({ element, canvas, points, bounds, label })` 为自定义 SVG 提供同一套交互。每个 point 包含 `{ x, label, rows: [{ name, value, color, y }] }`，bounds 为 `{ left, right, top, bottom }`，坐标均使用 SVG 用户坐标。返回 `show(index)`、`hide()`、`getIndex()`、`destroy()`。重绘前调用 `destroy()`；概览实时流量图复用此实现。


## Default / Icons 页面 Tab

`AerisUI.tabs({ variant: 'underline', items: [{ value, label, icon, count, content }] })` 提供与 Ecme Default / Icons 一致的透明底、2px 下划线样式，支持可选图标和数量标签。接口主分类和系统设置主分类共用该样式。小屏单行横向滚动，选中项保持可见；左右方向键、Home、End 保持可用。

`chart({ min: -100, max: -20, unit: "dBm" })` 可绘制信道信号。小于 1 的数值范围自动使用小数刻度。窄屏自动减少横轴刻度文字，仍保留每个采样点的键盘与悬停数据。


### 本轮共享组件更新

- `tabs`：横向统一 Ecme Default / Icons；无内容的分类导航不生成额外内容间距。
- `chart`：ResizeObserver 根据容器实际宽度绘制，固定 240px 图高；坐标保持 12px，隐藏 Tab 展开后自动重新测量。
- `saveBar({actions, message})`：统一保存操作和 sticky 状态栏；`setState(true)` 显示琥珀色未保存提示，`setState(false, message)` 恢复普通状态。
- `dropdown`：固定宽度、纵向菜单项，避免继承表格的不换行布局。
