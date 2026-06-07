# MysticDraw V2 视觉规范

## 1. 设计方向
- **Design Read**: mystical ritual tool for design-conscious seekers, premium cosmic language, eastern-mysticism-meets-western-tarot
- **Dials**: DESIGN_VARIANCE=9 / MOTION_INTENSITY=9 / VISUAL_DENSITY=4
- **Vibe**: 暗色 Editorial Luxury
- **Layout**: Z-Axis Cascade

## 2. 颜色系统

```
Background:    #050505 (纯 OLED 黑)
Surface:       #0a0a0f (深空)
Card Outer:    #111118 (卡片外框)
Card Inner:    #161620 (卡片内容区)
Accent Gold:   #c9a227 (月光金)
Accent Purple: #7c3aed (星云紫)
Text Primary:  #e8e6e3 (暖白)
Text Muted:    #6b6570 (暗紫灰)
Glow Gold:     rgba(201, 162, 39, 0.15)
Glow Purple:   rgba(124, 58, 237, 0.12)
```

## 3. 字体系统

- **标题 (H1/H2)**: `Playfair Display` + `Noto Serif SC`（衬线体，东方神秘感）
- **正文**: `Plus Jakarta Sans`（禁用 Inter/Roboto/Helvetica）
- **标签/辅助**: `Geist Mono` 或等宽字体
- **字重**: 标题用 400/500（细而优雅），正文用 400

## 4. 卡片规范（Double-Bezel）

塔罗牌必须用 **Double-Bezel** 结构：

```
Outer Shell:
  background: #111118
  border: 1px solid rgba(201, 162, 39, 0.15)  // 淡金边
  border-radius: 24px
  padding: 3px
  box-shadow: 
    0 0 0 1px rgba(201, 162, 39, 0.05),
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255,255,255,0.05)

Inner Core:
  background: #161620
  border-radius: 21px  // 24px - 3px
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.08)
  position: relative
  overflow: hidden
```

牌面必须有 **暗角 (vignette)**：
```css
&::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
  border-radius: inherit;
}
```

## 5. 纹理系统

### 全局噪点
```css
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); // noise SVG
}
```

### 卡片纹理
每张牌内芯添加细微的纸质纹理：
```css
background-image: 
  linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%),
  url("data:image/svg+xml,..."); // subtle grain
```

## 6. 动画规范（GSAP Timeline）

### 仪式动画时间线（洗牌）
```
Timeline:
  0.0s  → 牌堆轻微抖动（shake, 0.3s）
  0.3s  → 8张牌向四周飞散（scatter, 0.8s, ease: power3.out）
  1.1s  → 空中随机换位（swap positions, 0.6s）
  1.7s  → 牌飞回中心聚合（gather, 0.8s, ease: power2.inOut）
  2.5s  → 牌堆落定，金色光晕脉冲（glow pulse, 0.5s）
```

### 翻牌动画
```
Timeline:
  0.0s  → 牌背发光增强
  0.2s  → rotateY 0° → 90°（显示边缘）
  0.5s  → rotateY 90° → 180°（显示牌面）
  0.8s  → 牌面内容 fade-in + scale(0.95→1)
  1.0s  → 金色粒子从牌面散开（particle burst）
```

### Easing
- 主要: `cubic-bezier(0.32, 0.72, 0, 1)`（质量感弹簧）
- 飞散: `power3.out`
- 聚合: `power2.inOut`
- 悬停: `cubic-bezier(0.22, 1, 0.36, 1)`

## 7. 背景系统（多层）

Layer 0: `#050505` 纯色底
Layer 1: 径向渐变 `radial-gradient(ellipse at 30% 20%, #1a0b2e 0%, transparent 50%)`
Layer 2: 径向渐变 `radial-gradient(ellipse at 70% 80%, #0d1b2a 0%, transparent 40%)`
Layer 3: Canvas 2D 星星（100-200颗，轻微闪烁，不同大小）
Layer 4: 全局噪点 overlay（fixed, pointer-events-none, opacity 0.03）

## 8. 按钮规范（Island Button）

```
形状: rounded-full
 padding: px-8 py-4
背景: transparent
边框: 1px solid rgba(201, 162, 39, 0.3)
文字: #c9a227, tracking-widest, uppercase
悬停: 
  - 边框颜色 → rgba(201, 162, 39, 0.8)
  - 背景 → rgba(201, 162, 39, 0.05)
  - 内部光晕 → box-shadow: 0 0 30px rgba(201, 162, 39, 0.15)
  - scale: 0.98（按下感）
```

## 9. 禁止清单

- ❌ shadcn 默认卡片样式（不用 Card 组件）
- ❌ Inter / Roboto / Arial / Open Sans / Helvetica
- ❌ 标准 Lucide 粗线条图标（用细线版或自定义 SVG）
- ❌ 1px solid gray 边框
- ❌ shadow-md / rgba(0,0,0,0.3) 阴影
- ❌ linear / ease-in-out 默认过渡
- ❌ 对称的 3 列等宽布局
- ❌ AI-purple 渐变（除非作为微妙背景光晕）

## 10. 性能约束

- 所有动画: transform + opacity only
- backdrop-blur: 仅用于固定/粘性元素
- will-change: 仅用于活跃动画元素
- 粒子: Canvas 2D, 最多 300 颗
- GSAP: 使用 timeline batch 减少 DOM 操作
