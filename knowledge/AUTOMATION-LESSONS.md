# Automation Lessons Learned

**Purpose:** Mistakes we keep making in Playwright + xUnit + C# test automation
for the NPS Backoffice. The QA agent reads this file BEFORE writing or fixing
any test code, and applies every lesson automatically.

**How to add a lesson:**  Say *"Add lesson: <observation>"* in chat.
The agent will append it here using the format below.

**How to retire a lesson:**  Say *"Remove L-XXX"* — but only when the
underlying issue is permanently fixed in the app (not just worked around).

---

## L-001: Don't `OR`-assert two different UI states

**Mistake:** `Assert.True(dialogVisible || editModeVisible, ...)` — tries to be
"forgiving" but actually hides bugs. If the app stops showing the dialog
entirely, the test still passes by accident.

**Fix:** Read the source / spec, decide the ONE correct state, and assert that.
If both states are genuinely valid (rare), write two separate tests.

**Why:** Loose assertions are why flaky tests stay green when they should
be telling you the app broke.

**Example (wrong → right):**
```csharp
// Wrong
Assert.True(dialogVisible || editModeVisible, "Clone should show dialog or edit mode.");

// Right — US-156658 says Clone MUST show a dialog first
Assert.True(dialogVisible, "Clone must show the confirmation dialog (US-156658).");
```

---

## L-002: Always wrap test bodies in `try/finally` for cleanup

**Mistake:** Test fails halfway through, leaves orphan permissions/locations/streets
in the DB. Next run collides on the unique-name constraint and fails for the
WRONG reason. Whole day debugging the wrong bug.

**Fix:** Every test that creates data does so inside a `try`, with API or UI
deletion in `finally`. Cleanup itself wrapped in `try { ... } catch { }` so it
never masks the real failure.

**Why:** Idempotency. A test must be re-runnable on a dirty environment.

**Example:**
```csharp
try
{
    // arrange + act + assert
}
finally
{
    try { await flow.DeleteAsync(uniqueName); } catch { }
    await flow.DismissOpenPoppersAsync();
}
```

---

## L-003: MUI poppers leave invisible backdrops that intercept clicks

**Mistake:** Test A fails with a popover still open. The popover's
`MuiBackdrop-invisible` has opacity 0 but still catches pointer events. Test B
times out 30s clicking on a button under the invisible backdrop.

**Fix:** Always call `flow.DismissOpenPoppersAsync()` at the end of any test
that opens a menu / dialog / popper. Especially before navigation.

**Why:** Shared-page test mode (`useSharedPage: true`) propagates DOM state
across tests. This single issue caused 5 of 6 failures in
TRApplyPermissionBuilderCRUD.

**Example:** Already in `PermissionBuilderCRUDFunctionality.DismissOpenPoppersAsync`
— uses JS `getComputedStyle` to detect zero-opacity backdrops, then
`document.body.click()` to dismiss them.

---

## L-004: Don't poll element visibility with `IsVisibleAsync` for assertions

**Mistake:** `Assert.True(await locator.IsVisibleAsync())` — returns
**immediately** with the current value. If the element hasn't rendered yet,
returns `false`, test fails — even though it would have appeared 200ms later.

**Fix:** Use Playwright's built-in waiting assertions:
- `await Assertions.Expect(locator).ToBeVisibleAsync(new() { Timeout = 10_000 });`
- `await locator.WaitForAsync(new() { State = WaitForSelectorState.Visible });`

**Why:** `IsVisibleAsync` is a *snapshot*. `Expect.ToBeVisibleAsync` is a *poll
with timeout*. The latter is what virtually every Playwright test needs.

**Example:**
```csharp
// Wrong — race condition
Assert.True(await ui.SaveDraftButton.IsVisibleAsync());

// Right — waits up to 15s
await Assertions.Expect(ui.SaveDraftButton).ToBeVisibleAsync(new() { Timeout = 15_000 });
```

---

## L-005: Pick the unique selector — don't pick `#id` when `data-testid` exists

**Mistake:** Writing `_page.Locator("#permissionName")` — but `#permissionName`
collides 2× across the codebase, and `#search` collides 7× across modules.
Tests resolve the wrong element silently.

**Fix:** Before writing a selector, check `knowledge/ui-inventory/ui-inventory.sqlite`:
```sql
SELECT kind, value, is_unique FROM ui_elements
WHERE module = '<module>' AND component = '<component>';
```
Pick the highest-weight `is_unique = 1` selector. If only colliding selectors
exist, **scope** to a unique parent container (e.g. `[data-testid='generalSettings-container']`).

**Why:** Locator collisions are 80% of our flake. The inventory exists exactly
to make this a 10-second lookup instead of a debugging session.

**Example:**
```csharp
// Wrong — #permissionName resolves to BOTH BasicInformation and another form
public ILocator PermissionNameInput => _page.Locator("#permissionName");

// Right — scoped to the container, no collision
private readonly ILocator _container =
    _page.Locator("[data-testid='generalSettings-container']").First;
public ILocator PermissionNameInput => _container.Locator("#permissionName");
```

---

<!-- Append new lessons below this line — keep them numbered sequentially -->
