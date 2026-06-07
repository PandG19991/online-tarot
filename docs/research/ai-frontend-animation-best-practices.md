# AI 制作前端 + 前端动画 最佳实践调研

> 调研时间: 2026-06-07
> 来源: GitHub、Twitter/X、开源社区、技术博客

---

## 一、AI 前端开发三大工具对比

### 1. Claude Code (我们正在用的)

| 维度 | 评分 | 说明 |
|---|---|---|
| 复杂任务/架构推理 | ⭐⭐⭐⭐⭐ | 最佳，多步骤任务可 handoff |
| 跨文件重构 | ⭐⭐⭐⭐⭐ | Agent 模式可批量改代码 |
| 终端集成 | ⭐⭐⭐⭐⭐ | CLI 原生，适合 CI/CD |
| 实时补全 | ❌ | 没有 IDE 内联补全 |
| 定价 | 按量计费 | $20/月 Max 包 |

**最佳场景**: 批量重构、复杂动画编排、架构级改动、QA 审查自动化

### 2. Cursor

| 维度 | 评分 | 说明 |
|---|---|---|
| 实时补全 | ⭐⭐⭐⭐⭐ | 最强自动完成 |
| 项目上下文 | ⭐⭐⭐⭐⭐ | 整个代码库索引 |
| Composer 多文件 | ⭐⭐⭐⭐⭐ | 一键改多文件 |
| 架构推理 | ⭐⭐⭐ | 不如 Claude |
| 定价 | $20/月 Pro |

**最佳场景**: 日常编码、组件编写、快速原型

### 3. GitHub Copilot

| 维度 | 评分 | 说明 |
|---|---|---|
| 实时补全 | ⭐⭐⭐⭐ | 行级补全很强 |
| 跨文件协调 | ❌ | 不支持 |
| 定价 | $10/月 | 最便宜 |

**最佳场景**: 基础编码辅助、已有代码库维护

### 推荐组合 (Lead Frontend 2026 实测)

```
日常编码:     Copilot (80% 需求)  → $10/月
复杂重构:     Cursor Composer       → $20/月
架构/批量:    Claude Code           → $20/月
```

> 提速效果: 新代码 3-5x，重构 2-3x，调试 适度提升

---

## 二、AI 动画前端最佳实践

### 核心洞察: Motion Prompts (2026 新标准)

传统动画工作流:
```
学库 → 写代码 → 调参数 → 测试 → 发布 (数小时/天)
```

AI 时代工作流:
```
描述意图 → AI 生成代码 → 审查 → 发布 (数秒/分钟)
```

**Motion Prompts** = 把动画专家知识编码成 Prompt，让 AI 自动应用:
- spring 参数 (damping/stiffness)
- 时序关系 (stagger/delay)
- 可访问性 (reduced-motion)
- 退出动画 (exit animations)

> 这就是为什么 "Framer Motion" "GSAP" 的 Google Trends 在下降——不是技术死了，是**接口变了**，从读文档变成了写 prompt。

### 动画库选择 (AI 生成一致性排名)

| 库 | AI 生成一致性 | 适用场景 |
|---|---|---|
| **Framer Motion** | ⭐⭐⭐⭐⭐ | React 组件动画、声明式 API 最适配 AI |
| **GSAP** | ⭐⭐⭐ | 复杂 timeline 序列，AI 生成不够稳定 |
| **CSS Transitions** | ⭐⭐⭐⭐⭐ | 简单 opacity/transform，最轻量 |
| **View Transitions API** | ⭐⭐⭐ | 页面级过渡，浏览器原生 |

**结论**: 让 AI 写 Framer Motion 最可靠，GSAP 需要更详细的 prompt。

---

## 三、约束 AI 的 Skill / Prompt 方法

### 方法 1: AGENTS.md (通用标准)

由 Builder.io 推广，支持 Claude Code、Cursor、Codex、Kimi 等。

```markdown
# AGENTS.md

### Do
- 使用 React 18 + TypeScript
- 使用 Tailwind CSS v4
- 动画统一用 GSAP，组件卸载时必须 kill() tween
- 使用 design tokens，禁止硬编码颜色
- 小文件小 diff，禁止全仓库重写

### Don't
- 不要在新组件里用内联 style
- 不要添加重型依赖（>50KB）未经批准
- 不要遗忘 useEffect cleanup

### Commands
# 单文件检查（优先）
npx tsc --noEmit path/to/file.tsx
npx eslint --fix path/to/file.tsx

# 全构建（少用）
npm run build
```

**效果**: 加了 AGENTS.md 后，AI 输出准确率显著提升——正确的库版本、正确的状态管理、正确的设计 token。

### 方法 2: Motion Prompts (动画专用)

Cursor Rules / Claude Project Knowledge / Lovable prompt 中嵌入:

```markdown
## Animation Rules

### Timing
- Entrance: 0.4-0.6s, ease: power2.out
- Exit: 0.25-0.3s, ease: power2.in
- Stagger: 0.08-0.12s between items
- Spring: damping 25, stiffness 250

### GPU 加速
- 只用 transform + opacity 做动画
- 禁止 animating width/height/top/left

### 可访问性
- 所有动画支持 prefers-reduced-motion
- 焦点状态必须有 visible outline

### Cleanup
- 所有 gsap.to/timeline 必须存储 ref
- useEffect return 中必须 kill()
```

### 方法 3: 专用 Skill (Claude Code / Cursor)

**AetherPane** (github.com/lihytaihe-lang/aetherpane)
- AI-first Web UI 设计系统
- 9 个生产级设计模式 (Hero×3, Card×3, Layout×3)
- 设计评分系统 (视觉层次、呼吸空间、玻璃质感、排版)
- 多 Agent 协作: Claude(结构) + Kimi(视觉打磨) + Cursor(通用开发)

**GSAP Skill** (awesomeskill.ai)
- 专注 GSAP 动画生命周期管理
- 强调组件 mount/unmount 时的 cleanup
- TDD 实践 + 性能优化 (transform/opacity only)

**Aptos Agent Skills** (github.com/aptos-labs/aptos-agent-skills)
- 示例: Skill 自动根据开发者意图激活
- "Create a new dApp" → 脚手架
- "Add a frontend" → TS SDK 集成

---

## 四、推荐工作流程

### 流程 A: AI 驱动的设计 → 代码 (推荐)

```
1. 设计阶段
   └── 用 Figma / AI 生成设计图
   └── 提取 Design Tokens (颜色、间距、字体)

2. 架构阶段 (Claude Code)
   └── AGENTS.md 定义规则
   └── 运行 /frontend-architect skill
   └── 输出: architecture-proposal.md

3. 实现阶段 (Claude Code + Cursor)
   ├── CEO-Agent 编排任务
   ├── Design Worker → 视觉规范
   ├── Dev Worker × 4 → 并行写组件
   └── QA Worker → 代码审查

4. 动画阶段 (Motion Prompts)
   └── 在 AGENTS.md 中定义动画规范
   └── AI 自动应用统一的 timing/easing
   └── 人工微调关键帧

5. 验收阶段
   ├── ESLint 自定义规则检查
   ├── Playwright 截图对比
   └── Vercel 预览部署
```

### 流程 B: Vibe Coding (快速原型)

```
1. 描述需求 → AI 生成完整页面
2. 截图反馈 → AI 调整
3. 重复直到满意
```

> 适合: MVP、Landing Page、个人项目
> 不适合: 复杂交互、多页面应用、生产级代码

---

## 五、有用的 GitHub 项目

| 项目 | 用途 | Stars |
|---|---|---|
| [AetherPane](https://github.com/lihytaihe-lang/aetherpane) | AI-first UI 设计系统 + 多 Agent 协作 | - |
| [frontend-craft-openclaw](https://github.com/bovinphang/frontend-craft-openclaw) | 前端 Agent Playbooks (架构/性能/UI/安全) | - |
| [claude-agents-library](https://github.com/aiagentskit/claude-agents-library) | Claude Code Agent 角色库 | - |
| [aptos-agent-skills](https://github.com/aptos-labs/aptos-agent-skills) | Skill 自动路由示例 | - |
| [agent-skills](https://github.com/practicalswan/agent-skills) | 跨客户端 Skill (Copilot/Codex/Claude) | - |

---

## 六、给我们的项目 (MysticDraw) 的建议

### 立即可做的改进

1. **完善 AGENTS.md**
   - 添加动画规范 (GSAP timing/cleanup)
   - 添加 Design Tokens (颜色、字体、间距)
   - 添加单文件检查命令

2. **引入 Motion Prompts**
   - 统一所有场景的过渡时长 (0.6s)
   - 统一 easing (power2.inOut)
   - 定义 reduced-motion 回退

3. **QA 自动化**
   - ESLint 自定义规则 (已做 ✅)
   - GitHub Actions CI (已做 ✅)
   - 添加 Playwright 截图测试

4. **Design System**
   - 用 AetherPane 的评分系统审查现有 UI
   - 提取可复用的卡片、按钮、面板组件

### 长期建议

1. **Multi-Agent 协作**
   - Design Agent: 负责视觉一致性
   - Animation Agent: 负责 GSAP 动画编排
   - QA Agent: 负责跨组件链路审查

2. **Motion Prompt 库**
   - 把翻牌、洗牌、场景过渡的动画参数编码成 Prompt
   - 新项目可以直接复用

---

## 参考链接

- [AGENTS.md Best Practices](https://www.builder.io/blog/agents-md) — Builder.io
- [Cursor vs Claude Code vs Copilot](https://www.mikul.me/blog/ai-powered-frontend-development-cursor-copilot-claude) — 2026 对比
- [UI Motion Prompts 2026](https://uimotionprompts.com/blog/complete-guide-ui-motion-2026) — 动画 Prompt 指南
- [React Animations via AI Prompts](https://uimotionprompts.com/blog/react-animations-easy-way-ai-prompts) — 工作流转变
- [Awesome Skills](https://www.awesomeskills.dev) — Skill 市场
