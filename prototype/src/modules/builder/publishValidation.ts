/**
 * Publish validation logic per US-155975
 * Validates all mandatory fields before allowing a permission to be published.
 */

export type ValidationError = {
  section: string;
  field: string;
  message: string;
};

export type PublishValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

/**
 * Comprehensive publish validation for a permission.
 * Per US-155975, must validate:
 *   - Basic Information: name, type, group, description
 *   - General Settings: startDatePolicy, prefix, T&Cs, displayDescription, permitMode
 *   - Zone Mapping: at least one zone (if zonal)
 *   - Payment Settings: at least one payment method
 *   - Discount Settings: blue badge discount, pension discount (defaults 0 OK)
 *   - Document Type Settings: at least one document type enabled
 *   - Merchant Settings: (all optional)
 *   - Renewals & Reminders: (optional unless enabled, then config required)
 *   - Email Templates: (optional unless event added)
 *   - Visitor Portal: (optional)
 *   - Special Events: (mandatory if enabled in General Settings)
 *   - Rules > Refund: (if enabled, all fields mandatory)
 *   - Rules > Auto Approval: (optional)
 *   - Rules > Vehicle Settings: VRN Limit, Number Plate Change Limit mandatory
 *   - Rules > Template Settings: Physical Permit + White Mail Reminder mandatory if permitMode = physical
 *   - Pricing: all fields required
 *   - Permission Limits: if set limit, must have value (default 1 OK)
 *   - Application Form: at least one form configured
 */
export function validatePermissionForPublish(permission: any): PublishValidationResult {
  const errors: ValidationError[] = [];

  // 1. Basic Information
  if (!permission.name?.trim()) {
    errors.push({ section: 'Basic Information', field: 'Permission Name', message: 'This field is required' });
  }
  if (!permission.type?.trim()) {
    errors.push({ section: 'Basic Information', field: 'Type', message: 'This field is required' });
  }
  if (!permission.group?.trim()) {
    errors.push({ section: 'Basic Information', field: 'Group', message: 'This field is required' });
  }
  if (!permission.description?.trim()) {
    errors.push({ section: 'Basic Information', field: 'Description', message: 'This field is required' });
  }

  // 2. General Settings
  if (!permission.generalSettings?.startDatePolicy) {
    errors.push({ section: 'General Settings', field: 'Start Date Settings', message: 'This field is required' });
  }
  if (!permission.generalSettings?.prefix?.trim()) {
    errors.push({ section: 'General Settings', field: 'Prefix', message: 'This field is required' });
  }
  if (!permission.generalSettings?.termsAndConditions) {
    errors.push({ section: 'General Settings', field: 'Terms & Conditions', message: 'This field is required' });
  }
  if (!permission.generalSettings?.displayDescription?.trim()) {
    errors.push({ section: 'General Settings', field: 'Display Description', message: 'This field is required' });
  }
  if (!permission.generalSettings?.permitMode) {
    errors.push({ section: 'General Settings', field: 'Permit Mode', message: 'This field is required' });
  }

  // 3. Zone Mapping (if permit is zonal)
  const isZonal = permission.category !== 'Visitor' && permission.category !== 'Scratch Card' && permission.category !== 'Car Park (Non-Zonal)';
  if (isZonal && (!permission.zones || permission.zones.length === 0)) {
    errors.push({ section: 'Zone Mapping', field: 'Zones', message: 'Please select at least one zone' });
  }

  // 4. Payment Settings
  if (!permission.paymentSettings?.methods || permission.paymentSettings.methods.length === 0) {
    errors.push({ section: 'Payment Settings', field: 'Payment Methods', message: 'At least one payment method is required to publish this permission' });
  }

  // 5. Document Type Settings
  if (!permission.documentTypes || permission.documentTypes.length === 0) {
    errors.push({ section: 'Document Type Settings', field: 'Documents', message: 'At least one document type should be checked and enabled to publish' });
  }

  // 6. Special Events (if enabled)
  if (permission.generalSettings?.specialEvent === 'enable') {
    if (!permission.specialEvents?.propertySet) {
      errors.push({ section: 'General Settings', field: 'Special Event Properties', message: 'This field is required' });
    }
    if (!permission.specialEvents?.configurations || permission.specialEvents.configurations.length === 0) {
      errors.push({ section: 'Special Events', field: 'Event Configurations', message: 'At least one special event configuration set should be configured' });
    }
  }

  // 7. Rules > Refund Settings
  if (permission.rules?.refund?.applicable === 'yes') {
    if (!permission.rules.refund.policy) {
      errors.push({ section: 'Rules > Refund Settings', field: 'Refund Policy', message: 'This field is required' });
    }
    if (!permission.rules.refund.cancellationCharge) {
      errors.push({ section: 'Rules > Refund Settings', field: 'Cancellation Charge', message: 'This field is required' });
    }
  }

  // 8. Rules > Vehicle Settings
  if (!permission.rules?.vehicle?.plateChangeLimit) {
    errors.push({ section: 'Rules > Vehicle Settings', field: 'Number Plate Change Limit', message: 'This field is required' });
  }

  // 9. Rules > Template Settings (if physical permit mode)
  if (permission.generalSettings?.permitMode === 'physical') {
    if (!permission.rules?.template?.physicalPermit) {
      errors.push({ section: 'Rules > Template Settings', field: 'Physical Permit Print', message: 'This field is required' });
    }
    if (!permission.rules?.template?.whiteMailReminder) {
      errors.push({ section: 'Rules > Template Settings', field: 'White Mail Reminder', message: 'This field is required' });
    }
  }

  // 10. Pricing
  if (!permission.pricing || Object.keys(permission.pricing).length === 0) {
    errors.push({ section: 'Pricing', field: 'Pricing Configuration', message: 'Please complete the pricing configuration to publish' });
  }

  // 11. Application Form
  if (!permission.applicationForms || permission.applicationForms.length === 0) {
    errors.push({ section: 'Application Form', field: 'Forms', message: 'Configure at least 1 form to publish' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Count validation errors by section for badge display
 */
export function getErrorCountBySection(errors: ValidationError[]): Record<string, number> {
  return errors.reduce((acc, e) => {
    acc[e.section] = (acc[e.section] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
