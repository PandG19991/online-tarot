# 🔮 MysticDraw

沉浸式在线塔罗牌占卜体验。

## 体验流程

1. **星空入口** — 深空粒子背景，品牌浮现
2. **选择牌阵** — 单张牌 / 三张牌（过去·现在·未来）/ 凯尔特十字
3. **洗牌仪式** — 3D 牌堆飞散、洗牌、聚合
4. **抽牌翻牌** — 逐张点击，3D 翻转揭示命运
5. **占卜师解读** — 打字机效果的诗意解读
6. **保存分享** — 生成精美的占卜结果卡片

## 技术栈

- Next.js 14 (App Router, Static Export)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (60fps 动画)
- Canvas 2D 星空粒子

## 数据

完整的 78 张塔罗牌：
- 大阿卡纳 22 张
- 小阿卡纳 56 张（权杖/圣杯/宝剑/星币）

## 本地开发

```bash
npm install
npm run dev
```

## 部署

### 方式 1: 一键脚本

```bash
# 1. 设置认证（只需一次）
./scripts/setup-auth.sh

# 2. 编辑 ~/.bashrc，添加:
export GITHUB_TOKEN='ghp_xxxxxxxx'
export VERCEL_TOKEN='vc_xxxxxxxx'

# 3. 重新加载
source ~/.bashrc

# 4. 一键部署
./scripts/deploy.sh
```

### 方式 2: 手动

```bash
# GitHub
git remote add origin https://github.com/你的用户名/online-tarot.git
git push -u origin main

# Vercel
npm install -g vercel
vercel --prod
```

## 项目结构

```
├── src/app/              # 主页面 + 布局
├── src/components/       # 组件
│   ├── SceneController.tsx   # 场景状态机
│   ├── LandingScene.tsx      # 入口场景
│   ├── StarField.tsx         # Canvas 星空
│   ├── TarotCard.tsx         # 3D 翻转卡片
│   ├── CardSpread.tsx        # 牌阵布局
│   ├── ShuffleAnimation.tsx  # 洗牌动画
│   ├── SpreadSelector.tsx    # 牌阵选择
│   ├── FortuneTeller.tsx     # 占卜师对话
│   ├── ReadingResult.tsx     # 解读面板
│   └── ShareCard.tsx         # 分享卡片
├── src/data/tarot.ts     # 78 张牌数据
├── src/hooks/            # 游戏逻辑
└── src/types/            # TypeScript 类型
```
