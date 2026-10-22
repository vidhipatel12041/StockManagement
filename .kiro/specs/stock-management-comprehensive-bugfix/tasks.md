# Implementation Plan

- [ ] 1. Write bug condition exploration tests (BEFORE implementing any fix)
  - **Property 1: Bug Condition** - Comprehensive Bug Surface Tests
  - **CRITICAL**: These tests MUST FAIL on unfixed code — failure confirms each bug exists
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode expected behavior — they validate the fix once it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate each bug exists
  - **Scoped PBT Approach**: Scope each property to the concrete failing case(s) for reproducibility

  **BC-10 — Transfer quantity string comparison bug**
  - Write a unit test for `initiateTransfer` that passes `quantity` as a numeric string (e.g., `"5"`)
  - Mock `inventoryService.getStock` to return `{ quantity: 3 }` (less stock than requested)
  - Assert that calling `initiateTransfer({ quantity: "5", fromBranch, toBranch, product })` throws `'Insufficient stock at source branch'`
  - Run on UNFIXED code — **EXPECTED OUTCOME**: Test FAILS because `3 < "5"` evaluates to `false` (string comparison), allowing the transfer through
  - Document counterexample: `initiateTransfer({ quantity: "5" })` with `stock.quantity = 3` does NOT throw

  **BC-11 — Inventory rebuild ObjectId coercion bug**
  - Write a unit test for `rebuildStockFromTransactions` that passes transactions where `branch` and `product` are populated Mongoose-style objects (`{ _id: ObjectId(...), name: '...' }`)
  - Assert that the resulting map keys are valid `ObjectId.toString()` strings (24-char hex), not `[object Object]-[object Object]`
  - Run on UNFIXED code — **EXPECTED OUTCOME**: Test FAILS because `tx.branch.toString()` returns `[object Object]`
  - Document counterexample: map key becomes `[object Object]-[object Object]` causing corrupt reconciliation

  **BC-5 — Transfer createdAt null TypeError**
  - Write a unit test / render test that calls the date-formatting expression `t.createdAt.toLocaleDateString()` when `t.createdAt` is `null`
  - Assert that no TypeError is thrown and the output equals `'—'`
  - Run on UNFIXED code — **EXPECTED OUTCOME**: Test FAILS with `TypeError: Cannot read properties of null`
  - Document counterexample: `null.toLocaleDateString()` throws

  **BC-7 — Inventory reorderLevel undefined rendering**
  - Write a unit test that evaluates the template expression for `item.reorderLevel` when `reorderLevel` is `undefined`
  - Assert the output is `'0'` (or `0`), not `'undefined'`
  - Run on UNFIXED code — **EXPECTED OUTCOME**: Test FAILS, output is `'undefined'`

  **BC-8 — Auth double DB lookup**
  - Write a unit test for `authService.login` that spies on both `userRepo.findByEmail` and `UserModel.findOne`
  - Assert `userRepo.findByEmail` is called **0 times**; assert `UserModel.findOne` is called **1 time**
  - Run on UNFIXED code — **EXPECTED OUTCOME**: Test FAILS because `userRepo.findByEmail` is called once (wasted query)

  **BC-9 — auth.service re-exports signToken**
  - Write a unit test that imports `authService` and asserts `authService.signToken` is `undefined`
  - Run on UNFIXED code — **EXPECTED OUTCOME**: Test FAILS because `authService.signToken` is a function

  - Mark task complete when all exploration tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.4, 1.6, 1.8, 1.9, 1.10, 1.11_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Buggy Behavior Baseline Tests
  - **IMPORTANT**: Follow observation-first methodology — observe behavior on non-buggy inputs first
  - These tests capture behavior that MUST NOT change after any fix is applied

  **PR-4 & PR-5 — Transfer quantity numeric baseline**
  - Observe: `initiateTransfer({ quantity: 5 })` with `stock.quantity = 3` → throws `'Insufficient stock at source branch'`
  - Observe: `initiateTransfer({ quantity: 2 })` with `stock.quantity = 3` → creates transfer record successfully
  - Write property-based test: for all positive integer quantities, the insufficient-stock guard works correctly with numeric inputs
  - Verify tests PASS on unfixed code before implementing any fix
  - _Requirements: 3.4, 3.5_

  **PR-6 — Inventory rebuild plain ObjectId baseline**
  - Observe: `rebuildStockFromTransactions` with `tx.branch` and `tx.product` as plain ObjectId strings → correct map keys
  - Write property test: for all transactions with plain (non-populated) ObjectId fields, map keys are valid hex strings
  - Verify test PASSES on unfixed code
  - _Requirements: 3.6_

  **PR-7 — Stock transaction creation baseline**
  - Observe: `createTransaction({ type: 'in', quantity: 10, branch, product })` → stock incremented, transaction persisted
  - Observe: `createTransaction({ type: 'out', quantity: 5, branch, product })` with sufficient stock → stock decremented
  - Write tests covering both `in` and `out` paths with numeric quantities
  - Verify tests PASS on unfixed code
  - _Requirements: 3.7_

  **PR-2 & PR-3 — Login behavior baseline**
  - Observe: `authService.login(validEmail, validPassword)` → returns `{ user, token }`
  - Observe: `authService.login(validEmail, wrongPassword)` → returns `null`
  - Write unit tests for both paths
  - Verify tests PASS on unfixed code
  - _Requirements: 3.2, 3.3_

  **PR-9 — Transfer createdAt valid date baseline**
  - Observe: when `t.createdAt` is a valid `Date` object, `t.createdAt.toLocaleDateString()` returns a non-empty string
  - Write test asserting valid Date objects format correctly (non-null path)
  - Verify test PASSES on unfixed code
  - _Requirements: 3.9_

  **PR-10 — Inventory reorderLevel valid value baseline**
  - Observe: when `item.reorderLevel` is a positive integer, the template renders that integer
  - Write test asserting valid reorderLevel values pass through unchanged
  - Verify test PASSES on unfixed code
  - _Requirements: 3.10_

  - Mark task complete when all preservation tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13_

- [ ] 3. Apply all bug fixes

  - [ ] 3.1 Fix EJS layout — add closing `</body>` and `</html>` to `main.ejs`
    - Open `src/views/layouts/main.ejs`
    - Ensure the last two lines before EOF are `  </body>` and `</html>`
    - _Bug_Condition: BC-1 — `main.ejs` missing closing tags_
    - _Expected_Behavior: EB-1 — well-formed HTML document_
    - _Preservation: PR-1 — navbar and authenticated layout unchanged_
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 3.2 Fix EJS layout — guard socket.io script tag in `main.ejs` and `footer.ejs`
    - Confirm `<script src="/socket.io/socket.io.js">` in `main.ejs` is wrapped in `<% if (locals.user) { %> … <% } %>`
    - Confirm the same guard exists in `footer.ejs`
    - _Bug_Condition: BC-3 — socket.io loaded unconditionally on unauthenticated pages_
    - _Expected_Behavior: EB-3 — socket.io only loaded when `locals.user` is truthy_
    - _Preservation: PR-11 — real-time updates on transfer detail page unaffected_
    - _Requirements: 1.4, 2.4, 3.11_

  - [ ] 3.3 Fix `transfers/detail.ejs` — remove duplicate socket.io script tag
    - Remove the inline `<script src="/socket.io/socket.io.js">` block from `detail.ejs` if it still exists
    - The footer partial already provides the socket.io script under the user guard
    - _Bug_Condition: BC-4 — socket.io loaded twice on transfer detail page_
    - _Expected_Behavior: EB-4 — single socket.io load via footer partial_
    - _Preservation: PR-11 — socket.io real-time updates continue to work_
    - _Requirements: 1.5, 2.5, 3.11_

  - [ ] 3.4 Fix `transfers/index.ejs` and `transfers/detail.ejs` — null-safe `createdAt`
    - In `transfers/index.ejs`: ensure `<%= t.createdAt ? t.createdAt.toLocaleDateString() : '—' %>`
    - In `transfers/detail.ejs`: ensure `<%= transfer.createdAt ? transfer.createdAt.toLocaleString() : '—' %>`
    - _Bug_Condition: BC-5 — `createdAt` is null, calling `.toLocaleDateString()` throws TypeError_
    - _Expected_Behavior: EB-5 — renders `'—'` safely when `createdAt` is null_
    - _Preservation: PR-9 — valid Date objects continue to format and display correctly_
    - _Requirements: 1.6, 2.6, 3.9_

  - [ ] 3.5 Fix `dashboard/index.ejs` — rename loop variable to avoid shadowing
    - Change `summary.recentUsers.forEach(function(user) {` to `summary.recentUsers.forEach(function(recentUser) {`
    - Update all references inside the loop body from `user.*` to `recentUser.*`
    - _Bug_Condition: BC-6 — `user` loop variable shadows outer session `user`_
    - _Expected_Behavior: EB-6 — `recentUser` used in loop; outer `user` unambiguous_
    - _Preservation: PR-1 — dashboard continues to render correctly with session user's name_
    - _Requirements: 1.7, 2.7, 3.1_

  - [ ] 3.6 Fix `inventory/index.ejs` — null-safe `reorderLevel`
    - Ensure the Reorder Level cell renders `<%= item.reorderLevel != null ? item.reorderLevel : 0 %>`
    - _Bug_Condition: BC-7 — `reorderLevel` is undefined, template outputs `'undefined'`_
    - _Expected_Behavior: EB-7 — renders `0` when `reorderLevel` is not set_
    - _Preservation: PR-10 — valid reorderLevel values continue to display unchanged_
    - _Requirements: 1.8, 2.8, 3.10_

  - [ ] 3.7 Fix `auth.service.js` — remove redundant DB lookup and remove `signToken` re-export
    - Confirm `login()` contains only a single `UserModel.findOne({ email }).populate('role')` call
    - Confirm `userRepo.findByEmail` is NOT called inside `login()`
    - Confirm `module.exports = { login, register }` — `signToken` is NOT exported
    - _Bug_Condition: BC-8 — double DB lookup; BC-9 — `signToken` re-exported_
    - _Expected_Behavior: EB-8 — single DB query; EB-9 — service exports only `login` and `register`_
    - _Preservation: PR-2 — valid login continues to work; PR-3 — invalid login returns null_
    - _Requirements: 1.9, 1.10, 2.9, 2.10, 3.2, 3.3_

  - [ ] 3.8 Fix `transfer.service.js` — coerce `quantity` to number at function entry
    - Confirm first line of `initiateTransfer` body is `const quantity = Number(data.quantity);`
    - Ensure subsequent stock comparison `stock.quantity < quantity` uses the coerced number
    - _Bug_Condition: BC-10 — `quantity` is a string; `stock.quantity < quantity` is always false for strings_
    - _Expected_Behavior: EB-10 — `Number(data.quantity)` ensures numeric comparison_
    - _Preservation: PR-4 — integer excess quantity still throws insufficient stock; PR-5 — valid quantity still creates transfer_
    - _Requirements: 1.11, 2.11, 3.4, 3.5_

  - [ ] 3.9 Fix `inventory.service.js` — safe ObjectId extraction in `rebuildStockFromTransactions`
    - Confirm each transaction uses `(tx.branch?._id ?? tx.branch).toString()` for the branch ID
    - Confirm each transaction uses `(tx.product?._id ?? tx.product).toString()` for the product ID
    - _Bug_Condition: BC-11 — populated Mongoose doc `.toString()` returns `[object Object]`_
    - _Expected_Behavior: EB-11 — `?._id ?? field` extracts correct ID regardless of populated vs plain_
    - _Preservation: PR-6 — plain ObjectId transactions continue to reconcile correctly_
    - _Requirements: 1.12, 2.12, 3.6_

  - [ ] 3.10 Fix `app.js` — Redis fallback to MemoryStore and v6 init pattern
    - Confirm the Redis initialization block is wrapped in a `try/catch`
    - Confirm that when `REDIS_URL` is unset, `sessionStore` is left `undefined` so `express-session` defaults to MemoryStore
    - Confirm a `logger.warn` is emitted when falling back
    - Confirm `connect-redis` is initialized with the v6 pattern: `require('connect-redis')(session)`
    - _Bug_Condition: BC-12 — no fallback when Redis unavailable; BC-13 — wrong v6 init pattern_
    - _Expected_Behavior: EB-12 — MemoryStore fallback with warning log; EB-13 — v6 pattern used_
    - _Preservation: PR-8 — when Redis IS available, Redis store continues to be used_
    - _Requirements: 1.13, 1.14, 2.13, 2.14, 3.8_

  - [ ] 3.11 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Bug Conditions Resolved
    - **IMPORTANT**: Re-run the SAME tests written in task 1 — do NOT write new tests
    - These tests encode expected behavior; passing confirms the fix is correct
    - Run: `npx jest --testPathPattern="bugCondition" --runInBand`
    - **EXPECTED OUTCOME**: All six exploration tests PASS
    - _Requirements: 2.9, 2.10, 2.11, 2.12, 1.6, 1.8_

  - [ ] 3.12 Verify preservation tests still pass
    - **Property 2: Preservation** - No Regressions Introduced
    - **IMPORTANT**: Re-run the SAME tests written in task 2 — do NOT write new tests
    - Run: `npx jest --testPathPattern="preservation" --runInBand`
    - **EXPECTED OUTCOME**: All preservation tests PASS (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13_

- [ ] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite: `npx jest --runInBand`
  - Confirm all bug condition tests pass (bugs are fixed)
  - Confirm all preservation tests pass (no regressions)
  - Start the application and do a smoke-test: log in, visit dashboard, transfers list, transfer detail, inventory page
  - Verify the HTML source of any rendered page has proper `</body></html>` closing tags
  - Verify unauthenticated pages (login) do not include `socket.io.js` in the source
  - Verify the transfer detail page loads socket.io only once
  - Ask the user if any questions arise before marking complete
