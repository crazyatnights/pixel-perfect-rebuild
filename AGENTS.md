# Architecture
- Keep home-screen installation manifest-only, with no app-shell service worker, because offline support is not requested.
- Keep installation UI in a standalone component mounted globally so it is available throughout the app.