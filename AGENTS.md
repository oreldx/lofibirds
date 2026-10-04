# Repository Guidelines

## Project Structure & Module Organization

This project is a planned French-language bird-garden application using Vue 3, strict TypeScript, and Vite. Implementation has not started. Read `.ai/plans/roadmap.md` for product requirements and `.ai/rules.md` for technical conventions.

Organize future source code by responsibility: `src/components/` for UI, `src/audio/` for the framework-independent audio engine, `src/composables/` for reactive integration, `src/data/` for species and credits, and `src/storage/` for preferences. Import images and audio through Vite; reserve `public/` for files requiring stable names.

## Build, Test, and Development Commands

No package manifest or runnable commands exist yet. When scaffolding the application, document the actual commands for local development, TypeScript checking, production builds, and tests. Run the TypeScript check and production build before delivering implementation changes.

## Coding Style & Naming Conventions

Use Vue Composition API with `<script setup lang="ts">` and strict TypeScript. Avoid `any` and unnecessary abstractions. Keep the audio engine independent of Vue and the DOM, with one engine and one `AudioContext` per session.

Use descriptive names and consistent indentation. No formatter or linter is configured yet. Do not add a router, Pinia, backend, or service worker for the initial scope.

## Testing Guidelines

No testing framework or coverage threshold is established. Add focused behavior tests for scheduling, pause/resume, channel disabling, late or failed loading, and invalid or unavailable preferences.

Verify audio transitions, autoplay restrictions, and hidden-tab continuity in Chrome, Firefox, and Safari desktop. Check mobile layout, keyboard navigation, and reduced-motion behavior.

## Commit & Pull Request Guidelines

No Git history is available to establish commit conventions. Use concise, imperative commit subjects. Describe changes, relevant roadmap steps, and validation results in pull requests. Include screenshots for visual changes and document browser checks for audio changes.

## Assets & Configuration

Verify and record each asset’s author, source, license, and modifications. Serve assets locally. Persist preferences only; restoring them must never start playback automatically.
