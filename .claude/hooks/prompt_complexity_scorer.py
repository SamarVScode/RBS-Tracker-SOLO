#!/usr/bin/env python
"""
Prompt Complexity Scorer
Scores complexity of a development prompt based on README context.
Framework scope: React | React Native | Next.js only
Usage: cat README.md | python prompt_complexity_scorer.py
"""

import sys
import os
import re
import json
import math
from typing import List, Dict, Tuple, Optional
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed

# ─── CONSTANTS ────────────────────────────────────────────────────────────────

REACT_KEYWORDS = [
    "component", "hook", "usestate", "useeffect", "usecallback", "usememo",
    "useref", "usecontext", "useReducer", "context", "props", "state",
    "jsx", "tsx", "react", "render", "rerender", "memo", "forwardref",
    "suspense", "lazy", "portal", "fragment", "ref", "key", "children",
    "lifecycle", "event handler", "synthetic event", "virtual dom",
    "zustand", "redux", "tanstack", "react query", "swr", "axios",
    "framer motion", "react router", "vite", "vitest", "testing library",
    "react testing", "rtl", "jest", "playwright", "storybook"
]

NEXTJS_KEYWORDS = [
    "page", "pages", "app router", "app directory", "layout", "loading",
    "error boundary", "not-found", "route handler", "api route", "middleware",
    "server component", "client component", "use client", "use server",
    "server action", "server actions", "ssr", "ssg", "isr", "ppr",
    "getserversideprops", "getstaticprops", "getstaticpaths",
    "generatestaticparams", "generatemetadata", "metadata", "next/image",
    "next/font", "next/link", "next/navigation", "next/headers", "next/cookies",
    "revalidate", "revalidatetag", "revalidatepath", "cachetag", "cachelife",
    "use cache", "partial prerendering", "turbopack", "vercel", "edge runtime",
    "node runtime", "standalone", "docker", "nextjs", "next.js"
]

REACT_NATIVE_KEYWORDS = [
    "react native", "expo", "navigation", "stack navigator", "tab navigator",
    "drawer navigator", "native stack", "react navigation", "view", "text",
    "touchableopacity", "pressable", "flatlist", "scrollview", "modal",
    "stylesheet", "dimensions", "platform", "asyncstorage", "sqlite",
    "native module", "native module", "expo router", "expo go",
    "eas build", "eas submit", "metro", "hermes", "reanimated",
    "gesture handler", "safe area", "keyboard avoiding", "status bar",
    "splash screen", "app.json", "app.config", "detox", "jest-expo",
    "android", "ios", "simulator", "emulator", "device", "push notification",
    "firebase messaging", "expo notifications", "deep link", "universal link"
]

GENERAL_KEYWORDS = [
    "form", "validation", "error handling", "loading", "skeleton", "spinner",
    "toast", "modal", "dialog", "drawer", "sidebar", "navbar", "header",
    "footer", "card", "list", "table", "grid", "chart", "graph",
    "authentication", "authorization", "auth", "login", "logout", "signup",
    "firebase", "firestore", "realtime database", "storage", "functions",
    "api", "rest", "graphql", "webhook", "websocket", "socket", "realtime",
    "crud", "create", "read", "update", "delete", "search", "filter", "sort",
    "pagination", "infinite scroll", "upload", "download", "export", "import",
    "typescript", "testing", "test", "e2e", "unit test", "integration test",
    "performance", "optimization", "accessibility", "a11y", "wcag", "aria",
    "responsive", "mobile", "desktop", "dark mode", "theme", "i18n",
    "internationalization", "localization", "state management", "cache",
    "offline", "sync", "notification", "analytics", "logging", "monitoring"
]

COMPLEXITY_THRESHOLDS = {
    "simple": 3.0,
    "complex": 6.0
}

# ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

def extract_project_name(readme: str) -> str:
    """Extract first # heading (no ##)"""
    for line in readme.split('\n'):
        line = line.strip()
        if line.startswith('# ') and not line.startswith('## '):
            name = line[2:].strip()
            return name
    return ""

def extract_user_prompt(readme: str) -> str:
    """Extract text under ## User Prompt section"""
    lines = readme.split('\n')
    in_section = False
    prompt_lines = []
    for line in lines:
        if re.match(r'^##\s+User Prompt', line, re.IGNORECASE):
            in_section = True
            continue
        if in_section:
            if line.startswith('## '):
                break
            prompt_lines.append(line)
    result = '\n'.join(prompt_lines).strip()
    # strip surrounding quotes if any
    result = result.strip('"\'')
    return result

def extract_readme_content(readme: str) -> str:
    """Remove project name line + User Prompt section, keep rest"""
    lines = readme.split('\n')
    result = []
    skip_project_name = True
    in_user_prompt = False
    for line in lines:
        stripped = line.strip()
        if skip_project_name and stripped.startswith('# ') and not stripped.startswith('## '):
            skip_project_name = False
            continue
        if re.match(r'^##\s+User Prompt', stripped, re.IGNORECASE):
            in_user_prompt = True
            continue
        if in_user_prompt:
            if stripped.startswith('## '):
                in_user_prompt = False
                result.append(line)
            continue
        result.append(line)
    return '\n'.join(result)

def remove_markdown_formatting(text: str) -> str:
    """Remove markdown syntax, URLs, code blocks"""
    # remove code blocks
    text = re.sub(r'```[\s\S]*?```', ' ', text)
    text = re.sub(r'`[^`]+`', ' ', text)
    # remove URLs
    text = re.sub(r'https?://\S+', ' ', text)
    # remove markdown syntax
    text = re.sub(r'[#*_>\[\]()!|\\-]', ' ', text)
    # normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

def tokenize(text: str) -> List[str]:
    """Split into words, lowercase, clean"""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s\-\.]', ' ', text)
    tokens = text.split()
    return [t for t in tokens if len(t) > 1]

def extract_keywords_from_text(text: str) -> List[str]:
    """Extract React/RN/Next.js technical terms from text"""
    text_lower = text.lower()
    found = []
    all_keywords = REACT_KEYWORDS + NEXTJS_KEYWORDS + REACT_NATIVE_KEYWORDS + GENERAL_KEYWORDS
    for kw in all_keywords:
        if kw.lower() in text_lower:
            found.append(kw.lower())
    return list(set(found))

def categorize_keywords(keywords: List[str]) -> Dict:
    """Group keywords by framework"""
    react_set = set(k.lower() for k in REACT_KEYWORDS)
    nextjs_set = set(k.lower() for k in NEXTJS_KEYWORDS)
    rn_set = set(k.lower() for k in REACT_NATIVE_KEYWORDS)
    categories = {"react": [], "nextjs": [], "react_native": [], "general": []}
    for kw in keywords:
        kl = kw.lower()
        if kl in rn_set:
            categories["react_native"].append(kl)
        elif kl in nextjs_set:
            categories["nextjs"].append(kl)
        elif kl in react_set:
            categories["react"].append(kl)
        else:
            categories["general"].append(kl)
    return categories

def get_keyword_frequency(keywords: List[str]) -> Dict:
    """Count occurrences of each keyword"""
    return dict(Counter(keywords))

def calculate_framework_distribution(categories: Dict) -> Dict:
    """Return proportional distribution across frameworks"""
    counts = {
        "react": len(categories["react"]),
        "nextjs": len(categories["nextjs"]),
        "react_native": len(categories["react_native"])
    }
    total = sum(counts.values()) or 1
    return {k: round(v / total, 3) for k, v in counts.items()}

def cosine_similarity(vec1: Dict, vec2: Dict) -> float:
    """Cosine similarity between two TF-IDF dicts"""
    keys = set(vec1.keys()) | set(vec2.keys())
    if not keys:
        return 0.0
    dot = sum(vec1.get(k, 0) * vec2.get(k, 0) for k in keys)
    mag1 = math.sqrt(sum(v**2 for v in vec1.values()))
    mag2 = math.sqrt(sum(v**2 for v in vec2.values()))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot / (mag1 * mag2)

def calculate_tfidf(text: str, corpus_texts: List[str]) -> Dict:
    """Simple TF-IDF vectorization"""
    tokens = tokenize(text)
    if not tokens:
        return {}
    tf = Counter(tokens)
    total = len(tokens)
    tf_normalized = {t: c / total for t, c in tf.items()}
    N = len(corpus_texts) + 1
    idf = {}
    all_tokens = set(tokens)
    for token in all_tokens:
        doc_count = sum(1 for doc in corpus_texts if token in doc.lower()) + 1
        idf[token] = math.log(N / doc_count)
    return {t: tf_normalized[t] * idf.get(t, 0) for t in tf_normalized}

def match_keywords(tokens: List[str], keywords: List[str]) -> List[str]:
    """Find which keywords appear in tokens"""
    token_set = set(tokens)
    matched = []
    for kw in keywords:
        kw_tokens = kw.lower().split()
        if all(t in token_set for t in kw_tokens):
            matched.append(kw)
    return matched

def calculate_keyword_match_ratio(matched: List[str], total: List[str]) -> float:
    """Return 0.0-1.0"""
    if not total:
        return 0.0
    return len(matched) / len(total)

# ─── PHASE 1: README INGESTION ────────────────────────────────────────────────

class ReadmeStripper:
    def __init__(self, readme_content: str):
        self.raw = readme_content
        self.clean = remove_markdown_formatting(readme_content)

    def extract_keywords(self) -> List[str]:
        return extract_keywords_from_text(self.clean)

    def categorize_keywords(self, keywords: List[str]) -> Dict:
        return categorize_keywords(keywords)

    def get_keyword_frequency(self, keywords: List[str]) -> Dict:
        return get_keyword_frequency(keywords)

    def run(self) -> Dict:
        keywords = self.extract_keywords()
        categories = self.categorize_keywords(keywords)
        freq = self.get_keyword_frequency(keywords)
        framework_dist = calculate_framework_distribution(categories)
        return {
            "raw_keywords": keywords,
            "keyword_freq": freq,
            "categories": categories,
            "framework_dist": framework_dist,
            "total_keywords": len(keywords)
        }

# ─── PHASE 2: SEMANTIC ANALYSIS ──────────────────────────────────────────────

class SemanticReadmeAnalyzer:
    def __init__(self, readme_content: str, phase1_data: Dict):
        self.content = readme_content.lower()
        self.phase1 = phase1_data

    def extract_intent_clusters(self) -> Dict:
        """Group related keywords into conceptual clusters"""
        ui_terms = {"component", "hook", "form", "modal", "button", "card",
                    "list", "table", "grid", "chart", "skeleton", "toast",
                    "drawer", "sidebar", "navbar", "layout"}
        state_terms = {"state", "usestate", "usereducer", "context", "zustand",
                       "redux", "store", "mutation", "query", "cache", "tanstack",
                       "swr", "react query"}
        routing_terms = {"page", "route", "navigation", "router", "link",
                         "redirect", "middleware", "app router", "stack navigator",
                         "tab navigator", "deep link"}
        api_terms = {"api", "api route", "route handler", "server action",
                     "graphql", "rest", "webhook", "websocket", "server component",
                     "firestore", "firebase", "functions"}

        keywords = set(self.phase1["raw_keywords"])
        clusters = {
            "ui_layer": list(keywords & ui_terms),
            "state_layer": list(keywords & state_terms),
            "routing_layer": list(keywords & routing_terms),
            "api_layer": list(keywords & api_terms)
        }
        return clusters

    def build_concept_graph(self) -> Dict:
        """Map concept dependencies"""
        graph = {}
        keywords = set(self.phase1["raw_keywords"])
        if "component" in keywords:
            graph["component"] = [k for k in ["hook", "props", "state", "usestate"] if k in keywords]
        if "hook" in keywords:
            graph["hook"] = [k for k in ["useeffect", "usestate", "usecallback", "usememo"] if k in keywords]
        if "page" in keywords or "app router" in keywords:
            graph["page"] = [k for k in ["server component", "client component", "api route",
                                          "server action", "layout", "loading"] if k in keywords]
        if "authentication" in keywords or "auth" in keywords:
            graph["auth"] = [k for k in ["firebase", "middleware", "server action",
                                          "usestate", "context", "zustand"] if k in keywords]
        if "form" in keywords:
            graph["form"] = [k for k in ["validation", "error handling", "usestate",
                                          "server action", "hook"] if k in keywords]
        return graph

    def detect_architecture_type(self) -> str:
        """Detect: client_side, server_side, full_stack, mobile, hybrid"""
        dist = self.phase1["framework_dist"]
        categories = self.phase1["categories"]
        rn_score = dist.get("react_native", 0)
        nextjs_score = dist.get("nextjs", 0)
        react_score = dist.get("react", 0)

        has_server = any(k in self.content for k in [
            "server component", "server action", "api route", "route handler",
            "ssr", "ssg", "getserversideprops", "middleware"
        ])
        has_client = any(k in self.content for k in [
            "usestate", "useeffect", "client component", "use client"
        ])

        if rn_score > 0.4:
            return "mobile"
        if rn_score > 0.1 and (nextjs_score > 0.1 or react_score > 0.1):
            return "hybrid"
        if nextjs_score > 0.3 and has_server and has_client:
            return "full_stack"
        if nextjs_score > 0.2 or has_server:
            return "server_side"
        return "client_side"

    def calculate_semantic_vectors(self, prompt: str) -> Tuple[Dict, Dict]:
        """TF-IDF vectors for readme and prompt"""
        readme_vec = calculate_tfidf(self.content, [prompt])
        prompt_vec = calculate_tfidf(prompt, [self.content])
        return readme_vec, prompt_vec

    def run(self, prompt: str) -> Dict:
        clusters = self.extract_intent_clusters()
        graph = self.build_concept_graph()
        arch = self.detect_architecture_type()
        readme_vec, prompt_vec = self.calculate_semantic_vectors(prompt)
        top_keywords = sorted(
            self.phase1["keyword_freq"].items(),
            key=lambda x: x[1], reverse=True
        )[:10]
        return {
            "intent_clusters": clusters,
            "concept_graph": graph,
            "architecture_type": arch,
            "readme_vector": readme_vec,
            "prompt_vector": prompt_vec,
            "top_keywords": [k for k, _ in top_keywords]
        }

# ─── PHASE 3: PROMPT PARSING ──────────────────────────────────────────────────

class PromptAnalyzer:
    def __init__(self, user_prompt: str, phase1_data: Dict):
        self.prompt = user_prompt
        self.phase1 = phase1_data

    def run(self) -> Dict:
        tokens = tokenize(self.prompt)
        all_keywords = self.phase1["raw_keywords"]
        matched = match_keywords(tokens, all_keywords)
        ratio = calculate_keyword_match_ratio(matched, all_keywords)
        return {
            "tokens": tokens,
            "matched_keywords": matched,
            "match_ratio": ratio,
            "token_count": len(tokens)
        }

# ─── PHASE 4: NEURAL INTELLIGENCE LAYERS ─────────────────────────────────────

class PatternIntelligence:
    """Detect operation types and complexity patterns"""

    CRUD_PATTERNS = ["read", "update", "delete", "fetch", "get",
                     "post", "put", "patch", "save", "remove", "list", "find"]
    STATE_FLOW_PATTERNS = ["state", "store", "cache", "sync", "persist",
                           "optimistic", "realtime", "live", "subscribe",
                           "notification", "badge", "unread", "count", "live update"]
    CROSS_CUTTING_PATTERNS = ["across", "global", "shared", "system", "service",
                               "integration", "multiple", "all", "entire", "whole",
                               "complete", "full", "and", "with"]
    ARCHITECTURE_PATTERNS = ["architecture", "structure", "scaffold", "setup",
                              "infrastructure", "codebase", "refactor", "rewrite",
                              "migrate", "redesign", "overhaul",
                              "build", "create", "implement", "develop",
                              "authentication", "authorization", "payment",
                              "billing", "real-time", "websocket", "offline"]

    HIDDEN_REQUIREMENTS = {
        "form": ["validation", "error handling", "loading state"],
        "auth": ["session management", "token refresh", "protected routes"],
        "authentication": ["session management", "token refresh", "protected routes"],
        "navigation": ["deep linking", "back handling", "route params"],
        "upload": ["progress tracking", "error handling", "file type validation"],
        "realtime": ["connection handling", "reconnection logic", "offline state"],
        "real-time": ["connection handling", "reconnection logic", "offline state"],
        "payment": ["error handling", "webhook", "idempotency"],
        "list": ["pagination", "empty state", "loading skeleton"],
        "search": ["debouncing", "empty state", "loading state"],
        "notification": ["permission request", "badge count", "tap handler"],
        "offline": ["sync queue", "conflict resolution", "local storage"],
    }

    def __init__(self, user_prompt: str):
        self.prompt = user_prompt.lower()
        self.tokens = tokenize(user_prompt)

    def analyze_prompt_patterns(self) -> List[str]:
        patterns = []
        if any(w in self.tokens for w in self.CRUD_PATTERNS):
            patterns.append("CRUD")
        if any(w in self.tokens for w in self.STATE_FLOW_PATTERNS):
            patterns.append("state_flow")
        if any(w in self.tokens for w in self.CROSS_CUTTING_PATTERNS):
            patterns.append("cross_cutting")
        if any(w in self.tokens for w in self.ARCHITECTURE_PATTERNS):
            patterns.append("architecture")
        return patterns

    def pattern_complexity_graph(self, patterns: List[str]) -> float:
        """0-10 score from pattern dependencies"""
        base_scores = {
            "CRUD": 2.0,
            "state_flow": 4.0,
            "cross_cutting": 5.5,
            "architecture": 7.5
        }
        if not patterns:
            return 1.5
        score = max(base_scores.get(p, 0) for p in patterns)
        # additive for multiple patterns
        score += (len(patterns) - 1) * 1.0
        return min(10.0, score)

    def identify_hidden_requirements(self, readme: str) -> List[str]:
        hidden = []
        for trigger, reqs in self.HIDDEN_REQUIREMENTS.items():
            if trigger in self.prompt:
                hidden.extend(reqs)
        return list(set(hidden))

    def run(self, readme: str) -> Dict:
        patterns = self.analyze_prompt_patterns()
        score = self.pattern_complexity_graph(patterns)
        hidden = self.identify_hidden_requirements(readme)
        # hidden reqs add complexity
        score = min(10.0, score + len(hidden) * 0.3)
        return {
            "patterns": patterns,
            "pattern_score": score,
            "hidden_requirements": hidden
        }


class FrameworkAlignmentEngine:
    """Check if prompt fits the detected framework stack"""

    def __init__(self, user_prompt: str, framework_dist: Dict):
        self.prompt = user_prompt.lower()
        self.framework_dist = framework_dist

    def detect_framework_signals(self) -> Dict:
        signals = {"react": 0.0, "nextjs": 0.0, "react_native": 0.0}
        react_hits = sum(1 for k in REACT_KEYWORDS if k.lower() in self.prompt)
        nextjs_hits = sum(1 for k in NEXTJS_KEYWORDS if k.lower() in self.prompt)
        rn_hits = sum(1 for k in REACT_NATIVE_KEYWORDS if k.lower() in self.prompt)
        total = react_hits + nextjs_hits + rn_hits or 1
        signals["react"] = round(react_hits / total, 3)
        signals["nextjs"] = round(nextjs_hits / total, 3)
        signals["react_native"] = round(rn_hits / total, 3)
        return signals

    def detect_framework_conflicts(self, signals: Dict) -> List[str]:
        conflicts = []
        # RN + web-only patterns
        web_only = ["document", "window", "localstorage", "sessionstorage",
                    "getelementbyid", "innerhtml"]
        rn_active = signals.get("react_native", 0) > 0.3
        if rn_active and any(w in self.prompt for w in web_only):
            conflicts.append("React Native prompt references web-only APIs")
        # SSR + browser-only
        ssr_active = signals.get("nextjs", 0) > 0.3
        browser_only = ["usestate", "useeffect", "localstorage"] 
        if ssr_active and "server component" in self.prompt and any(w in self.prompt for w in browser_only):
            conflicts.append("Server component references client-only hooks")
        return conflicts

    def check_architectural_fit(self) -> bool:
        """Does prompt framework match codebase framework?"""
        signals = self.detect_framework_signals()
        primary_prompt = max(signals, key=signals.get)
        primary_readme = max(self.framework_dist, key=self.framework_dist.get)
        return primary_prompt == primary_readme or signals[primary_readme] > 0.2

    def run(self) -> Dict:
        signals = self.detect_framework_signals()
        primary = max(signals, key=signals.get)
        conflicts = self.detect_framework_conflicts(signals)
        fits = self.check_architectural_fit()
        # if all signals are 0 (prompt has no explicit framework keywords)
        # use the dominant readme framework confidence as neutral baseline
        max_signal = max(signals.values())
        if max_signal == 0:
            # no framework keywords in prompt — neutral score (not a conflict)
            dominant_readme = max(self.framework_dist, key=self.framework_dist.get)
            alignment_score = self.framework_dist[dominant_readme] * 6.0  # neutral-ish
        else:
            base = signals.get(max(self.framework_dist, key=self.framework_dist.get), 0.5)
            alignment_score = base * 10
        alignment_score -= len(conflicts) * 1.5
        alignment_score += 0.0 if fits else -1.0
        alignment_score = max(0.0, min(10.0, alignment_score))
        return {
            "framework_signals": signals,
            "primary_framework": primary,
            "framework_conflicts": conflicts,
            "alignment_score": alignment_score
        }


class AmbiguityAnalyzer:
    """Detect unclear/vague aspects of prompt"""

    VAGUE_TERMS = ["something", "stuff", "things", "somehow", "maybe", "perhaps",
                   "kind of", "sort of", "etc", "and so on", "whatever", "anything"]
    SPECIFIC_INDICATORS = ["create", "build", "add", "update", "fix", "remove",
                           "implement", "integrate", "refactor", "migrate", "test"]
    CONTRADICTION_PAIRS = [
        ("simple", "complex"), ("fast", "slow"), ("client", "server"),
        ("static", "dynamic"), ("cached", "realtime")
    ]

    def __init__(self, user_prompt: str, readme_content: str):
        self.prompt = user_prompt.lower()
        self.readme = readme_content.lower()
        self.tokens = tokenize(user_prompt)

    def score_prompt_clarity(self) -> float:
        """0.0=unclear, 1.0=crystal clear"""
        score = 0.5
        # positive signals
        specific_hits = sum(1 for w in self.SPECIFIC_INDICATORS if w in self.tokens)
        score += min(0.3, specific_hits * 0.08)
        # word count — very short prompts are ambiguous
        if len(self.tokens) >= 8:
            score += 0.1
        if len(self.tokens) >= 15:
            score += 0.1
        # negative signals
        vague_hits = sum(1 for v in self.VAGUE_TERMS if v in self.prompt)
        score -= min(0.3, vague_hits * 0.1)
        return max(0.0, min(1.0, score))

    def detect_contradictions(self) -> List[str]:
        found = []
        for a, b in self.CONTRADICTION_PAIRS:
            if a in self.prompt and b in self.prompt:
                found.append(f"'{a}' vs '{b}'")
        return found

    def identify_missing_context(self) -> List[str]:
        missing = []
        # check if data shape mentioned for data features
        if any(w in self.prompt for w in ["form", "input", "fields"]):
            if not any(w in self.prompt for w in ["field", "name", "email", "id", "type"]):
                missing.append("field definitions not specified")
        # platform not mentioned (for RN projects)
        if "navigation" in self.prompt and not any(
            w in self.prompt for w in ["stack", "tab", "drawer", "modal"]
        ):
            missing.append("navigation type not specified")
        return missing

    def run(self) -> Dict:
        clarity = self.score_prompt_clarity()
        contradictions = self.detect_contradictions()
        missing = self.identify_missing_context()
        # ambiguity score: inverse of clarity + penalties
        ambiguity_score = (1.0 - clarity) * 7.0
        ambiguity_score += len(contradictions) * 1.0
        ambiguity_score += len(missing) * 0.5
        ambiguity_score = max(0.0, min(10.0, ambiguity_score))
        return {
            "clarity_score": clarity,
            "ambiguous_parts": contradictions + missing,
            "ambiguity_score": ambiguity_score,
            "missing_context": len(missing)
        }


class ScopeEstimator:
    """Estimate implementation effort and impact"""

    HIGH_SCOPE_TERMS = ["system", "full", "complete", "entire", "all", "across",
                         "everywhere", "codebase", "application", "platform",
                         "rewrite", "rebuild", "overhaul", "redesign", "migrate"]
    MULTI_STEP_TERMS = ["and", "with", "including", "plus", "also", "along with",
                         "as well as", "multiple", "several", "both"]
    ARCH_IMPACT_TERMS = {
        "high": ["authentication", "authorization", "database schema", "api contract",
                  "architecture", "navigation structure", "state management system",
                  "real-time", "offline", "payment", "billing",
                  "firestore", "firebase", "firestore storage", "cloud functions",
                  "security rules", "data model"],
        "medium": ["new page", "new screen", "new feature", "new component",
                   "new hook", "new store", "firestore collection",
                   "notification", "badge", "search", "filter", "dashboard",
                   "chart", "modal", "form", "integration", "logs", "tracker",
                   "summary", "report", "export", "upload"],
        "low": ["update", "modify", "extend", "add field", "add button", "add icon"],
        "none": ["fix", "bug", "typo", "rename", "color", "style", "spacing",
                 "test", "spec", "coverage", "vitest", "jest", "playwright", "detox",
                 "unit test", "snapshot test", "mock", "stub"]
    }

    def __init__(self, user_prompt: str, intent_clusters: Dict):
        self.prompt = user_prompt.lower()
        self.tokens = tokenize(user_prompt)
        self.clusters = intent_clusters

    def estimate_implementation_scope(self) -> float:
        """0-10"""
        score = 2.0
        # high scope terms
        high_hits = sum(1 for w in self.HIGH_SCOPE_TERMS if w in self.prompt)
        score += min(4.0, high_hits * 1.2)
        # multi-step connectors
        multi_hits = sum(1 for w in self.MULTI_STEP_TERMS if w in self.prompt)
        score += min(2.0, multi_hits * 0.4)
        # active intent clusters increase scope
        active_clusters = sum(1 for v in self.clusters.values() if len(v) > 0)
        score += active_clusters * 0.5
        # token count as proxy for detail
        if len(self.tokens) > 20:
            score += 0.5
        if len(self.tokens) > 40:
            score += 0.5
        return min(10.0, score)

    def assess_architectural_impact(self) -> str:
        for level, terms in self.ARCH_IMPACT_TERMS.items():
            if any(t in self.prompt for t in terms):
                return level
        return "low"

    def identify_hidden_requirements(self, readme: str) -> List[str]:
        # shared with PatternIntelligence — defer to it
        return []

    def run(self) -> Dict:
        scope = self.estimate_implementation_scope()
        impact = self.assess_architectural_impact()
        impact_bonus = {"none": 0, "low": 0.5, "medium": 1.5, "high": 3.0}
        final_scope = min(10.0, scope + impact_bonus.get(impact, 0))
        estimated_files = max(1, final_scope * 0.8)
        estimated_deps = max(0, final_scope * 0.5)
        return {
            "scope_score": final_scope,
            "estimated_files": round(estimated_files, 1),
            "estimated_deps": round(estimated_deps, 1),
            "architectural_impact": impact
        }


class SemanticSimilarity:
    """Measure conceptual alignment between prompt and codebase"""

    def __init__(self, readme_vector: Dict, prompt_vector: Dict):
        self.readme_vec = readme_vector
        self.prompt_vec = prompt_vector

    def calculate_similarity(self) -> float:
        return cosine_similarity(self.readme_vec, self.prompt_vec)

    def run(self) -> Dict:
        sim = self.calculate_similarity()
        # higher similarity = prompt is well-aligned with codebase = potentially more complex
        # (it likely involves touching more of the existing system)
        semantic_score = sim * 8.0 + 1.0
        semantic_score = min(10.0, semantic_score)
        return {
            "similarity_score": round(sim, 4),
            "semantic_score": round(semantic_score, 2)
        }

# ─── PHASE 5: ADAPTIVE SCORING ────────────────────────────────────────────────

class AdaptiveScorer:
    """Combine all factor scores with adaptive weights"""

    BASE_WEIGHTS = {
        "pattern": 0.25,
        "framework": 0.15,
        "ambiguity": 0.15,
        "scope": 0.25,
        "semantic": 0.10,
        "keyword": 0.10
    }

    def calculate_adaptive_weights(self, framework_dist: Dict) -> Dict:
        weights = dict(self.BASE_WEIGHTS)
        dominant = max(framework_dist, key=framework_dist.get)
        dominance = framework_dist[dominant]
        if dominant == "react" and dominance > 0.5:
            weights["pattern"] = 0.28
            weights["scope"] = 0.27
            weights["framework"] = 0.12
        elif dominant == "nextjs" and dominance > 0.4:
            weights["framework"] = 0.22
            weights["pattern"] = 0.22
            weights["scope"] = 0.23
        elif dominant == "react_native" and dominance > 0.4:
            weights["scope"] = 0.28
            weights["framework"] = 0.18
            weights["pattern"] = 0.22
        # normalize to sum to 1.0
        total = sum(weights.values())
        return {k: round(v / total, 4) for k, v in weights.items()}

    def aggregate_scores(self, all_scores: Dict, weights: Dict) -> Tuple[float, str]:
        final = (
            all_scores["pattern_score"] * weights["pattern"] +
            all_scores["alignment_score"] * weights["framework"] +
            all_scores["ambiguity_score"] * weights["ambiguity"] +
            all_scores["scope_score"] * weights["scope"] +
            all_scores["semantic_score"] * weights["semantic"] +
            all_scores["keyword_score"] * weights["keyword"]
        )
        # boost for high architectural impact
        if all_scores.get("arch_impact") == "high":
            final += 0.6
        elif all_scores.get("arch_impact") == "medium":
            final += 0.2
        final = max(0.0, min(10.0, final))
        # Override: "none" impact (fix/bug/rename/color/style) with moderate scope → always Simple
        # Prevents framework alignment inflation (single React keyword → score 10.0) from
        # promoting trivial tasks to Medium. scope_score > 5.5 = genuinely large-scope fix.
        if all_scores.get("arch_impact") == "none" and all_scores["scope_score"] <= 5.5:
            return round(min(final, COMPLEXITY_THRESHOLDS["simple"] - 0.01), 3), "Simple"
        if final < COMPLEXITY_THRESHOLDS["simple"]:
            level = "Simple"
        elif final < COMPLEXITY_THRESHOLDS["complex"]:
            level = "Medium"
        else:
            level = "Complex"
        return round(final, 3), level

    def run(self, phase_results: Dict, framework_dist: Dict) -> Dict:
        # extract scores from phase results
        all_scores = {
            "pattern_score": phase_results["pattern"]["pattern_score"],
            "alignment_score": phase_results["framework"]["alignment_score"],
            "ambiguity_score": phase_results["ambiguity"]["ambiguity_score"],
            "scope_score": phase_results["scope"]["scope_score"],
            "semantic_score": phase_results["similarity"]["semantic_score"],
            "keyword_score": phase_results["keyword_match_ratio"] * 10,
            "arch_impact": phase_results["scope"]["architectural_impact"]
        }
        weights = self.calculate_adaptive_weights(framework_dist)
        final_score, level = self.aggregate_scores(all_scores, weights)
        return {
            "final_score": final_score,
            "complexity_level": level,
            "weights_used": weights,
            "component_scores": all_scores,
            "source": "rule_based"
        }

# ─── PHASE 6: KEYWORD FALLBACK ───────────────────────────────────────────────

def keyword_fallback_level(user_prompt: str) -> str:
    """Pure-Python fallback when no README context — no API calls.
    Simple: cosmetic, fix, test, perf. Complex: system-level + domain terms.
    Medium: everything else (new features, components, hooks)."""
    t = user_prompt.lower()
    # Testing is always Simple — even when testing complex domains
    is_test = any(w in t for w in ['test','spec','coverage','vitest','jest','playwright',
                                    'detox','e2e','unit test'])
    if is_test:
        return "Simple"
    # Simple — cosmetic, bug fix, performance
    if any(w in t for w in ['fix','bug','crash','color','colour','spacing','style',
                             'rename','icon','typo','slow','bundle','performance',
                             'optimize','lighthouse','lazy','font','padding','margin']):
        # Promote to Medium if also touches a complex domain
        if any(w in t for w in ['firebase','auth','realtime','websocket','payment',
                                 'architecture','migrate','rewrite']):
            return "Medium"
        return "Simple"
    # Complex — needs system-level action + domain keyword
    system_action = any(w in t for w in ['build','implement','develop','full','complete',
                                          'rewrite','migrate','overhaul','redesign'])
    domain_hit = any(w in t for w in ['firebase','auth','realtime','websocket','payment',
                                       'billing','architecture','database','security',
                                       'offline','state management'])
    if system_action and domain_hit:
        return "Complex"
    return "Medium"

# ─── PHASE 7: OUTPUT ─────────────────────────────────────────────────────────

class OutputGenerator:
    def generate_output(self, project_name: Optional[str], user_prompt: str,
                        complexity_level: str, source: str,
                        score: float = 0.0,
                        error: Optional[str] = None) -> str:
        # Cosmetic detection — only true if Simple AND visual-only keywords, no structural signals
        STRUCTURAL_SIGNALS = ["bug", "fix", "error", "crash", "broken", "state", "logic",
            "calculation", "undefined", "null", "import", "export", "function", "hook",
            "store", "schema", "route", "auth", "api", "test", "refactor", "migrate"]
        COSMETIC_WORDS = ["color", "colour", "font", "spacing", "padding", "margin",
            "icon", "shadow", "opacity", "border-radius", "animation", "transition",
            "label", "placeholder", "border"]
        task_lower = user_prompt.lower()
        has_structural = any(w in task_lower for w in STRUCTURAL_SIGNALS)
        has_cosmetic = any(w in task_lower for w in COSMETIC_WORDS)
        is_cosmetic = has_cosmetic and not has_structural and complexity_level == "Simple"

        result = {
            "project_name": project_name if project_name else None,
            "prompt": user_prompt,
            "complexity_level": complexity_level,
            "score": round(score, 3),
            "source": source,
            "is_cosmetic": is_cosmetic
        }
        if error:
            result["error"] = error
        return json.dumps(result, indent=2)

# ─── MAIN ORCHESTRATOR ────────────────────────────────────────────────────────

class PromptComplexityScorer:
    """Main orchestrator that coordinates all phases"""

    def __init__(self, readme_content: str, user_prompt: str, project_name: str):
        self.readme_content = readme_content
        self.user_prompt = user_prompt
        self.project_name = project_name

    def run(self) -> str:
        # Phase 1
        p1 = ReadmeStripper(self.readme_content).run()

        # Phase 2
        p2 = SemanticReadmeAnalyzer(self.readme_content, p1).run(self.user_prompt)

        # Phase 3
        p3 = PromptAnalyzer(self.user_prompt, p1).run()

        # Phase 4 — run 5 layers in parallel
        results = {}
        def run_pattern():
            return PatternIntelligence(self.user_prompt).run(self.readme_content)
        def run_framework():
            return FrameworkAlignmentEngine(self.user_prompt, p1["framework_dist"]).run()
        def run_ambiguity():
            return AmbiguityAnalyzer(self.user_prompt, self.readme_content).run()
        def run_scope():
            return ScopeEstimator(self.user_prompt, p2["intent_clusters"]).run()
        def run_similarity():
            return SemanticSimilarity(p2["readme_vector"], p2["prompt_vector"]).run()

        with ThreadPoolExecutor(max_workers=5) as ex:
            futures = {
                ex.submit(run_pattern): "pattern",
                ex.submit(run_framework): "framework",
                ex.submit(run_ambiguity): "ambiguity",
                ex.submit(run_scope): "scope",
                ex.submit(run_similarity): "similarity"
            }
            for future in as_completed(futures):
                key = futures[future]
                results[key] = future.result()

        # Phase 5
        phase_results = {**results, "keyword_match_ratio": p3["match_ratio"]}
        p5 = AdaptiveScorer().run(phase_results, p1["framework_dist"])

        return p5["complexity_level"], p5["final_score"]

# ─── ENTRY POINT ─────────────────────────────────────────────────────────────

def error_response(message: str) -> str:
    return json.dumps({"error": True, "message": message}, indent=2)

def main():
    try:
        readme = sys.stdin.read()

        if not readme or not readme.strip():
            print(error_response("Empty README — pipe README.md to stdin"))
            sys.exit(1)

        project_name = extract_project_name(readme)
        user_prompt = extract_user_prompt(readme)
        readme_content = extract_readme_content(readme)

        if not user_prompt or not user_prompt.strip():
            print(error_response(
                "No user prompt found. README must contain '## User Prompt' section"
            ))
            sys.exit(1)

        output = OutputGenerator()

        if not project_name:
            # No README context — keyword fallback is more accurate than rule-based without context
            # In production, intake-agent always ensures README exists before scoring
            level = keyword_fallback_level(user_prompt)
            print(output.generate_output(None, user_prompt, level, "keyword_fallback", score=0.0))
            return

        # Full rule-based scoring (README context available)
        try:
            scorer = PromptComplexityScorer(readme_content, user_prompt, project_name)
            level, final_score = scorer.run()
            print(output.generate_output(project_name, user_prompt, level, "rule_based", score=final_score))
        except Exception as e:
            level = keyword_fallback_level(user_prompt)
            print(output.generate_output(
                project_name, user_prompt, level, "keyword_fallback", score=0.0,
                error=f"Rule-based failed: {str(e)}"
            ))

    except Exception as e:
        print(error_response(f"Fatal error: {str(e)}"))
        sys.exit(1)

if __name__ == "__main__":
    main()
