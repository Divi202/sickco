- **Validate critical user journeys (manual, end-to-end)**: Confirm users can sign up, verify email, log in, access the dashboard, start a chat, view history, and log out without blockers.

- **Authenticate and authorize securely**: Verify credential handling, email verification flow, session persistence, session timeout/logout, and access control to protected routes (no unauthorized access).

- **Chat functionality correctness**: Ensure users can send messages, receive AI responses, see messages in correct order, and handle multi-message conversations without duplication or loss.

- **Chat history persistence and retrieval**: Confirm prior conversations load correctly per authenticated user; verify pagination/limits if applicable; ensure “Clear Chat” removes history as designed and does not affect other users.

- **Input validation and error handling**: Validate form fields (signup, login, chat input), required fields, password strength indicators, and friendly, actionable error messages across failure scenarios (network/API errors included).

- **Data integrity and privacy**: Ensure user-specific data isolation (no cross-user leakage in chat/history), PII is not exposed in UI or logs, and logout fully severs access.

- **UI/UX sanity across key views**: Check layout, readability, theme toggle basics, and responsiveness on common desktop resolutions; verify primary flows remain usable on small screens.

- **Accessibility essentials (manual checks)**: Validate keyboard navigation for core flows, focus states, and semantic labels on primary controls (login, send, clear).

- **Performance smoke checks (manual perception)**: Confirm acceptable perceived load and response times for login, dashboard load, sending messages, loading history, and clearing chat.

- **Compatibility sanity**: Manually verify on target desktop browsers (at least latest Chrome and one secondary browser) with no critical discrepancies.

- **Risk-based regression coverage**: Re-test high-impact areas (auth, chat send/receive, history, clear) and recent bugfixes to prevent reintroductions under tight staffing.

- **Negative and edge scenarios**: Validate invalid credentials, unverified email attempts, network interruptions during chat, long inputs, empty messages, and rate-limited behavior if applicable.

- **Test environment and data readiness**: Ensure stable test accounts, seeded data as needed, and clear procedures for resetting state (e.g., after “Clear Chat”).

- **Release acceptance criteria alignment**: Define pass/fail thresholds for critical flows and document known acceptable limitations for this release.

- **Lean reporting and traceability**: Provide concise manual test results tied to objectives, highlighting blockers, defects, and go/no-go recommendation.

- **Single tester constraint prioritization**: Time-box breadth, focus on critical-path scenarios first, defer low-risk UI nits, and escalate any blocker immediately.