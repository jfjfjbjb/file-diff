# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FileDiff Pro is a professional file comparison tool built with React 19, TypeScript, and Vite. It allows users to compare two text files and view differences with syntax highlighting.

## Commands

```bash
npm install        # Install dependencies
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Architecture

### State Management
All state is managed in `App.tsx` using React hooks:
- `files: File[]` - selected files (max 2)
- `fileContents: { content1, content2 }` - read file contents
- `errorMessage` / `warningMessage` - validation feedback
- `uploadKey` - forces re-mount of upload input to reset file selection

### Theme System
The app uses CSS variables for theming. Theme is stored in `localStorage` under key `theme` and applied as `data-theme` attribute on `<html>`. Theme toggle button (`#themeToggleHeader`) in the header switches between `light` and `dark` themes.

### File Validation
- Supported extensions: `.txt`, `.md`, `.js`, `.ts`, `.jsx`, `.tsx`, `.css`, `.scss`, `.html`, `.json`, `.xml`, `.csv`, `.log`, `.py`, `.java`, `.c`, `.cpp`, `.h`, `.hpp`
- Max file size: 10MB
- Duplicate files (same name and size) are rejected

### Components
- `App.tsx` - Main component handling file selection, validation, state, and layout
- `FileDiff.tsx` - Wraps `react-diff-viewer-continued` library for diff rendering; observes `data-theme` attribute changes to sync theme with the diff viewer
- `FileUpload.tsx` - Standalone upload component (currently unused; upload logic is inline in App.tsx)

### Styling
- Tailwind CSS for utility classes
- CSS custom properties (variables) for theme colors defined in `index.css`
- Background effects (gradients, noise overlay) are pure CSS

### Deployment
GitHub Actions workflow in `.github/workflows/static.yml` deploys to GitHub Pages on push to `main`. Build output goes to `dist/`.

## Key Dependencies
- `react-diff-viewer-continued` - renders the diff view with split pane
- `tailwindcss` + `@tailwindcss/postcss` - styling
- `react-router-dom` - (present in package.json but not actively used)
