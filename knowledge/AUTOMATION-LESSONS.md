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

## L-006: NEVER `page.ReloadAsync()` after login — it logs you out

**Mistake:** Calling `page.ReloadAsync()`, `page.GotoAsync(baseUrl)` to the root,
or pressing F5 mid-test to "recover" from a stuck UI. The app's auth token
lives in memory / session storage and a hard refresh tears down the
Microsoft OAuth session. You land on
`login.microsoftonline.com/.../logoutsession` ("You signed out of your
account") and every subsequent action times out trying to find an app
element on a Microsoft sign-out page.

**Fix:** Never reload. To recover UI state:
- Navigate **within** the SPA by clicking a menu item / breadcrumb / link
- Use `flow.DismissOpenPoppersAsync()` to clear stuck overlays
- Use `page.GoBackAsync()` only if you know the previous page is in the app
- If you genuinely need a fresh page, sign in again from the start of the test

If you absolutely must reload (debugging only), re-run the login flow
immediately after.

**Why:** Auth in this app is Microsoft OAuth + MFA-skip. A reload triggers
`logoutsession` because the token is short-lived and not in a long-lived
cookie. The screenshot the user shared shows the exact landing page.

**Example (wrong → right):**
```csharp
// Wrong — kicks you to login.microsoftonline.com/.../logoutsession
await page.ReloadAsync();
await page.Locator("button:has-text('Save Draft')").ClickAsync(); // 30s timeout

// Right — navigate inside the SPA
await flow.NavigateToBuilderListAsync(TargetContractName);
await flow.DismissOpenPoppersAsync();
```

---

## L-007: Unsaved-changes popup blocks navigation — always check after a menu click

**Mistake:** Test clicks a side-menu item to navigate away from an Edit screen
with dirty fields. The app intercepts with a modal: *"Your work is unsaved.
Are you sure want to cancel?"* with **No** / **Yes** buttons. The page does
NOT navigate until **Yes** is clicked. The test then fails further on,
looking for elements on the destination page that never loaded — the real
cause (the blocking modal) is invisible in the failure message.

**Fix:** After ANY navigation click that leaves an editable form, check for
the unsaved-changes dialog and confirm it:

```csharp
// Helper — put on a base / shared workflow class
public async Task ConfirmUnsavedChangesIfPresentAsync()
{
    var dialog = _page.Locator(
        "xpath=//*[@role='dialog'][.//*[contains(normalize-space(),'unsaved') " +
        "or contains(normalize-space(),'Unsaved') " +
        "or contains(normalize-space(),'discard') " +
        "or contains(normalize-space(),'Discard')]]"
    ).First;

    if (await dialog.CountAsync() > 0 && await dialog.IsVisibleAsync())
    {
        var yesBtn = dialog.Locator(
            "xpath=.//button[normalize-space()='Yes' " +
            "or normalize-space()='Discard' " +
            "or normalize-space()='Leave' " +
            "or normalize-space()='Confirm']"
        ).First;
        await yesBtn.ClickAsync();
        await _page.WaitForTimeoutAsync(500);
    }
}
```

Call it immediately after any menu/breadcrumb/tab click from an Edit screen.

**Why:** The dialog is application-wide (Permission Builder, Contract Setup,
Applications, etc.). Without this helper, ~30% of cross-page tests fail
intermittently depending on whether the previous test left a dirty form.

---

## L-008: Page headings are NOT consistent — verify navigation differently

**Mistake:** Asserting page navigation via the page heading: each screen uses
a different element (`<h1>`, `<h2>`, `<div class="page-title">`,
`<span class="header-title">`, breadcrumb text only, sometimes no heading
at all). Tests that depend on heading text break the moment a new module
is added with yet another heading style.

**Fix:** Don't trust headings to confirm "we arrived". Use one of:

| Signal | How |
| --- | --- |
| **URL fragment** | `await page.WaitForURLAsync(new Regex(".*/builder$"), new() { Timeout = 10_000 });` |
| **A known-unique element on the destination page** | `await Assertions.Expect(ui.ListSearchInput).ToBeVisibleAsync(new() { Timeout = 10_000 });` |
| **API call settled** | `await page.WaitForLoadStateAsync(LoadState.NetworkIdle, new() { Timeout = 15_000 });` |
| **Heading — only as a soft check after the above** | Use a tolerant selector that ORs several heading kinds |

The **best** signal is a unique element from the inventory
(`knowledge/ui-inventory/`) — e.g. `[data-testid='generalSettings-container']`
for the Builder edit screen. It's both unique AND interactable, so it doubles
as a readiness check.

**Why:** Heading text + heading tag both change frequently. URLs and core
content elements change far less often. The inventory tells you which
container-level testids are most stable.

**Example (wrong → right):**
```csharp
// Wrong — brittle: breaks when h1 becomes h2 or a div
await Assertions.Expect(page.Locator("h1:has-text('Builder')")).ToBeVisibleAsync();

// Right — wait for a known content element + URL
await page.WaitForURLAsync(new Regex(".*/builder.*"), new() { Timeout = 10_000 });
await Assertions.Expect(ui.ListSearchInput).ToBeVisibleAsync(new() { Timeout = 10_000 });
```

**Combined recipe for any navigation from an Edit screen:**
```csharp
await someMenuItem.ClickAsync();
await flow.ConfirmUnsavedChangesIfPresentAsync();          // L-007
await page.WaitForURLAsync(new Regex(".*/destination.*")); // L-008
await Assertions.Expect(destinationAnchor).ToBeVisibleAsync(new() { Timeout = 10_000 });
```

---

<!-- Append new lessons below this line — keep them numbered sequentially -->
