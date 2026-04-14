# Bug Hunter — Firebase

- **Auth race**: checking currentUser before onAuthStateChanged fires → await auth ready state
- **Rule mismatch**: field name in rule differs from actual field → check exact casing
- **N+1 query**: fetching doc per list item → batch fetch or denormalize
- **Collection name case**: `dietplans` vs `dietPlans` → must match exactly
- **Timestamp comparison**: comparing JS Date with Firestore Timestamp → use `.toMillis()`
- **Secondary app leak**: initializeApp called twice same name → deleteApp(tempApp) in finally
- **Missing index**: composite query without index → check Firebase console for index link in error
- **onSnapshot not cleaned up**: memory leak on unmount → return unsub from useEffect
