// Hand-written Page Object for the Permission Builder "Basic Information" step.
//
// Selectors sourced from: knowledge/ui-inventory/pom-builder/BasicInformationPage.cs
// (generated stub; do not edit the stub — edit this file instead)
//
// This is the page that broke TRApplyPermissionBuilderCRUD repeatedly.
// Cascading dropdowns (Type → Group → Category) are MUI Autocompletes wrapped in
// DPSAutoComplete, which forwards `dataTestId` → `data-testid` on the DOM root.

using System.Threading.Tasks;
using Microsoft.Playwright;

namespace MNPS.WorkFlow.WebPages.Builder;

public sealed class BasicInformationPage
{
    private readonly IPage _page;
    private readonly ILocator _container;

    public BasicInformationPage(IPage page)
    {
        _page = page;
        // Scope every locator to this container so the duplicated `#permissionName`
        // and `#description` ids resolve unambiguously on this page.
        _container = page.Locator("[data-testid='generalSettings-container']").First;
    }

    // ---------- Raw element accessors ----------

    public ILocator PermissionNameInput        => _container.Locator("#permissionName");
    public ILocator DescriptionInput           => _container.Locator("#description");
    public ILocator PermissionTypeDropdown     => _page.Locator("[data-testid='permissionTypeAutoComplete']");
    public ILocator PermissionGroupDropdown    => _page.Locator("[data-testid='permissionGroupAutoComplete']");
    public ILocator PermissionCategoryDropdown => _page.Locator("[data-testid='permissionCategoryAutoComplete']");

    // ---------- High-level actions ----------

    /// <summary>Wait until the form is fully rendered and interactive.</summary>
    public async Task WaitForReadyAsync()
    {
        await _container.WaitForAsync(new() { State = WaitForSelectorState.Visible, Timeout = 15_000 });
        await Assertions.Expect(PermissionNameInput).ToBeEnabledAsync(new() { Timeout = 10_000 });
    }

    public async Task EnterPermissionNameAsync(string name)
    {
        await PermissionNameInput.FillAsync(string.Empty);
        await PermissionNameInput.FillAsync(name);
    }

    public async Task EnterDescriptionAsync(string description)
    {
        await DescriptionInput.FillAsync(string.Empty);
        await DescriptionInput.FillAsync(description);
    }

    public Task SelectPermissionTypeAsync(string optionText)     => SelectAutocompleteAsync(PermissionTypeDropdown,     optionText);
    public Task SelectPermissionGroupAsync(string optionText)    => SelectAutocompleteAsync(PermissionGroupDropdown,    optionText);
    public Task SelectPermissionCategoryAsync(string optionText) => SelectAutocompleteAsync(PermissionCategoryDropdown, optionText);

    /// <summary>Fill the whole Basic Information form in one call.</summary>
    public async Task FillAsync(string name, string type, string group, string category, string description)
    {
        await WaitForReadyAsync();
        await EnterPermissionNameAsync(name);
        await SelectPermissionTypeAsync(type);
        await SelectPermissionGroupAsync(group);       // depends on Type — wait for it to repopulate
        await SelectPermissionCategoryAsync(category); // depends on Group
        await EnterDescriptionAsync(description);
    }

    // ---------- Internals ----------

    /// <summary>
    /// Open a DPSAutoComplete dropdown, type to filter, and click the matching option.
    /// Handles the MUI quirk where the listbox renders in a portal outside the input.
    /// </summary>
    private async Task SelectAutocompleteAsync(ILocator dropdown, string optionText)
    {
        // DPSAutoComplete root forwards the data-testid; the typeable input lives inside it.
        var input = dropdown.Locator("input").First;

        await dropdown.ScrollIntoViewIfNeededAsync();
        await input.ClickAsync();
        await input.FillAsync(string.Empty);
        await input.FillAsync(optionText);

        // MUI Autocomplete listbox renders in a portal at the document root.
        var option = _page
            .Locator(".MuiAutocomplete-popper .MuiAutocomplete-option")
            .Filter(new() { HasTextString = optionText })
            .First;

        await option.WaitForAsync(new() { State = WaitForSelectorState.Visible, Timeout = 10_000 });
        await option.ClickAsync();

        // Confirm the popper is gone before the next action — root cause of
        // TRApplyPermissionBuilderCRUD flakiness was a left-open popper with an
        // invisible backdrop intercepting later clicks.
        await _page.Locator(".MuiAutocomplete-popper").Last.WaitForAsync(
            new() { State = WaitForSelectorState.Hidden, Timeout = 5_000 });
    }
}
