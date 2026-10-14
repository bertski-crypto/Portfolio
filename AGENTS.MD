
# Token-Efficient Coding Rules

## General
- Be concise. Avoid long explanations and repeated summaries.
- Inspect relevant files before editing.
- Search for existing components and utilities before creating new ones.
- Read only files relevant to the current task.
- Do not scan node_modules, dist, build, or .git.
- Never rewrite working files unnecessarily.
- Preserve existing design, features, and behavior.
- Reuse installed dependencies; do not add packages without a clear need.

## Workflow
1. Identify the exact files relevant to the task.
2. Make a short plan before complex changes.
3. Implement only the requested scope.
4. Run the most relevant checks.
5. Run npm run build after significant changes.
6. Fix errors caused by your changes.
7. Report changed files, checks, and remaining issues briefly.

## Context Efficiency
- Do not reread files already inspected unless they changed.
- Avoid dumping entire files or lengthy terminal output.
- Use targeted searches and relevant code excerpts.
- Do not repeat the full task in your response.
- Do not add unrequested features or refactor unrelated code.
- Ask before expanding the scope if a major architectural change is needed.

## Portfolio Protection
- Preserve existing colors, typography, glassmorphism,
  Bento Grid, responsive layout, and section content.
- Preserve existing animations, card interactions,
  navigation, and Back-to-Top functionality.
- Avoid conflicting transforms and unnecessary dependencies.