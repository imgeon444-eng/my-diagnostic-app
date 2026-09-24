---
name: github-flow-automation
description: Automated GitHub workflow management for non-developers. Handles git branching, semantic commit generation, Pull Request (PR) creation, merge management, and automated Vercel/Cloud CI/CD deployments directly from agent instructions.
---

# GitHub Flow & CI/CD Automation Skill

This skill allows the agent to handle 100% of Git and GitHub operations without requiring manual Git commands or terminal inputs from the user.

## 1. Core Workflow for AI-Assisted Development
1. **Feature Branching**: Automatically create a descriptive branch (e.g., `feature/diagnostic-scoring-logic`) from `main`.
2. **Atomic Commits**: Stage modified files and write conventional commit messages (e.g., `feat: implement dynamic assessment funnel`).
3. **Pull Request (PR) Lifecycle**:
   - Push branch to remote GitHub repository.
   - Generate structured PR with summary of changes, test results, and visual proofs.
   - Run automated pre-merge validation.
4. **CI/CD Deployment**: Trigger automatic preview environments on Vercel/Cloudflare and merge to `main` upon approval.
