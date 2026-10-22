# Bugfix Requirements Document

## Introduction

This document captures the requirements for fixing a comprehensive set of bugs discovered in the multi-branch stock management application (Node.js / Express / EJS). The bugs span three layers of the application:

- **View layer** — broken EJS layout pattern, missing HTML closing tags, unsafe date rendering, variable shadowing, and duplicate script loading.
- **Service layer** — redundant database lookups on login, missing numeric coercion on transfer quantities, and fragile ObjectId string conversion during stock reconciliation.
- **Infrastructure layer** — Redis session store crash on startup when Redis is unavailable, and a connect-redis v6 legacy initialization pattern.

Left unaddressed, the critical view-layer bugs mean every page in the application renders its main content outside the Bootstrap container, and the HTML document is never properly closed. The service-layer bugs can silently allow incorrect stock operations or crash during reconciliation. The infrastructure bug can cause a completely broken session system with no user-facing error.

---

## Bug Analysis

### Current Behavior (Defect)

**EJS Layout — Missing Closing Tags (Bug 1 / Bug 18)**

1.1 WHEN any page is rendered using the `main.ejs` layout THEN the system produces HTML with no closing `</body>` or `</html>` tags, leaving the document structurally incomplete.

**EJS Layout — Broken `include`-as-layout Pattern (Bug 4 / Bug 14)**

1.2 WHEN a view file calls `<%- include('../layouts/main', { title: '...' }) %>` and then writes its own HTML content below that call THEN the system renders the `<main>` container in `main.ejs` empty (because `locals.body` is never populated by `include`), and the actual page content appears after the closing `</main>` tag, outside the Bootstrap container.

1.3 WHEN `errors/403.ejs` is rendered via the layout include THEN the system produces the same broken layout described in 1.2, causing the 403 error message to appear outside the container.

**Socket.io — Unnecessary / Duplicate Loading (Bug 15 / Bug 16)**

1.4 WHEN an unauthenticated page (e.g., the login page) is rendered THEN the system loads `socket.io.js` unconditionally for every page, generating a wasteful or failed network request on pages that have no authenticated socket connection.

1.5 WHEN `transfers/detail.ejs` is rendered THEN the system loads `<script src="/socket.io/socket.io.js">` twice — once from `main.ejs` and once inline in the view — causing the socket.io client library to be executed twice.

**`createdAt` Null Safety — Transfers Views (Bug 7)**

1.6 WHEN a transfer record has a null or undefined `createdAt` value THEN the system throws a TypeError (`Cannot read properties of null`) when `t.createdAt.toLocaleDateString()` or `transfer.createdAt.toLocaleString()` is called in the transfers list and detail views, crashing the page render.

**Variable Shadowing — Dashboard Loop (Bug 5)**

1.7 WHEN `dashboard/index.ejs` iterates over `summary.recentUsers` with `forEach(function(user) { ... })` THEN the loop variable `user` shadows the outer `user` variable (the session user passed to the view), making the session user inaccessible inside the loop body and risking confusion if the outer `user` is ever referenced within the loop.

**`reorderLevel` Null Safety — Inventory View (Bug 6)**

1.8 WHEN an inventory stock record does not have `reorderLevel` set THEN the system renders `undefined` in the Reorder Level column of the inventory table instead of a safe fallback value.

**Auth Service — Double DB Lookup on Login (Bug 2)**

1.9 WHEN a user logs in THEN the system performs two sequential database queries for the same email address: first `userRepo.findByEmail(email)` (result discarded) and then `UserModel.findOne({ email })`, making the first query completely wasteful.

**Auth Service — `signToken` Re-exported as Service Method (Bug 3)**

1.10 WHEN `auth.service.js` re-exports `signToken` from `jwt.helper.js` directly THEN the system exposes a JWT-signing utility through the service layer, creating a layering violation where controllers may call `authService.signToken()` instead of importing from the helper.

**Transfer Service — Quantity Not Coerced to Number (Bug 11)**

1.11 WHEN `initiateTransfer` is called with a `quantity` value that is a numeric string (e.g., `"5"`) rather than a JavaScript number THEN the system evaluates `stock.quantity < quantity` as a string comparison, which is always `false` for a string operand, allowing a transfer to proceed even when there is insufficient stock.

**Inventory Service — `rebuildStockFromTransactions` ObjectId Coercion (Bug 12)**

1.12 WHEN `rebuildStockFromTransactions` is called and the stock transactions are returned as populated Mongoose documents (with `branch` and `product` as full objects rather than raw ObjectIds) THEN `tx.branch.toString()` returns `[object Object]` instead of the ID string, generating corrupt map keys and incorrect stock reconciliation results.

**Redis — No Fallback When Redis Is Unavailable (Bug 8 / Bug 9)**

1.13 WHEN `REDIS_URL` is undefined or Redis is not running at startup THEN the system constructs the session store with a broken Redis connection; the server starts but every request that touches the session middleware hangs or errors, making the entire application unusable without surfacing a clear error to the operator.

1.14 WHEN `connect-redis` v6 is initialised with the legacy pattern `require('connect-redis')(session)` but the installed package version or API does not match THEN the system throws `RedisStore is not a constructor` at startup.

---

### Expected Behavior (Correct)

**EJS Layout — Missing Closing Tags**

2.1 WHEN any page is rendered using the `main.ejs` layout THEN the system SHALL produce a well-formed HTML document that includes closing `</body>` and `</html>` tags at the end of the template.

**EJS Layout — Broken Include Pattern**

2.2 WHEN a view is rendered THEN the system SHALL use a header/footer partial pattern (`<%- include('../layouts/header') %>` … content … `<%- include('../layouts/footer') %>`), so that the page content is always rendered inside the Bootstrap `<main>` container and not after it.

2.3 WHEN `errors/403.ejs` is rendered THEN the system SHALL display the 403 error content inside the Bootstrap container using the header/footer partial pattern.

**Socket.io — Unnecessary / Duplicate Loading**

2.4 WHEN an unauthenticated page is rendered THEN the system SHALL only include the `socket.io.js` script tag when `locals.user` is truthy, so that unauthenticated pages do not load the socket client unnecessarily.

2.5 WHEN `transfers/detail.ejs` is rendered THEN the system SHALL include the `socket.io.js` script only once (provided by the layout footer partial), and the inline duplicate `<script src="/socket.io/socket.io.js">` SHALL be removed from `detail.ejs`.

**`createdAt` Null Safety — Transfers Views**

2.6 WHEN a transfer record has a null or undefined `createdAt` value THEN the system SHALL render a safe fallback string (e.g., `'—'`) instead of calling `.toLocaleDateString()` or `.toLocaleString()` on the null value, preventing a TypeError.

**Variable Shadowing — Dashboard Loop**

2.7 WHEN `dashboard/index.ejs` iterates over `summary.recentUsers` THEN the system SHALL use a loop variable name other than `user` (e.g., `recentUser`) so that the outer session `user` variable remains accessible and unambiguous throughout the template.

**`reorderLevel` Null Safety — Inventory View**

2.8 WHEN an inventory stock record does not have `reorderLevel` set THEN the system SHALL render `0` (or another defined fallback) in the Reorder Level column instead of `undefined`.

**Auth Service — Double DB Lookup**

2.9 WHEN a user logs in THEN the system SHALL perform only one database query — directly via the Mongoose model with `.populate('role')` — removing the redundant `userRepo.findByEmail` call entirely.

**Auth Service — `signToken` Re-export**

2.10 WHEN `auth.service.js` is used THEN the system SHALL NOT re-export `signToken`; the export object SHALL contain only `login` and `register`, and any caller that needs `signToken` SHALL import it directly from `jwt.helper.js`.

**Transfer Service — Quantity Coercion**

2.11 WHEN `initiateTransfer` receives a `quantity` parameter THEN the system SHALL coerce it to a JavaScript number using `Number(quantity)` at the start of the function, so that the stock comparison `stock.quantity < quantity` is always a numeric comparison.

**Inventory Service — ObjectId Coercion in Rebuild**

2.12 WHEN `rebuildStockFromTransactions` processes each transaction THEN the system SHALL extract the branch and product IDs using `(tx.branch?._id ?? tx.branch).toString()` and `(tx.product?._id ?? tx.product).toString()` to correctly handle both populated objects and raw ObjectId values.

**Redis — Fallback and Version Compatibility**

2.13 WHEN `REDIS_URL` is undefined or the Redis connection fails at startup THEN the system SHALL fall back to an in-memory session store (using the built-in `express-session` memory store) and log a warning, so that the application remains functional in development environments without Redis.

2.14 WHEN `connect-redis` v6 is installed (as declared in `package.json`) THEN the system SHALL initialise `RedisStore` using the v6 pattern `require('connect-redis')(session)` and the code SHALL remain consistent with the installed version.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user navigates to any authenticated page THEN the system SHALL CONTINUE TO render the navigation bar with all menu links and the logged-in user's name.

3.2 WHEN a user submits the login form with valid credentials THEN the system SHALL CONTINUE TO authenticate the user, create a session, and redirect to the dashboard.

3.3 WHEN a user submits the login form with invalid credentials THEN the system SHALL CONTINUE TO return an authentication failure response without logging the user in.

3.4 WHEN `initiateTransfer` is called with a positive integer `quantity` that exceeds available stock THEN the system SHALL CONTINUE TO throw an `'Insufficient stock at source branch'` error.

3.5 WHEN `initiateTransfer` is called with a valid positive `quantity` that is within available stock THEN the system SHALL CONTINUE TO create the transfer record and return it.

3.6 WHEN `rebuildStockFromTransactions` is called and all transactions have plain ObjectId fields (non-populated) THEN the system SHALL CONTINUE TO reconcile stock correctly.

3.7 WHEN `createTransaction` is called with a valid `in` or `out` transaction THEN the system SHALL CONTINUE TO update stock quantities and persist the transaction record.

3.8 WHEN Redis is available and `REDIS_URL` is set THEN the system SHALL CONTINUE TO use Redis as the session store.

3.9 WHEN `transfers/index.ejs` renders a transfer whose `createdAt` is a valid Date THEN the system SHALL CONTINUE TO display the formatted date string.

3.10 WHEN `inventory/index.ejs` renders a stock item that has a valid `reorderLevel` set THEN the system SHALL CONTINUE TO display the actual reorder level value.

3.11 WHEN `transfers/detail.ejs` renders a transfer THEN the system SHALL CONTINUE TO provide real-time status updates via the socket.io connection.

3.12 WHEN a user without the required role attempts to access a protected route THEN the system SHALL CONTINUE TO render the 403 Forbidden page.

3.13 WHEN the application receives a request for a non-existent route THEN the system SHALL CONTINUE TO render the 404 Not Found page.
