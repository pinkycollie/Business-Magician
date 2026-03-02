# Archived Files

This directory contains files that were archived during the repository cleanup and audit conducted in December 2024.

## Purpose

These files have been preserved for historical reference but are no longer actively used in the current codebase.

## Directory Structure

- **old-servers/**: Legacy server implementation files that have been replaced by the unified `server/index.ts`
- **old-scripts/**: Shell scripts for running various configurations that are no longer needed
- **old-docs/**: Documentation files that are outdated or superseded by current documentation
- **old-demos/**: HTML demo files that have been replaced by the main demo

## Files Archived

### Server Files (old-servers/)
- Multiple legacy server implementations (api-server.js, api-server-notion.js, test-server.js, etc.)
- Minimal server variants (bare-minimum.ts, minimal-server.ts, super-minimal.ts, ultra-minimal.js)
- Test and bridge files (flask-bridge.js, northwest-api-test.js, generate-idea-to-notion.js)
- Database test files (testdb.ts)

### Shell Scripts (old-scripts/)
- Legacy startup scripts (start-app.sh, start-minimal.sh)
- API server runners (run-api.sh, run-api-server.sh, api-server.sh)
- Test runners (run-northwest-test.sh, run-notion-test.sh)
- Minimal variant runners (run-minimal.sh, run-super-minimal.sh, run-ultra-minimal.sh)
- Workflow scripts (workflow-run-api.sh, workflow-run-htmx.sh, workflow-run-minimal.sh)
- Debug scripts (run-debug.sh, run-htmx-server.sh)

### Documentation (old-docs/)
- AUTOMATION-DEMO.md
- GITHUB-REPOSITORY-TEMPLATE.md
- README-GENERATOR.md
- implementation-plan.md

### Demos (old-demos/)
- 360magicians.html
- notion-test.html

## Current Codebase

The repository now uses a simplified structure:
- **Server**: Single entry point at `server/index.ts` with lazy-loaded routes
- **Build**: Standard `npm run build` creates production-ready output
- **Development**: `npm run dev` runs the development server
- **Production**: `npm start` runs the production server from `dist/`

## Restoration

If you need to restore any of these files, you can:
1. Copy them from this archive directory to the appropriate location
2. Or use git history to restore them from previous commits
