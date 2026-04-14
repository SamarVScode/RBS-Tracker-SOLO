# Security — Frontend

- No `dangerouslySetInnerHTML` with user content
- User-provided URLs validated before use in href/src
- No `eval()` or `Function()` with user input
- Sensitive data not in localStorage (use httpOnly cookies for tokens)
- No `console.log` of sensitive data
- Error messages don't expose internal paths or schema
