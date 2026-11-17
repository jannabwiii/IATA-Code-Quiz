<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Study data lives only in `src/lib/geo-raw.ts` (copied from the user's handout pages) and is parsed in `src/lib/geo.ts`; every quiz mode reads from there so a data fix updates all modes at once.
- Answer checking and multiple-choice option rules live in `src/lib/geo.ts` and are covered by `src/test/geo.test.ts`; change both together.
- Progress is kept in the browser under localStorage key `wgp` with row ids `section|city|code`, matching the user's original HTML page so earlier progress carries over.
- New quiz modes reuse `QuizShell` (setup → play → results) and are listed in `src/lib/modes.ts`, which drives the home menu.
- Difficulty rules are shared in `src/lib/geo.ts` and passed through `QuizShell`, so every quiz uses consistent assistance and choice counts.
- Supplemental code origins live alongside the handout in `geo-raw.ts`; shared memory aids highlight only complete, ordered letter matches so they never invent a code spelling.
- Additional odd-code explanations use a quiz-only origin map consumed by shared answer details; this preserves existing study-page content and reveals explanations only after answering.
- Code distractors are generated in shared quiz logic as plausible abbreviations or single-letter decoys, excluding every valid code for the same city; this keeps all choice quizzes consistent without altering study data.
- Quiz question components share the CSS quiz-layout/quiz-main/quiz-details structure; this places revealed facts beside the question on desktop and beneath it on phones.
- Theme selection uses the document dark class and browser preference key `wgc-theme`; this preserves the existing semantic color tokens across pages without changing study progress.
