"use client";

import { useState, useCallback, useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import type { Scene, SpreadType, TarotCard, DrawnCard, GameState } from "@/types/tarot";
import LandingScene from "./LandingScene";
import SpreadSelector from "./SpreadSelector";
import ShuffleAnimation from "./ShuffleAnimation";
import CardSpread from "./CardSpread";
import ReadingResult from "./ReadingResult";
import FortuneTeller from "./FortuneTeller";
import ShareCard from "./ShareCard";

/* ============================================================
   Deck & helpers
   ============================================================ */

function createMajorArcanaDeck(): TarotCard[] {
  const majorArcana: TarotCard[] = [
    { id: "0", name: "愚者", nameEn: "The Fool", number: 0, arcana: "major", keywords: ["开端", "自由", "冒险"], upright: "新的开始，纯真的信任，自发性的行动", reversed: "鲁莽，轻率，缺乏计划", fortuneTellerText: { upright: "新的旅程即将开始，相信你的直觉。", reversed: "请谨慎行事，不要盲目冒险。" }, symbolism: "悬崖边的年轻人，背负着小包裹，脚边有一只狗", element: "air" },
    { id: "1", name: "魔术师", nameEn: "The Magician", number: 1, arcana: "major", keywords: ["创造", "意志", "显化"], upright: "意志力，创造力，资源整合", reversed: "欺骗，操控，技能误用", fortuneTellerText: { upright: "你拥有实现目标所需的所有资源。", reversed: "小心有人可能在利用你。" }, symbolism: "桌上的圣杯、宝剑、权杖和星币，一手指天一手指地", element: "air" },
    { id: "2", name: "女祭司", nameEn: "The High Priestess", number: 2, arcana: "major", keywords: ["直觉", "神秘", "内在"], upright: "直觉，潜意识，内在智慧", reversed: "秘密，隐藏的动机，忽视直觉", fortuneTellerText: { upright: "相信你的直觉，答案就在你心中。", reversed: "可能有你不知道的秘密。" }, symbolism: "坐在黑白柱子之间的女性，脚边有月亮", element: "water" },
    { id: "3", name: "皇后", nameEn: "The Empress", number: 3, arcana: "major", keywords: ["丰饶", "母性", "创造"], upright: "丰饶，母性，创造力，感官享受", reversed: "依赖，空虚，创造力受阻", fortuneTellerText: { upright: "丰盛和创造力正围绕着你。", reversed: "你可能感到缺乏滋养和支持。" }, symbolism: "坐在麦田中的女性，手持权杖，周围是丰饶的自然", element: "earth" },
    { id: "4", name: "皇帝", nameEn: "The Emperor", number: 4, arcana: "major", keywords: ["权威", "结构", "稳定"], upright: "权威，结构，father figure，控制", reversed: "专横，僵化，滥用权力", fortuneTellerText: { upright: "建立结构和秩序将帮助你成功。", reversed: "注意不要过于控制或僵化。" }, symbolism: "坐在王座上的男性，手持权杖和球体，背后是山脉", element: "fire" },
    { id: "5", name: "教皇", nameEn: "The Hierophant", number: 5, arcana: "major", keywords: ["传统", "信仰", "教导"], upright: "传统，精神指引，遵循规则", reversed: "反叛，非传统，打破规则", fortuneTellerText: { upright: "寻求智慧的传统来源。", reversed: "你可能需要打破常规思维。" }, symbolism: "坐在两根柱子之间的宗教领袖，面前有两名信徒", element: "earth" },
    { id: "6", name: "恋人", nameEn: "The Lovers", number: 6, arcana: "major", keywords: ["爱", "选择", "和谐"], upright: "爱情，选择，和谐，价值观一致", reversed: "不和谐，错误的选择，价值观冲突", fortuneTellerText: { upright: "重要的关系和选择正等着你。", reversed: "关系中可能存在价值观冲突。" }, symbolism: "亚当和夏娃在天使祝福下，蛇在苹果树旁", element: "air" },
    { id: "7", name: "战车", nameEn: "The Chariot", number: 7, arcana: "major", keywords: ["意志", "胜利", "控制"], upright: "意志力，胜利，决心，控制对立面", reversed: "失控，失败，缺乏方向", fortuneTellerText: { upright: "通过意志力你将克服一切障碍。", reversed: "你可能感到失去控制。" }, symbolism: "战车由两只狮身人面兽拉动，一黑一白", element: "water" },
    { id: "8", name: "力量", nameEn: "Strength", number: 8, arcana: "major", keywords: ["勇气", "耐心", "内在力量"], upright: "内在力量，勇气，耐心，同情心", reversed: "软弱，自我怀疑，缺乏信心", fortuneTellerText: { upright: "用温柔和耐心驯服你的野兽。", reversed: "你可能感到内心力量不足。" }, symbolism: "女性温柔地合上狮子的嘴巴，头上是无限符号", element: "fire" },
    { id: "9", name: "隐士", nameEn: "The Hermit", number: 9, arcana: "major", keywords: ["内省", "孤独", "指引"], upright: "内省，孤独，寻求真理，精神指引", reversed: "孤立，孤独，迷失方向", fortuneTellerText: { upright: "独处一段时间将带来深刻的洞察。", reversed: "不要把自己完全孤立起来。" }, symbolism: "手持灯笼的老人站在山顶，灯笼中有六芒星", element: "earth" },
    { id: "10", name: "命运之轮", nameEn: "Wheel of Fortune", number: 10, arcana: "major", keywords: ["命运", "周期", "转变"], upright: "命运，周期，转折点，好运", reversed: "厄运，抵抗改变，失控", fortuneTellerText: { upright: "命运之轮正在转向对你有利的方向。", reversed: "低谷是暂时的，周期会再次上升。" }, symbolism: "巨大的轮盘，四角有四种福音书作者的象征", element: "fire" },
    { id: "11", name: "正义", nameEn: "Justice", number: 11, arcana: "major", keywords: ["公正", "平衡", "因果"], upright: "公正，平衡，因果，法律", reversed: "不公正，不平衡，逃避责任", fortuneTellerText: { upright: "公正和平衡将占上风。", reversed: "可能有某种不公正正在发生。" }, symbolism: "手持天平和宝剑的女性，坐在两根柱子之间", element: "air" },
    { id: "12", name: "倒吊人", nameEn: "The Hanged Man", number: 12, arcana: "major", keywords: ["牺牲", "等待", "视角"], upright: "牺牲，暂停，新视角，放手", reversed: "抗拒，拖延，无意义的牺牲", fortuneTellerText: { upright: "有时退一步能看到全新的视角。", reversed: "你可能在抗拒必要的改变。" }, symbolism: "倒吊在树上的男性，一条腿弯曲成三角形", element: "water" },
    { id: "13", name: "死神", nameEn: "Death", number: 13, arcana: "major", keywords: ["结束", "转变", "新生"], upright: "结束，转变，释放，新的开始", reversed: "抗拒改变，停滞，无法放手", fortuneTellerText: { upright: "一个周期正在结束，为新的开始让路。", reversed: "你可能在抗拒必要的结束。" }, symbolism: "骷髅骑士骑着白马，国王、主教、妇女和儿童在他脚下", element: "water" },
    { id: "14", name: "节制", nameEn: "Temperance", number: 14, arcana: "major", keywords: ["平衡", "调和", "耐心"], upright: "平衡，调和，耐心，适度", reversed: "极端，失衡，过度放纵", fortuneTellerText: { upright: "找到中间道路将带来和谐。", reversed: "你可能在走向某个极端。" }, symbolism: "天使将两个杯中的水混合，一只脚在水中一只在陆地", element: "fire" },
    { id: "15", name: "恶魔", nameEn: "The Devil", number: 15, arcana: "major", keywords: ["束缚", "欲望", "物质"], upright: "束缚，物质主义，诱惑，成瘾", reversed: "释放，摆脱束缚，重获自由", fortuneTellerText: { upright: "注意你可能被某种欲望或恐惧束缚。", reversed: "你正在摆脱束缚你的枷锁。" }, symbolism: "有角有翼的恶魔，亚当和夏娃被锁链拴住", element: "earth" },
    { id: "16", name: "塔", nameEn: "The Tower", number: 16, arcana: "major", keywords: ["突变", "崩塌", "觉醒"], upright: "突变，崩塌，突然的变化，觉醒", reversed: "避免灾难，延迟不可避免的事", fortuneTellerText: { upright: "突然的变化将揭示隐藏的真相。", reversed: "你可能在逃避必要的改变。" }, symbolism: "被闪电击中的高塔，人们从窗户坠落", element: "fire" },
    { id: "17", name: "星星", nameEn: "The Star", number: 17, arcana: "major", keywords: ["希望", "灵感", "宁静"], upright: "希望，灵感，宁静，精神指引", reversed: "绝望，失去信心，缺乏灵感", fortuneTellerText: { upright: "希望之光正在照亮你的道路。", reversed: "不要失去对未来的信心。" }, symbolism: "裸身女性跪在溪边，从两个壶中倒水", element: "air" },
    { id: "18", name: "月亮", nameEn: "The Moon", number: 18, arcana: "major", keywords: ["幻觉", "恐惧", "潜意识"], upright: "幻觉，恐惧，潜意识，直觉", reversed: "困惑，恐惧消退，真相大白", fortuneTellerText: { upright: "事情可能不像表面看起来那样。", reversed: "迷雾正在散去，真相即将显现。" }, symbolism: "月亮照耀着两条小径，一只狗和一只狼在嚎叫", element: "water" },
    { id: "19", name: "太阳", nameEn: "The Sun", number: 19, arcana: "major", keywords: ["喜悦", "成功", "活力"], upright: "喜悦，成功，活力，清晰", reversed: "暂时的抑郁，自我怀疑，乌云遮日", fortuneTellerText: { upright: "光明和温暖正照耀着你。", reversed: "可能会有暂时的阴影，但阳光终会回来。" }, symbolism: "灿烂的太阳照耀着花园中裸身的孩子", element: "fire" },
    { id: "20", name: "审判", nameEn: "Judgement", number: 20, arcana: "major", keywords: ["重生", "觉醒", "评价"], upright: "重生，觉醒，自我评价，召唤", reversed: "自我怀疑，拒绝召唤，缺乏自省", fortuneTellerText: { upright: "一个深刻的觉醒和重生正在发生。", reversed: "你可能在忽视内心的召唤。" }, symbolism: "天使吹响号角，人们从坟墓中升起", element: "fire" },
    { id: "21", name: "世界", nameEn: "The World", number: 21, arcana: "major", keywords: ["完成", "圆满", "成就"], upright: "完成，圆满，成就，整合", reversed: "未完成，缺乏 closure，空虚", fortuneTellerText: { upright: "一个完整的周期已经圆满完成。", reversed: "可能还有未完成的任务。" }, symbolism: "裸身女性被花环包围，手持两根权杖", element: "earth" },
  ];
  return majorArcana;
}

function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getSpreadCardCount(spreadType: SpreadType): number {
  switch (spreadType) {
    case "single": return 1;
    case "three": return 3;
    case "celtic": return 10;
  }
}

function getPositionLabel(spreadType: SpreadType, position: number): string {
  switch (spreadType) {
    case "single": return "今日指引";
    case "three":
      return ["过去", "现在", "未来"][position] || "";
    case "celtic":
      return [
        "现状", "阻碍", "基础", "过去", "目标",
        "未来", "自我", "环境", "希望/恐惧", "结果"
      ][position] || "";
  }
}

/* ============================================================
   SceneRenderer — declared outside SceneController to satisfy
   React static component rules.
   ============================================================ */

interface SceneRendererProps {
  scene: Scene;
  gameState: GameState;
  revealedIndices: number[];
  onTransition: (scene: Scene) => void;
  onSelectSpread: (spread: SpreadType) => void;
  onRevealCard: (index: number) => void;
  onSelectCard: (index: number) => void;
  onReset: () => void;
}

function SceneRenderer({
  scene,
  gameState,
  revealedIndices,
  onTransition,
  onSelectSpread,
  onRevealCard,
  onSelectCard,
  onReset,
}: SceneRendererProps) {
  switch (scene) {
    case "landing":
      return <LandingScene onStart={() => onTransition("spread-select")} />;

    case "spread-select":
      return (
        <div className="flex flex-col items-center justify-center min-h-full px-6 py-20">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            选择牌阵
          </h2>
          <p className="text-[var(--text-muted)] mb-12 text-center max-w-md">
            不同的牌阵揭示不同层面的信息，选择最适合你当下问题的牌阵
          </p>
          <SpreadSelector
            onSelect={onSelectSpread}
            selected={gameState.spreadType}
          />
          <button
            onClick={() => onTransition("landing")}
            className="mt-12 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm"
          >
            ← 返回首页
          </button>
        </div>
      );

    case "shuffling":
      return (
        <div className="flex flex-col items-center justify-center min-h-full px-6">
          <ShuffleAnimation />
          <p className="mt-8 text-xl text-[var(--text-muted)] text-center">
            正在与宇宙建立连接...
          </p>
        </div>
      );

    case "drawing": {
      const totalCards = getSpreadCardCount(gameState.spreadType);
      const allRevealed = revealedIndices.length >= totalCards && revealedIndices.length > 0;
      const isThree = gameState.spreadType === "three";

      return (
        <div className="flex flex-col items-center justify-center min-h-full px-6 py-20">
          {/* Title — fades out when all revealed (three spread) */}
          <h2
            className={`text-2xl sm:text-3xl font-bold text-white mb-2 transition-opacity duration-700 ${isThree && allRevealed ? 'opacity-0' : 'opacity-100'}`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            抽取塔罗牌
          </h2>
          <p
            className={`text-[var(--text-muted)] mb-10 text-center transition-opacity duration-700 ${isThree && allRevealed ? 'opacity-0' : 'opacity-100'}`}
          >
            点击牌背逐张翻开，共需翻开 {totalCards} 张牌
          </p>
          <CardSpread
            spreadType={gameState.spreadType}
            drawnCards={gameState.drawnCards}
            revealedIndices={revealedIndices}
            selectedIndex={gameState.selectedCardIndex}
            onCardClick={onRevealCard}
          />
          {/* Counter — hidden for three spread (shown inside CardSpread) */}
          {(!isThree || !allRevealed) && (
            <p className="mt-8 text-[var(--text-muted)] text-sm">
              已翻开 {revealedIndices.length} / {totalCards} 张
            </p>
          )}
        </div>
      );
    }

    case "reading":
      return (
        <div className="flex flex-col items-center min-h-full px-6 py-20 max-w-4xl mx-auto w-full pb-[320px]">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            塔罗解读
          </h2>
          <p className="text-[var(--text-muted)] mb-8 text-center">
            点击单张牌查看详细解读
          </p>
          <ReadingResult
            drawnCards={gameState.drawnCards}
            spreadType={gameState.spreadType}
            onCardSelect={onSelectCard}
            selectedIndex={gameState.selectedCardIndex}
          />
          <div className="mt-10 w-full">
            <ShareCard
              drawnCards={gameState.drawnCards}
              spreadType={gameState.spreadType}
            />
          </div>
          <button onClick={onReset} className="mt-10 island-button">
            再次占卜
          </button>
        </div>
      );

    default:
      return null;
  }
}

/* ============================================================
   SceneController
   ============================================================ */

export default function SceneController() {
  const [gameState, setGameState] = useState<GameState>({
    scene: "landing",
    spreadType: "single",
    deck: [],
    drawnCards: [],
    isShuffling: false,
    selectedCardIndex: null,
  });

  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene>("landing");
  const [exitingScene, setExitingScene] = useState<Scene | null>(null);

  const currentRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------- cleanup on unmount ---------- */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /* ---------- transition engine ---------- */

  const transitionTo = useCallback((next: Scene) => {
    if (next === currentScene || exitingScene) return;
    setExitingScene(currentScene);
    setCurrentScene(next);
  }, [currentScene, exitingScene]);

  useLayoutEffect(() => {
    if (!exitingScene || !exitingRef.current || !currentRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (currentRef.current) {
          gsap.set(currentRef.current, { clearProps: "opacity,transform,filter" });
        }
        setExitingScene(null);
      },
    });

    tl.to(exitingRef.current, {
      opacity: 0,
      scale: 0.95,
      filter: "blur(4px)",
      duration: 0.6,
      ease: "power2.inOut",
    });

    gsap.set(currentRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: "blur(4px)",
    });

    tl.to(
      currentRef.current,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.inOut",
      },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, [exitingScene]);

  /* ---------- game actions ---------- */

  const selectSpread = useCallback((spreadType: SpreadType) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const deck = shuffleDeck(createMajorArcanaDeck());
    transitionTo("shuffling");
    setGameState((prev) => ({
      ...prev,
      spreadType,
      scene: "shuffling",
      isShuffling: true,
      deck,
      drawnCards: [],
      selectedCardIndex: null,
    }));
    setRevealedIndices([]);

    timeoutRef.current = setTimeout(() => {
      const count = getSpreadCardCount(spreadType);
      const drawn: DrawnCard[] = [];
      for (let i = 0; i < count; i++) {
        const card = deck[i];
        const isReversed = Math.random() < 0.15;
        drawn.push({
          card,
          isReversed,
          position: i,
          positionLabel: getPositionLabel(spreadType, i),
        });
      }
      setGameState((prev) => ({
        ...prev,
        scene: "drawing",
        isShuffling: false,
        drawnCards: drawn,
        selectedCardIndex: null,
      }));
      transitionTo("drawing");
    }, 3000);
  }, [transitionTo]);

  const revealCard = useCallback((index: number) => {
    setRevealedIndices((prev) => {
      if (prev.includes(index)) return prev;
      return [...prev, index];
    });
  }, []);

  const selectCard = useCallback((index: number) => {
    setGameState((prev) => ({
      ...prev,
      selectedCardIndex: prev.selectedCardIndex === index ? null : index,
    }));
  }, []);

  const resetGame = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGameState({
      scene: "landing",
      spreadType: "single",
      deck: [],
      drawnCards: [],
      isShuffling: false,
      selectedCardIndex: null,
    });
    setRevealedIndices([]);
    transitionTo("landing");
  }, [transitionTo]);

  /* ---------- auto-transition when all cards revealed ---------- */

  useLayoutEffect(() => {
    if (currentScene === "drawing") {
      const total = getSpreadCardCount(gameState.spreadType);
      if (revealedIndices.length >= total && revealedIndices.length > 0) {
        // Extended delay for three-card spread preview animation:
        // card rise (0.8s) + preview fade-in (0.8s@0.4s) + user reading time
        const delay = gameState.spreadType === "three" ? 4500 : 1200;
        const timer = setTimeout(() => transitionTo("reading"), delay);
        return () => clearTimeout(timer);
      }
    }
  }, [revealedIndices, currentScene, gameState.spreadType, transitionTo]);

  const sharedRendererProps: Omit<SceneRendererProps, "scene"> = {
    gameState,
    revealedIndices,
    onTransition: transitionTo,
    onSelectSpread: selectSpread,
    onRevealCard: revealCard,
    onSelectCard: selectCard,
    onReset: resetGame,
  };

  return (
    <div className="relative z-10 flex flex-col min-h-[100dvh]">
      {/* Scene transition layer */}
      <div className="relative flex-1 overflow-hidden">
        {exitingScene && (
          <div
            ref={exitingRef}
            className="absolute inset-0 pointer-events-none"
          >
            <SceneRenderer scene={exitingScene} {...sharedRendererProps} />
          </div>
        )}
        <div
          ref={currentRef}
          className={`absolute inset-0 ${exitingScene ? "pointer-events-none" : ""}`}
          style={{ opacity: exitingScene ? 0 : 1 }}
        >
          <SceneRenderer scene={currentScene} {...sharedRendererProps} />
        </div>
      </div>

      {/* FortuneTeller overlay — fixed at bottom */}
      <FortuneTeller
        drawnCards={gameState.drawnCards}
        spreadType={gameState.spreadType}
        isVisible={currentScene === "reading"}
      />
    </div>
  );
}
