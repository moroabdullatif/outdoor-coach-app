import { createServerFn } from "@tanstack/react-start";

// Uses the project's stored ElevenLabs key; returns base64 MP3.
export const speakWithStoredKey = createServerFn({ method: "POST" })
  .inputValidator((d: { text: string }) => {
    if (typeof d?.text !== "string" || !d.text.trim() || d.text.length > 2000) throw new Error("Invalid text");
    return { text: d.text };
  })
  .handler(async ({ data }) => {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error("ElevenLabs key is not configured");
    const res = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb?output_format=mp3_44100_128",
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({ text: data.text, model_id: "eleven_turbo_v2_5" }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`ElevenLabs error ${res.status}: ${body.slice(0, 200)}`);
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return { audio: btoa(bin) };
  });
