# Aeris 共享控件

`htdocs/luci-static/aeris/controls.js` 与 `controls.css` 提供独立于 React / LuCI 表单的浏览器组件。主题页头统一加载，视图通过 `window.AerisControls` 调用。组件通过 DOM 文本节点渲染标签，无 HTML 字符串注入。

## Segment

```js
const direction = AerisControls.segment({
  label: '流量方向',
  value: 'both',
  size: 'sm',
  items: [
    { value: 'both', label: '全部' },
    { value: 'download', label: '下载' },
    { value: 'upload', label: '上传' }
  ],
  onChange(value) { updateChart(value); }
});
container.append(direction.element);
```

- `multiple: true` 开启多选，`value` 与回调参数改为数组。
- `size` 支持 `xs` / `sm` / `md` / `lg`，默认 `md`。
- `block: true` 撑满父容器；`disabled: true` 禁用整个组件。
- 单项支持 `disabled` 和可选的 DOM `icon`。
- 单选使用 radiogroup / radio，多选使用 aria-pressed 按钮。方向键、Home、End 移动焦点，单选同时切换值；多选用空格或 Enter 切换。

## Select

```js
const range = AerisControls.select({
  label: '流量时间范围',
  value: 300,
  size: 'sm',
  minPopupWidth: 180,
  items: [
    { value: 60, label: '最近 1 分钟' },
    { value: 300, label: '最近 5 分钟' },
    { value: 900, label: '最近 15 分钟' }
  ],
  onChange(value) { updateRange(value); }
});
container.append(range.element);
```

支持 `id`、`placeholder`、`size`、`block`、`disabled`、`minPopupWidth`（像素）和禁用选项。弹层宽度至少与触发器一致，并按最长选项和勾选图标扩展；视口两侧保留 12px。选项保持单行，超出视口容纳宽度时省略显示，可悬停查看完整文本。组合框提供方向键、Home / End、Enter、Escape 与字符定位。弹层根据视口空间向上或向下打开，在页面滚动、外部点击、窗口缩放或触发器卸载时关闭。在原生 dialog 内打开时，弹层保留在同一对话框中。

## 返回接口

两者均返回 `element`、`getValue()`、`setValue(value, { emit: false })`、`setDisabled(boolean)`、`destroy()`。`setValue()` 默认只更新显示；传入 `{ emit: true }` 才触发回调。无效值返回 `false`。

Select 另提供 `open()` / `close()`。`AerisControls.closeAll()` 关闭当前下拉弹层。创建组件不会提交表单；真实 LuCI 表单接入时由调用方对接配置值。

## 当前复用位置

- 概览：流量方向 Segment、时间范围 Select。
- 系统设置：所有下拉字段。
- 接口：状态筛选、接口和设备编辑、VLAN 表格下拉项。
- 组件库：单选、多选、禁用项、不同尺寸与下拉选中示例。

参考 Ecme Segment 实测：底槽 4px 内边距、12px 圆角；标准整体高 48px，选中块高 40px；浅色选中块为白色，带轻阴影。Select 延续 Ecme 的填充触发器和圆角选项弹层。
