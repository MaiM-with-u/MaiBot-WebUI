# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands
- Build: `pnpm build`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Lint and fix: `pnpm lint:fix`
- Preview production: `pnpm preview`

## Code Style Guidelines
- **Framework**: Nuxt.js 3 with Vue 3 and TypeScript
- **Package Manager**: pnpm (v10.8.0+)
- **Linting**: Uses @antfu/eslint-config for style enforcement
- **UI Libraries**: Element Plus, TailwindCSS
- **Imports**: Use ES modules syntax and named imports
- **Components**: Use Composition API with <script setup> syntax
- **Types**: Always use proper TypeScript types
- **Naming**: Use camelCase for variables/properties, PascalCase for components
- **Error Handling**: Use try/catch with proper error types
- **Formatting**: Follow ESLint config rules from @antfu/eslint-config
