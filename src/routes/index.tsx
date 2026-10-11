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

function Index() {
  const [apiKey, setApiKey] = useState("");
  const [workout, setWorkout] = useState("park");

  useEffect(() => setApiKey(localStorage.getItem(KEY) ?? ""), []);

  const save = () => {
    localStorage.setItem(KEY, apiKey.trim());
    toast.success("API key saved on this device");
  };

  const start = () => {
    if (!apiKey) {
      toast.error("Add your ElevenLabs API key in settings first");
      return;
    }
    toast.success(`Starting ${workout === "park" ? "Park Calisthenics" : "Trail Fitness"} — go touch grass!`);
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
