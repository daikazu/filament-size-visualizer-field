# Changelog

All notable changes to `filament-size-visualizer-field` will be documented in this file.

## v2.0.0 - 2026-06-17

Version 2 targets **Laravel 13 + Filament v5 + Tailwind v4** and adds smooth animated transitions to the visualizer.

### ⚠️ Breaking changes

- Requires **PHP 8.3+**, **Laravel 13**, **Filament v5**. Support for Laravel 10/11/12 and Filament v3 has been dropped.
- Asset build moved to the **Tailwind CSS v4** toolchain (`@tailwindcss/cli`); `tailwind.config.js` and `postcss.config.js` removed.
- Removed the unused `dynamicObjectSize()` / `getDynamicObjectSize()` methods (they were never wired to the rendering and had no effect).

### ✨ New

- **Smooth transitions** — the product, coin, size circle, and pattern square now animate (ease-out) when the value changes, while the grid snaps to each step. Rendering is split into a static grid layer and an animated object layer for efficiency.

### 🐛 Fixes

- fabric.js v7 compatibility: `FabricImage` / `FabricText` imports, `setDimensions()` for resize, and the `x-load` directive so the component actually loads.
- Objects now anchor and scale from the **bottom-left of the grid** (fabric v6+ changed the default origin to center).
- Coin reliably renders on initial load and when toggled (fixed an async race).
- Canvas no longer disappears on Livewire updates (`wire:ignore` protects fabric's DOM).

### 🧹 Hardening

- Entangled state is coerced before geometry math; images contain-fit within the size box; window event listeners are Alpine-managed (no leak on SPA navigation).
- Documented the `resize-size-visualizer` / `dispose-size-visualizer` events.

## v1.0.0 - 2024-09-06

Initial Release
