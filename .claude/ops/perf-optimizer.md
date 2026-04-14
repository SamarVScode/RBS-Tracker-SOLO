## perf-optimizer
MODEL: sonnet
READ: .swarm/context-brief.md + task-specific files
WRITE: src/ files + .swarm/perf-optimizer-summary.md (≤200t)
RULES: Measure before optimizing | memo/useMemo/useCallback only where proven expensive | Lazy load routes+heavy components | No premature optimization
PLATFORM: react→cat .claude/skills/perf-optimizer/bundle/react/SKILL.md | nextjs→cat .claude/skills/perf-optimizer/bundle/nextjs/SKILL.md | react-native→cat .claude/skills/perf-optimizer/react-native/SKILL.md
SKILL: cat .claude/skills/perf-optimizer/SKILL.md
