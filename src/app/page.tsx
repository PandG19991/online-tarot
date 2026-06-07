import SceneController from "@/components/SceneController";

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      {/* ── VAKH-style Fluid Mesh Background ── */}
      <div className="fluid-mesh-bg">
        <div className="fluid-blob blob-purple" />
        <div className="fluid-blob blob-amber" />
        <div className="fluid-blob blob-indigo" />
        <div className="fluid-blob blob-teal" />
      </div>

      {/* ── CRT Scanline Overlay ── */}
      <div className="crt-scanlines" />

      {/* ── Dot Grid Pattern ── */}
      <div className="dot-grid-bg" />

      {/* ── Main Content ── */}
      <main className="relative z-10 min-h-[100dvh] flex flex-col overflow-y-auto">
        <SceneController />
      </main>
    </div>
  );
}
