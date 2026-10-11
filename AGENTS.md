<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- ElevenLabs speech runs through the server function in src/lib/tts.functions.ts using the stored project key; a key saved in the browser settings is called directly from the client and overrides it. Why: keeps the default key off the client.
- Workout routine text is currently simulated client-side (simulateGemma); replace it with a real model call behind a server function. Why: no model is wired yet.
