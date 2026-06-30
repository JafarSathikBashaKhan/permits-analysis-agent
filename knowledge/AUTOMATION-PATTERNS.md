# Automation Patterns — Anti-Flakiness Playbook

> **Audience:** authors of the Permit QA Playwright tests.
> **Purpose:** consolidate the patterns that kill the two recurring flakiness symptoms:
> 1. Menu does not navigate on first click
> 2. Page re-renders after dropdown select → locators go stale
>
> Every UI test in this repo should go through `BasePage` helpers. If a test
> uses `WaitForTimeoutAsync(<magic-number>)` it is wrong — fix the helper.

---

## The 5 rules (must-follow)

1. **Never cache `ElementHandle`** — always use `Page.Locator(...)` which re-resolves the DOM on every call.
2. **Always `Expect(...).ToBeEnabledAsync` before click**, not just `ToBeVisibleAsync`. Enabled implies hydrated.
3. **After every action that triggers a fetch, wait for the response by URL fragment** — not for a timeout.
4. **Verify navigation by URL or landmark element**, not by assuming the click "worked."
5. **Centralise all waits in `BasePage`** — tests never call `WaitForTimeoutAsync` with a magic number.

---

## Pattern 1 — Safe Click

Replace every `await xxx.ClickAsync()` in test code with `await SafeClickAsync(...)` from `BasePage`. It:
- Waits Visible
- Waits Enabled (hydration)
- Scrolls into view
- Clicks
- Logs the action

```csharp
protected async Task SafeClickAsync(ILocator loc, string desc)
{
    await Expect(loc).ToBeVisibleAsync();
    await Expect(loc).ToBeEnabledAsync();
    await loc.ScrollIntoViewIfNeededAsync();
    await loc.ClickAsync();
    Output.WriteLine($"[click] {desc}");
}
```

---

## Pattern 2 — Safe Fill (with commit verification)

React-controlled inputs sometimes don't apply value on the first keystroke after a re-render. Verify commit:

```csharp
protected async Task SafeFillAsync(ILocator loc, string value, string desc)
{
    await Expect(loc).ToBeVisibleAsync();
    await loc.FillAsync(value);
    await Expect(loc).ToHaveValueAsync(value);
    Output.WriteLine($"[fill] {desc} = '{value}'");
}
```

---

## Pattern 3 — Navigation with retry + URL verification

This kills "menu needs second click" failures:

```csharp
public async Task NavigateAsync(string menuLabel, string expectedUrlFragment)
{
    var item = _page.Locator($"text={menuLabel}").First;

    for (int attempt = 1; attempt <= 3; attempt++)
    {
        await Expect(item).ToBeEnabledAsync();
        await item.ClickAsync();
        try
        {
            await _page.WaitForURLAsync($"**/*{expectedUrlFragment}*",
                new() { Timeout = 5_000 });
            return; // success
        }
        catch (TimeoutException) when (attempt < 3)
        {
            Output.WriteLine($"[nav-retry] '{menuLabel}' attempt {attempt} — retrying");
            await _page.WaitForTimeoutAsync(500); // only place magic-sleep is OK
        }
    }
    throw new Exception($"Failed to navigate to {menuLabel} after 3 attempts");
}
```

---

## Pattern 4 — Cascading dropdown with API-response wait

Fixes "category dropdown not populated after group select":

```csharp
public async Task SelectGroupAndWaitForCategoriesAsync(string groupName)
{
    // 1) Set up wait BEFORE the action
    var categoriesResponse = _page.WaitForResponseAsync(r =>
        r.Url.Contains("/PermissionCategories") && r.Status == 200,
        new() { Timeout = 15_000 });

    // 2) Do the action
    await SelectAutoCompleteAsync("permissionGroupAutoComplete", groupName);

    // 3) Await the deterministic signal — NOT an arbitrary sleep
    await categoriesResponse;
}
```

For Permission Builder specifically these endpoints fire:

| User selects… | Endpoint to wait for |
|---|---|
| Type | `/PermissionGroups` |
| Group | `/PermissionCategories` |
| (Builder save) | `/PermissionBuilder` (POST 200) |

---

## Pattern 5 — Autocomplete (MUI) with popper

```csharp
protected async Task SelectAutoCompleteAsync(string testId, string value)
{
    var trigger = _page.Locator($"[data-testid='{testId}'] input");
    await Expect(trigger).ToBeEnabledAsync();

    await trigger.ClickAsync();
    await trigger.FillAsync(value);

    var option = _page.Locator($".MuiAutocomplete-popper li:has-text('{value}')").First;
    await option.WaitForAsync(new() { Timeout = 10_000 });
    await option.ClickAsync();

    await WaitForAppIdleAsync();
    await Expect(trigger).ToHaveValueAsync(value);
}
```

---

## Pattern 6 — Global "app idle" wait

Handles the MUI Backdrop / global spinner the app shows during fetches:

```csharp
protected async Task WaitForAppIdleAsync(int timeoutMs = 15_000)
{
    await _page.WaitForLoadStateAsync(LoadState.NetworkIdle,
        new() { Timeout = timeoutMs });

    var spinner = _page.Locator(".MuiBackdrop-root, .loading-overlay, [data-testid='loading-spinner']");
    try
    {
        await spinner.WaitForAsync(
            new() { State = WaitForSelectorState.Hidden, Timeout = 5_000 });
    }
    catch (TimeoutException) { /* spinner never appeared, fine */ }
}
```

---

## Pattern 7 — API response wait helper

Use whenever a click triggers an XHR:

```csharp
protected async Task<IResponse> WaitForApiAsync(string urlFragment, int timeoutMs = 15_000)
    => await _page.WaitForResponseAsync(
        r => r.Url.Contains(urlFragment) && r.Status >= 200 && r.Status < 400,
        new() { Timeout = timeoutMs });
```

---

## Global Playwright config (kills ~70% of remaining flakiness)

Set in `PlaywrightFixture` / context creation:

```csharp
context.SetDefaultTimeout(30_000);          // up from default 5s
context.SetDefaultNavigationTimeout(45_000); // SPAs slow on first load
```

---

## Test tiering (Trait-based)

| Tier | Trait | When | Scope |
|---|---|---|---|
| Smoke | `[Trait("Tier","Smoke")]` | Every PR | Login + 1 nav per module, ~2 min |
| Functional | `[Trait("Tier","Functional")]` | Nightly | All happy paths + key validations |
| Regression | `[Trait("Tier","Regression")]` | Weekly | Exhaustive — boundary, role matrix, env toggles |

Run with:
```bash
dotnet test --filter "Tier=Smoke"
dotnet test --filter "Tier=Functional"
dotnet test --filter "Tier=Regression"
```

---

## The 4 architectural rules

1. **One Page Object per real screen** — no GodPage. Builder has 4-5 step pages.
2. **Two layers per page**: low-level actions (`SetAdminFee(v)`) + flows (`SetAdminFeeAndSave(v)`). Tests call flows.
3. **Fixture-as-prerequisite, not test-as-prerequisite**. Use API to seed; do not chain tests via Order.
4. **Three test tiers** (above).

---

## Environment & data rules (LOCKED for this project)

- **Only `AutomationApplyIQ` contract** — no other contract is touched.
- **Never modify existing data** — always create new (timestamped) test data.
- Any destructive write must be flagged in chat before execution.

---

## When you hit a flake

1. Check: did you cache an `ElementHandle`? Replace with `Page.Locator(...)`.
2. Check: did you `await ClickAsync` then immediately query the new screen? Insert `WaitForApiAsync` or `WaitForURLAsync`.
3. Check: did you use `Expect(...).ToBeVisibleAsync` only? Add `ToBeEnabledAsync`.
4. If none of the above — add a deterministic wait by intercepting the XHR. **Do not** sprinkle `WaitForTimeoutAsync`.
