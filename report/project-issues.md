# tying.ai Project Issues Analysis

## Overview

This document tracks structural issues previously identified in the tying.ai
repository and records their current status after cleanup work.

## 1. Documentation vs. Implementation Mismatch

- **Issue**: The README described a mixed static/Next.js stack even though the
  tooling only supported serving static files.
- **Resolution**: The README now documents the static HTML/CSS/JavaScript stack
  and references the `serve` workflow that powers local development and
  previews.【F:README.md†L1-L33】

## 2. Unbuildable Next.js Skeleton

- **Issue**: A partial Next.js scaffold in `src/app` referenced Tailwind CSS and
  React assets that were never included in `package.json`, leaving the directory
  unbuildable.
- **Resolution**: The unused `src/app` folder has been removed so the repository
  reflects the supported static-site implementation.【F:package.json†L1-L18】

## 3. Conflicting Marketing Copy Across Entry Pages

- **Issue**: `index.html` and `index-optimized.html` present different product
  narratives, which can confuse visitors and SEO crawlers.
- **Resolution**: Both entry pages now describe Tying.ai as an AI career
  guidance platform and link to the same core resources, keeping messaging
  consistent across
  variants.【F:index.html†L6-L161】【F:index-optimized.html†L1-L37】

## Summary

- Documentation now matches the actual build tooling.
- Dead Next.js assets have been removed to reduce confusion.
- Landing page messaging is now aligned across entry points.
