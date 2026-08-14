# Agent Note：内置安洁莉娜亮色与暗色主题

Status: implemented

[English](2026-08-14-angelina-themes.md) | 中文

## 问题

Codex Dream Skin Switcher 包含两套协同设计的安洁莉娜外观：亮色的 Gravity Field 与暗色的 Midnight Gravity。它们不只是壁纸，而是分别把 hero 主图、柔化后的活跃会话图、可读表面、语义颜色、代码语法、滚动条和响应式人物位置组合成完整主题。DeepSeek Harness 原本只把浅色、深色与跟随系统暴露为可持久化的产品偏好；若只把一张壁纸复制到某个功能样式表，大多数表面仍会沿用默认调色板，插件加载前还会闪过中性主题，也没有成对选择与持久化约定。

## 决策

该 fork 将 `angelina-light` 与 `angelina-dark` 作为一等内置偏好，与浅色、深色、跟随系统并列。这一点刻意区别于第三方主题包：两个 id 都进入 Host settings schema，出现在现有外观设置行中，通过 `ui-theme.preference` 持久化，并参与同步的 index bootstrap。面向外部主题的既有 `ThemeRuntime.register()` 扩展保持不变。

每套安洁莉娜定义都精确覆写组装后 Web 客户端声明或消费的语义 CSS 变量词汇。一个扫描仓库样式的测试会动态推导这份词汇，要求两套定义覆盖同一份完整集合，并拒绝过期或未使用的条目。定义与 token 字典均被冻结，并各自保留 `colorScheme`，因此原生控件与默认暗色调色板属性不会从 id 字符串猜测配色方案。

全局 `angelina.css` 样式表拥有图片呈现。ui-layout 与 ui-conversation 为应用框架、会话栏和 composer 模式暴露与主题无关的状态标记；功能样式不会按安洁莉娜 id 分支。空会话使用清晰 hero 图并保留宿主的默认 composer 位置，活跃会话则使用轻度柔化、仍保留人物与环境细节的 thread 图。输入框、composer、菜单、listbox 与 dialog 只在自身叶节点表面应用磨砂玻璃；应用框架和侧栏祖先不使用滤镜，使固定浮层继续相对视口定位。

六张位图资源位于主题包内，并随发布的样式产物一起复制。`AngelinaParallaxController` 以 Codex 亮色主题原有的前景和后景幅度复刻双层指针视差。标题、选择器、composer、控件及其他界面文字在宿主布局中保持静止。暗色主题没有拆分的前景图，因此降级为单层背景的小幅移动。窗口失焦或页面隐藏时指针状态会归零，触摸输入会被忽略，窄视口和 `prefers-reduced-motion` 则渲染静止图层。

在 600px 及以下视口中，共享设置外壳会把固定侧栏折叠为紧凑的 2×2 顶部导航，从而保留可读的选项列宽，并让五个外观预览无需横向溢出即可选择。

Host bootstrap 会在外壳绘制前应用选中的安洁莉娜 token 与解析后的主题属性，同时通过一个瞬时交接属性记录自己写入的全部内联 token 名。ThemePresenter 首次 apply 时会先原子撤销这批变量，再写入客户端快照，从而避免启动阶段从安洁莉娜切换到中性主题时残留旧变量，同时保留无关的内联样式。

## 参考实现

[orxz/deepseek-harness-themes](https://github.com/orxz/deepseek-harness-themes) 验证了原生 `ThemeDefinition` 与 registry 形状、只覆写语义 token 的边界、完整 token 测试，以及普通第三方 id 需要独立持久化 namespace 的规则。[TQSY114514/dsh-ui-appearance](https://github.com/TQSY114514/dsh-ui-appearance) 验证了 token 覆写、图片图层和毛玻璃效果应具有明确所有权与清理路径。[xiaoloveying/deepseek_harness_theme](https://github.com/xiaoloveying/deepseek_harness_theme) 展示了自包含壁纸插件与 profile 安装路径，但其强制单一暗色外观无法满足成对内置偏好和首屏 bootstrap。图片构图来自 [bilbillm/Codex-Dream-Skin-Switcher](https://github.com/bilbillm/Codex-Dream-Skin-Switcher)。

## 曾考虑的替代方案

**只发布独立第三方插件。** 不作为该 fork 的唯一集成方式：插件会在外壳之后加载，拥有第二个设置行与 namespace，并且无法让所选调色板在插件前阶段成为权威来源。独立配套插件仍负责向其他 DeepSeek Harness 安装分发主题，而 fork 内置集成负责首屏与原生偏好持久化。

**只注入一个固定背景层并保留默认 token。** 否决：Codex 主题会让背景画面与所有主要语义表面协同工作。默认蓝灰面板叠在安洁莉娜图像上会降低对比度，使结果退化为壁纸覆盖层，而不是完整主题。

**在各功能样式表内分别分支。** 否决：功能包应暴露状态，而不应知道主题 id。由主题拥有的一张全局样式表可以把移除、响应式行为和未来主题扩展都限制在主题包内。

## 后果

外观设置行提供五个响应式预览，并通过与中性偏好相同的 Host-backed 路径持久化任一安洁莉娜变体。首屏、加载外壳、空会话、活跃会话、磨砂表面、代码块和原生浏览器 chrome 共用同一个解析后的配色方案与 token 权威来源。Web bundle 包含六张主题图片、一张样式表和一个可完整清理的指针控制器；资源引用、动效限制与清理行为均有测试。今后修改 Web 语义 token 集合时，必须明确同步更新两套安洁莉娜调色板。

## 测试

单元测试固定五值 settings schema、bootstrap 主题 id 与 token 交接、ThemeRuntime 持久化、五项设置预览、ThemePresenter 清理、完整 token 集合、样式表导入、六张发布图片的全部引用、亮色主题精确图片视差幅度、静止的界面内容、暗色克制降级、减弱动效与卸载清理。类型检查与完整包构建覆盖 Host／client 分工和输出资源。浏览器验收覆盖桌面与移动端的亮暗两套主题，并检查空会话、活跃会话、设置、磨砂浮层与指针移动。
