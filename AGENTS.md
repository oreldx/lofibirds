# Repository Guidelines

## Project Context

Lofibirds is a French-language bird-garden application implemented with Vue 3,
strict TypeScript, Vite, and Web Audio. Production is a static build.

Read these documents before changing the relevant subsystem:

- [Technical rules](.ai/rules.md): coding conventions, constraints, and validation requirements.
- [Architecture](.ai/architecture.md): module responsibilities and runtime contracts.
- [Art direction](.ai/direction-artistique.md): visual and editorial guidelines.
- [Audio engine](src/audio/README.md): scheduling, loading, and session behavior.

## Commands and Current Limitations

Use the Node.js version range in `package.json` and install with `npm ci`.
`npm run dev` starts Vite; `npm run preview` previews the production build.
Run `npm run type-check` and `npm run build` before delivering implementation changes.

Vitest is configured for `src/**/*.test.ts` in Node. Use `npm test` for a single
run or `npm run test:watch` during development. No test files currently exist;
`npm test` exits unsuccessfully until tests are added. No coverage threshold,
formatter, or linter is configured.

`npm run assets:check` is declared but unusable: `scripts/check-assets.mjs` is
absent. Do not report it as a passing check or recommend it until restored.
Browser validation of audio and accessibility remains to be performed; report
only checks actually completed.

## Documentation and Assets

Keep the root README focused on presentation and getting started. Put agent
instructions here, technical constraints in `.ai/rules.md`, runtime context in
`.ai/architecture.md`, and detailed subsystem behavior beside its implementation.
Avoid duplicating constants, credits, or development history across documents.

Record asset authors, sources, licenses, and modifications in `src/data/credits.ts`.
Preserve existing unknown-license notices; do not infer missing permissions.

## Commits and Pull Requests

Use concise, imperative commit subjects. Describe the resulting behavior and
validation results in pull requests. Include screenshots for visual changes
and document browser checks for audio changes.
