# snowball-js Constitution

## Core Principles

### I. Library-First (NON-NEGOTIABLE)
Every feature MUST be implemented as a self-contained library/module with clear boundaries and a single responsibility. Libraries MUST be independently testable, well-documented, and avoid organizational-only grouping without clear purpose.

### II. TypeScript & Strong Typing (NON-NEGOTIABLE)
All code MUST use TypeScript with strict mode enabled. Use of ny is not permitted without explicit justification. Public APIs MUST have explicit type definitions. Type safety MUST be maintained across all module boundaries.

### III. Test-First (NON-NEGOTIABLE)
Test-Driven Development (TDD) is mandatory. Write tests first, confirm they fail, then implement. Follow the Red-Green-Refactor cycle strictly. Unit tests are required for core logic; integration tests MUST be added for contract changes, new library contracts, inter-module communication, and shared schemas.

### IV. Simplicity & YAGNI (NON-NEGOTIABLE)
Implement the simplest solution that meets requirements. Avoid over-engineering, speculative generalization, and unnecessary dependencies. Prefer clarity over cleverness. Every abstraction MUST justify its cost.

### V. API Stability, Security & Observability
Public APIs MUST be documented. Breaking changes MUST be explicitly considered and versioned. Security best practices MUST be followed: never log secrets or keys; validate inputs at boundaries; follow least privilege. Text I/O and structured logging MUST be used where appropriate to ensure debuggability.

## Additional Constraints

- Module System: Use ES modules (import/export).
- Code Style: Follow existing code style and conventions. Mimic patterns found in the codebase.
- Dependencies: Do not introduce new heavy dependencies without clear justification. Prefer standard library and existing dependencies.
- Testing: Tests MUST be deterministic and fast where possible. Avoid flaky tests.
- Type Safety: No implicit any; prefer explicit types for public APIs.

## Development Workflow

- Code Review: All changes require review. Small, focused changes are preferred.
- Quality Gates: lint, typecheck, and tests MUST pass before merging.
- Tooling: Use existing build/test commands. Do not invent tooling. Check README/docs for canonical commands.
- CodeGraph Compliance: In this workspace, use CodeGraph (codegraph_explore) for symbol analysis, call hierarchy, and code exploration instead of manual grep or speculative file reading.

## Governance

This constitution supersedes all other practices. All PRs and reviews MUST verify compliance with these principles. Complexity MUST be justified.

Amendments: Amendments require documented rationale in the constitution update, a version bump per semantic versioning rules (MAJOR for backward-incompatible governance/principle removals/redefinitions; MINOR for new principles/sections materially expanded; PATCH for clarifications/typos), and the updated constitution committed with clear commit message.

Compliance Review: During implementation, use jev_decide/jev_choose/jev_score to assess architectural compliance when choices are ambiguous or carry risk. If P(violates) >= 0.70, halt and adjust to adhere to this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-10-07 | **Last Amended**: 2026-10-07
