import SceneController from "@/components/SceneController";
import StarField from "@/components/StarField";

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <StarField />
      <main className="relative z-10 min-h-[100dvh] flex flex-col overflow-y-auto">
        <SceneController />
      </main>
    </div>
  );
}
