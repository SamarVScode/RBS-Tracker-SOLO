# Bug Hunter — React

- **Stale closure**: useEffect capturing old value → add to deps or use useRef
- **Infinite re-render**: state update in render or missing deps → trace with why-did-you-render
- **Key prop**: using index as key in dynamic lists → use stable ID
- **Missing cleanup**: onSnapshot not unsubscribed → return cleanup fn from useEffect
- **Context re-render**: context value is new object on every render → memoize with useMemo
