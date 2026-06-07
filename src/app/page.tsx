import SceneController from "@/components/SceneController";
import StarField from "@/components/StarField";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      <main className="relative z-10 min-h-screen flex flex-col">
        <SceneController />
      </main>
    </div>
  );
}
