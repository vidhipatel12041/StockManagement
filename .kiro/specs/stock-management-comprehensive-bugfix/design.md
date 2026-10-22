# Design Document — Stock Management Comprehensive Bugfix

## Overview

This document captures the technical design for fixing thirteen bugs across the view layer, service layer, and infrastructure layer of the multi-branch stock management application. The fixes are grouped into four logical areas: EJS view rendering, service-layer correctness, and Redis session infrastructure.

---

## Bug Condition Methodology

### C(X) — Bug Conditions

Each bug is expressed as a predicate over its input domain.

| ID | isBugCondition(input) |
|----|----------------------|
| BC-1 | `main.ejs` is rendered without closing `</body>` and `</html>` tags |
| BC-2 | A view calls `<%- include('../layouts/main', …) %>` then writes content below it |
| BC-3 | `locals.user` is falsy and `socket.io.js` is loaded unconditionally |
| BC-4 | `transfers/detail.ejs` includes `<script src="/socket.io/socket.io.js">` inline while layout also loads it |
| BC-5 | `t.createdAt` or `transfer.createdAt` is `null` or `undefined` and `.toLocaleDateString()` / `.toLocaleString()` is called on it |
| BC-6 | `dashboard/index.ejs` uses `user` as the `forEach` loop variable, shadowing the outer session `user` |
| BC-7 | `item.reorderLevel` is `null` or `undefined` and the template renders it directly |
| BC-8 | `auth.service.js` performs `userRepo.findByEmail(email)` and then discards the result before a second `UserModel.findOne` call |
| BC-9 | `auth.service.js` re-exports `signToken` from `jwt.helper.js` |
| BC-10 | `initiateTransfer` receives `quantity` as a numeric string; `stock.quantity < quantity` is evaluated as a string comparison |
| BC-11 | `rebuildStockFromTransactions` calls `tx.branch.toString()` when `tx.branch` is a populated Mongoose document, producing `[object Object]` |
| BC-12 | `REDIS_URL` is unset or Redis is unreachable at startup and no fallback session store is used |
| BC-13 | `connect-redis` v6 is initialized with wrong API pattern |

### expectedBehavior(result)

| ID | Expected outcome when bug condition is true |
|----|---------------------------------------------|
| EB-1 | `main.ejs` ends with `</body></html>` |
| EB-2 | All views use `<%- include('../layouts/header') %>` … content … `<%- include('../layouts/footer') %>` |
| EB-3 | `socket.io.js` script tag is guarded by `<% if (locals.user) { %>` in the layout |
| EB-4 | Inline `<script src="/socket.io/socket.io.js">` is removed from `detail.ejs` |
| EB-5 | `t.createdAt ? t.createdAt.toLocaleDateString() : '—'` — no TypeError |
| EB-6 | Loop variable renamed to `recentUser`; outer `user` unaffected |
| EB-7 | `item.reorderLevel != null ? item.reorderLevel : 0` — no `undefined` in output |
| EB-8 | Single `UserModel.findOne({ email }).populate('role')` call; `userRepo.findByEmail` call removed |
| EB-9 | `module.exports = { login, register }` only; `signToken` not exported from service |
| EB-10 | `const quantity = Number(data.quantity)` at the start of `initiateTransfer` |
| EB-11 | `(tx.branch?._id ?? tx.branch).toString()` and `(tx.product?._id ?? tx.product).toString()` |
| EB-12 | When `REDIS_URL` is unset or Redis fails, fall back to `express-session` MemoryStore and log a warning |
| EB-13 | `require('connect-redis')(session)` — v6 legacy pattern used consistently |

### Preservation Requirements (¬C(X))

These are the behaviors that must not change after the fix:

| ID | Preserved behavior |
|----|-------------------|
| PR-1 | Authenticated pages continue to render the navbar with all links and the user's name (req 3.1) |
| PR-2 | Login with valid credentials continues to authenticate, create session, redirect to dashboard (req 3.2) |
| PR-3 | Login with invalid credentials continues to return auth failure (req 3.3) |
| PR-4 | `initiateTransfer` with positive integer `quantity` > stock continues to throw `'Insufficient stock at source branch'` (req 3.4) |
| PR-5 | `initiateTransfer` with valid numeric quantity within stock continues to create and return transfer (req 3.5) |
| PR-6 | `rebuildStockFromTransactions` with plain ObjectId fields continues to reconcile correctly (req 3.6) |
| PR-7 | `createTransaction` with valid `in`/`out` continues to update stock and persist record (req 3.7) |
| PR-8 | When Redis is available, Redis session store continues to be used (req 3.8) |
| PR-9 | Transfer with valid `createdAt` continues to display formatted date string (req 3.9) |
| PR-10 | Stock item with valid `reorderLevel` continues to display the actual value (req 3.10) |
| PR-11 | `transfers/detail.ejs` continues to provide real-time updates via socket.io (req 3.11) |
| PR-12 | 403 page continues to render for unauthorised users (req 3.12) |
| PR-13 | 404 page continues to render for unknown routes (req 3.13) |

---

## Implementation Plan

### Group A — EJS View Layer

**Files affected:**
- `src/views/layouts/main.ejs` — add `</body></html>`; guard socket.io script with `locals.user` check
- `src/views/layouts/header.ejs` — already the correct partial header; no change needed if views are converted
- `src/views/layouts/footer.ejs` — already the correct partial footer with guarded socket.io
- `src/views/transfers/index.ejs` — null-safe `createdAt` guard (already done)
- `src/views/transfers/detail.ejs` — null-safe `createdAt` guard; remove duplicate socket.io script (already done via header/footer pattern)
- `src/views/inventory/index.ejs` — null-safe `reorderLevel` fallback (already done)
- `src/views/dashboard/index.ejs` — rename loop variable to `recentUser` (already done)
- `src/views/errors/403.ejs` — use header/footer partials (already done)

### Group B — Service Layer

**Files affected:**
- `src/services/auth.service.js` — single DB lookup; remove `signToken` re-export (already done)
- `src/services/transfer.service.js` — `Number(data.quantity)` coercion at start (already done)
- `src/services/inventory.service.js` — safe ObjectId extraction via `?._id ?? tx.field` (already done)

### Group C — Infrastructure

**Files affected:**
- `src/app.js` — Redis fallback to MemoryStore; v6 `connect-redis` init pattern (already done)

---

## Test Strategy

### Property 1 — Bug Condition Tests

Scope each property to the concrete inputs that trigger the bug. Run on source files to confirm the bugs are either present (unfixed) or resolved (fixed).

### Property 2 — Preservation Tests

Observe baseline behavior on the corrected code for non-bug-condition inputs. Write property-based or parameterized tests that assert the observed values hold across the non-buggy input domain.
