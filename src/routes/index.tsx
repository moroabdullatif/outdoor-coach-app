import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings, Leaf, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Touch Grass Coach — Outdoor Workouts" },
      { name: "description", content: "Pick a park or trail workout and start an outdoor session with your voice coach." },
      { property: "og:title", content: "Touch Grass Coach" },
      { property: "og:description", content: "Park calisthenics and trail fitness, coached." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const KEY = "tgc.elevenlabs";

const ROUTINES: Record<string, string[]> = {
  park: [
    "Alright, let's touch some grass! Step one: find a bench and do ten incline push-ups, nice and controlled.",
    "Step two: twenty walking lunges across the grass. Keep your chest tall and breathe.",
    "Step three: hang from a bar or tree branch for thirty seconds, then shake it out. Repeat the circuit three times. You've got this!",
  ],
  trail: [
    "Welcome to the trail! Step one: brisk walk for five minutes to warm up, swinging your arms.",
    "Step two: find a small hill and do six uphill sprints, walking back down to recover.",
    "Step three: at the top, hold a squat for thirty seconds while you enjoy the view. Then cruise home at an easy jog. Great work!",
  ],
};

// Simulated Gemma response — swap for a real model call later.
async function simulateGemma(workout: string) {
  await new Promise((r) => setTimeout(r, 1200));
  return ROUTINES[workout].join(" ");
}

function Index() {
  const [apiKey, setApiKey] = useState("");
  const [workout, setWorkout] = useState("park");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [routine, setRoutine] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => setApiKey(localStorage.getItem(KEY) ?? ""), []);

  const save = () => {
    localStorage.setItem(KEY, apiKey.trim());
    toast.success("API key saved on this device");
  };

  const start = async () => {
    const key = apiKey.trim();
    if (!key) {
      toast.error("Add your ElevenLabs API key in settings first");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      setStatus("Coach is thinking…");
      const text = await simulateGemma(workout);
      setRoutine(text);
      setStatus("Generating voice…");
      const res = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb?output_format=mp3_44100_128",
        {
          method: "POST",
          headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
          body: JSON.stringify({ text, model_id: "eleven_turbo_v2_5" }),
        },
      );
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`ElevenLabs error ${res.status}: ${body.slice(0, 200)}`);
      }
      const blob = await res.blob();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setStatus("Playing your routine");
      requestAnimationFrame(() => audioRef.current?.play().catch(() => setStatus("Tap play to listen")));
    } catch (e) {
      setStatus("");
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-extrabold">Touch Grass Coach</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Settings"><Settings /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle className="font-display">Settings</SheetTitle>
              <SheetDescription>Your key stays on this device.</SheetDescription>
            </SheetHeader>
            <div className="space-y-3 px-4">
              <Label htmlFor="key">ElevenLabs API key</Label>
              <Input id="key" type="password" placeholder="sk_..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <Button className="w-full" onClick={save}>Save key</Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <section className="mt-10 space-y-2">
        <h1 className="font-display text-4xl font-extrabold leading-tight">Get outside.<br /><span className="text-primary">Get moving.</span></h1>
        <p className="text-muted-foreground">Choose your session and let your coach talk you through it.</p>
      </section>

      <div className="mt-8 space-y-2">
        <Label>Workout type</Label>
        <Select value={workout} onValueChange={setWorkout}>
          <SelectTrigger className="h-12 w-full bg-card text-base"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="park">🌳 Park Calisthenics</SelectItem>
            <SelectItem value="trail">⛰️ Trail Fitness</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-1 items-center justify-center py-12">
        <div className="relative">
          <span className="pulse-ring absolute inset-0 rounded-full bg-primary" />
          <span className="pulse-ring absolute inset-0 rounded-full bg-accent [animation-delay:1s]" />
          <button
            onClick={start}
            className="breathe bg-go relative flex h-60 w-60 flex-col items-center justify-center gap-2 rounded-full font-display text-2xl font-extrabold text-primary-foreground transition-transform active:scale-95"
          >
            <Play className="h-10 w-10 fill-current" />
            <span className="px-8 text-center leading-tight">Start Outdoor Session</span>
          </button>
        </div>
      </div>
    </main>
  );
}
