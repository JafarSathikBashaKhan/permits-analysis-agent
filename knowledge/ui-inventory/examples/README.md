# Stub → Real Page Object: a worked example

Generated stubs (`pom-*/*.cs`) give you correct selectors.
A **real** Page Object adds: scoping for collisions, MUI-aware waits,
high-level actions, and the quirk-handling that the live app actually needs.

## The example

| File | What it is |
| --- | --- |
| `../pom-builder/BasicInformationPage.cs` | Auto-generated stub — 7 raw `ILocator` properties, no actions |
| `./BasicInformationPage.cs`               | Hand-written real Page Object derived from the stub |

## What changed from stub → real

| Concern | Stub (auto) | Real (hand) |
| --- | --- | --- |
| Namespace | `…Generated.Builder` | `…WebPages.Builder` (so it's clearly hand-maintained) |
| Collisions | `#permissionName` on the page-wide `IPage` | Scoped under `[data-testid='generalSettings-container']` — kills the 2× id collision |
| Dropdown clicks | None — just an `ILocator` | `SelectAutocompleteAsync` opens, filters, picks from the MUI portal, **waits for popper to close** |
| Actions | None | `EnterPermissionNameAsync`, `SelectPermissionTypeAsync`, full-form `FillAsync(...)` |
| Readiness | None | `WaitForReadyAsync()` — assert input is enabled, not just visible |
| Flakiness root-cause | n/a | Explicit `.MuiAutocomplete-popper` hidden-wait — stops the morning's failure cascade |

## The recipe (5 steps)

1. **Open the generated stub** in `pom-<module>/<Component>Page.cs`.
2. **Copy** all `ILocator` properties into a new class under your real namespace (`MNPS.WorkFlow.WebPages.<Module>`).
3. **Scope** anything marked `WARNING: value reused Nx` to its container locator.
4. **Add a `WaitForReadyAsync`** that asserts not just visibility but interactability.
5. **Wrap each interaction in an action method** so test code reads as intent, not selectors.

## Cascading dropdown quirk

Permission Builder's Type → Group → Category dropdowns are wired to repopulate
on each parent selection. Always:

```csharp
await page.SelectPermissionTypeAsync("Resident");
await page.SelectPermissionGroupAsync("Zone A");      // Group list is rebuilt — needs a fresh open
await page.SelectPermissionCategoryAsync("Standard"); // Same
```

`SelectAutocompleteAsync` already handles this by re-opening the input
and waiting for the popper to disappear between calls.

## Why we don't just use the stubs directly

The stubs are intentionally minimal. They give you a **selector contract**
that auto-updates when the UI changes (re-run the scanner). The real
Page Objects encode **app behaviour** — MUI portal positioning, cascading
state, animation waits — which is stable across releases and worth
owning by hand.
