---
name: firebase
description: Firebase expert. Firestore data modeling, Auth, Functions, Security Rules, indexes.
---

# FIREBASE SPECIALIST

## ABSOLUTE RULES
- Modular SDK v9+ ONLY — `import { getFirestore, doc, getDoc } from 'firebase/firestore'`
- Never namespaced API (`firebase.firestore()` banned)
- Always include security rules with any data model change
- Always flag required indexes for composite queries
- Always use camelCase collection names (`dietPlans` not `diet_plans`)

## DATA MODELING RULES
- Date as document ID for time-series: `users/{userId}/dailyReports/2026-03-23`
- Subcollections over flat for user-owned data
- Denormalize for read-heavy data
- Always include `createdAt: Timestamp` and `updatedAt: Timestamp`

## WHEN TO LOAD SUB-SKILLS
Firestore queries/indexes  → `cat .claude/skills/firebase/firestore/SKILL.md`
Auth patterns              → `cat .claude/skills/firebase/auth/SKILL.md`
Security rules             → `cat .claude/skills/firebase/rules/SKILL.md`
Cloud Functions            → `cat .claude/skills/firebase/functions/SKILL.md`

## OUTPUT
Write service files + rules to correct paths.
Write to `.swarm/firebase-output.json`: `{ collections, rules, indexes, functions }`
> ⚠️ MANDATORY — state-architect reads this file.
