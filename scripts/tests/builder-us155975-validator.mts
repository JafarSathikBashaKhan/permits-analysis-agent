/**
 * US-155975 validator unit tests — cover EVERY acceptance criterion
 * against the pure `validatePermissionForPublish` function.
 *
 * Run: npx tsx scripts/tests/builder-us155975-validator.mts
 *
 * Results are appended to `test-results/validator-results.json` and printed
 * to stdout. The Playwright UI runner picks these up when building the HTML
 * report so every AC is visible in one place.
 */
import path from 'node:path';
import fs from 'node:fs';
import url from 'node:url';
import { validatePermissionForPublish, checkPrefixDuplicate } from '../../prototype/src/modules/builder/publishValidation.ts';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

type Row = { id: string; name: string; passed: boolean; detail: string };
const results: Row[] = [];

function record(id: string, name: string, passed: boolean, detail = '') {
  results.push({ id, name, passed, detail });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${id} — ${name}${detail ? `\n   ${detail}` : ''}`);
}

/** A fully-valid permission fixture. Individual tests override to null out a field. */
function fullValidPermission() {
  return {
    id: 'test-perm',
    name: 'Resident Permit',
    type: 'Permit',
    group: 'Residential',
    description: 'Standard resident permit',
    category: 'Standard',
    generalSettings: {
      startDatePolicy: 'immediate',
      prefix: 'RES',
      termsAndConditions: 'tc-1',
      displayDescription: 'For residents',
      permitMode: 'virtual',
      specialEvent: 'disable',
    },
    zones: ['zone-a'],
    paymentSettings: { methods: ['creditCard'] },
    documentTypes: [{ id: 'd1', enabled: true, count: 1 }],
    rules: {
      refund: { applicable: 'no' },
      vehicle: { plateChangeLimit: '3' },
      template: {},
    },
    pricing: { standard: 100 },
    applicationForms: [{ id: 'f1' }],
  };
}

function hasError(perm: any, sectionRegex: RegExp, fieldRegex?: RegExp): boolean {
  const { errors } = validatePermissionForPublish(perm);
  return errors.some(
    (e) => sectionRegex.test(e.section) && (fieldRegex ? fieldRegex.test(e.field) : true),
  );
}

function findError(perm: any, sectionRegex: RegExp, fieldRegex?: RegExp) {
  const { errors } = validatePermissionForPublish(perm);
  return errors.find(
    (e) => sectionRegex.test(e.section) && (fieldRegex ? fieldRegex.test(e.field) : true),
  );
}

// ─── Section 1: Publish only when mandatory filled ─────────────────────────
{
  const perm = fullValidPermission();
  const { valid, errors } = validatePermissionForPublish(perm);
  record('US-155975.pub.happy', 'Fully-filled permission is valid to publish', valid && errors.length === 0,
    `errors=${errors.length}`);
}
{
  const perm = fullValidPermission();
  perm.name = '';
  const { valid } = validatePermissionForPublish(perm);
  record('US-155975.pub.blocks', 'Missing mandatory field blocks publish', !valid);
}

// ─── Basic Information — 4 mandatory fields ────────────────────────────────
for (const [field, key] of [
  ['Permission Name', 'name'],
  ['Type', 'type'],
  ['Group', 'group'],
  ['Description', 'description'],
] as const) {
  const perm = fullValidPermission();
  (perm as any)[key] = '';
  const err = findError(perm, /^Basic Information$/, new RegExp(`^${field}$`));
  record(`US-155975.bi.${key}`, `Basic Info: ${field} required`, !!err,
    err ? `msg="${err.message}"` : 'no error raised');
}

// ─── General Settings — 5 mandatory fields ─────────────────────────────────
const gsCases: Array<[string, string]> = [
  ['Start Date Settings', 'startDatePolicy'],
  ['Prefix', 'prefix'],
  ['Terms & Conditions', 'termsAndConditions'],
  ['Display Description', 'displayDescription'],
  ['Permit Mode', 'permitMode'],
];
for (const [field, key] of gsCases) {
  const perm = fullValidPermission();
  (perm.generalSettings as any)[key] = '';
  const err = findError(perm, /^General Settings$/, new RegExp(`^${field}$`));
  record(`US-155975.gs.${key}`, `General Settings: ${field} required`, !!err,
    err ? `msg="${err.message}"` : 'no error raised');
}

// ─── Zone Mapping ──────────────────────────────────────────────────────────
{
  const perm = fullValidPermission();
  perm.zones = [];
  const err = findError(perm, /^Zone Mapping$/, /^Zones$/);
  record('US-155975.zone.required', 'Zonal permit: at least one zone required',
    !!err && /at least one zone/i.test(err.message),
    err ? `msg="${err.message}"` : 'no error');
}
{
  const perm = fullValidPermission();
  perm.category = 'Visitor';
  perm.zones = [];
  const err = findError(perm, /^Zone Mapping$/);
  record('US-155975.zone.visitor', 'Non-zonal (Visitor): zone NOT required', !err,
    err ? `unexpected: ${err.message}` : 'no zone error (correct)');
}

// ─── Payment Settings ──────────────────────────────────────────────────────
{
  const perm = fullValidPermission();
  perm.paymentSettings.methods = [];
  const err = findError(perm, /^Payment Settings$/);
  const msgOk = err && /at least one payment method is required/i.test(err.message);
  record('US-155975.pay.required', 'At least one payment method required',
    !!msgOk, err ? `msg="${err.message}"` : 'no error');
}
{
  const perm = fullValidPermission();
  (perm.paymentSettings as any).helpDescription = '';
  const err = findError(perm, /^Payment Settings$/);
  record('US-155975.pay.helpOptional', 'Help description is optional (no publish block)', !err,
    err ? `unexpected: ${err.message}` : 'no error');
}

// ─── Discount Settings (defaults 0 OK) ─────────────────────────────────────
{
  const perm = fullValidPermission();
  // Defaults not present → still valid because "0" is the implicit default.
  const err = findError(perm, /^Discount/i);
  record('US-155975.discount.defaults', 'Discount fields default to 0 → publish allowed', !err,
    err ? `unexpected: ${err.message}` : 'no error');
}

// ─── Document Type Settings ────────────────────────────────────────────────
{
  const perm = fullValidPermission();
  perm.documentTypes = [];
  const err = findError(perm, /^Document Type Settings$/);
  record('US-155975.doc.required', 'At least one document type required', !!err,
    err ? `msg="${err.message}"` : 'no error');
}

// ─── Merchant Settings (all optional) ──────────────────────────────────────
{
  const perm = fullValidPermission();
  // No merchant fields at all
  const err = findError(perm, /Merchant/i);
  record('US-155975.merchant.optional', 'Merchant fields are all optional', !err,
    err ? `unexpected: ${err.message}` : 'no error');
}

// ─── Renewals & Reminders (optional by default) ────────────────────────────
{
  const perm = fullValidPermission();
  const err = findError(perm, /Renewal/i);
  record('US-155975.renewal.optional', 'Renewals optional by default', !err);
}

// ─── Email Templates (optional) ────────────────────────────────────────────
{
  const perm = fullValidPermission();
  const err = findError(perm, /^Email/i);
  record('US-155975.email.optional', 'Email templates optional', !err);
}

// ─── Visitor Portal (optional) ─────────────────────────────────────────────
{
  const perm = fullValidPermission();
  const err = findError(perm, /Visitor/i);
  record('US-155975.visitor.optional', 'Visitor Portal is non-mandatory', !err);
}

// ─── Special Events ────────────────────────────────────────────────────────
{
  const perm = fullValidPermission();
  perm.generalSettings.specialEvent = 'enable';
  // property set + configurations both missing
  const errProp = findError(perm, /General Settings/, /Special Event Properties/);
  const errCfg = findError(perm, /^Special Events$/);
  record('US-155975.se.enabledProp', 'SE enabled → property set required', !!errProp,
    errProp ? `msg="${errProp.message}"` : 'no error');
  record('US-155975.se.enabledCfg', 'SE enabled → at least one config set required',
    !!errCfg && /at least one special event configuration/i.test(errCfg.message),
    errCfg ? `msg="${errCfg.message}"` : 'no error');
}
{
  const perm = fullValidPermission();
  perm.generalSettings.specialEvent = 'disable';
  const err = findError(perm, /Special Event/i);
  record('US-155975.se.disabledOptional', 'SE disabled → non-mandatory', !err);
}

// ─── Rules > Refund ────────────────────────────────────────────────────────
{
  const perm = fullValidPermission();
  perm.rules.refund = { applicable: 'yes' } as any;
  const err1 = findError(perm, /Refund/, /Refund Policy/);
  const err2 = findError(perm, /Refund/, /Cancellation Charge/);
  record('US-155975.rules.refund.policy', 'Refund enabled → Refund Policy required', !!err1);
  record('US-155975.rules.refund.charge', 'Refund enabled → Cancellation Charge required', !!err2);
}
{
  const perm = fullValidPermission();
  perm.rules.refund = { applicable: 'no' } as any;
  const err = findError(perm, /Refund/);
  record('US-155975.rules.refund.disabled', 'Refund disabled → policy/charge NOT required', !err);
}

// ─── Rules > Auto Approval (optional) ──────────────────────────────────────
{
  const perm = fullValidPermission();
  const err = findError(perm, /Auto Approval/i);
  record('US-155975.rules.autoApprovalOptional', 'Auto Approval checkboxes are all optional', !err);
}

// ─── Rules > Vehicle Settings ──────────────────────────────────────────────
{
  const perm = fullValidPermission();
  perm.rules.vehicle.plateChangeLimit = '';
  const err = findError(perm, /Vehicle Settings/, /Number Plate Change Limit/);
  record('US-155975.rules.vehicle.plateChange', 'Vehicle: Number Plate Change Limit required',
    !!err, err ? `msg="${err.message}"` : 'no error');
}

// ─── Rules > Template Settings (physical mode) ─────────────────────────────
{
  const perm = fullValidPermission();
  perm.generalSettings.permitMode = 'physical';
  const err1 = findError(perm, /Template Settings/, /Physical Permit Print/);
  const err2 = findError(perm, /Template Settings/, /White Mail Reminder/);
  record('US-155975.rules.tpl.physicalPrint', 'Physical mode → Physical Permit Print required', !!err1);
  record('US-155975.rules.tpl.whiteMail', 'Physical mode → White Mail Reminder required', !!err2);
}
{
  const perm = fullValidPermission();
  perm.generalSettings.permitMode = 'virtual';
  const err = findError(perm, /Template Settings/);
  record('US-155975.rules.tpl.virtualOptional', 'Virtual mode → template fields optional', !err);
}

// ─── Pricing ───────────────────────────────────────────────────────────────
{
  const perm = fullValidPermission();
  perm.pricing = {} as any;
  const err = findError(perm, /^Pricing$/);
  const msgOk = err && /please complete the pricing configuration/i.test(err.message);
  record('US-155975.pricing.required', 'Pricing config required with exact message',
    !!msgOk, err ? `msg="${err.message}"` : 'no error');
}

// ─── Permission Limits (default 1 OK) ──────────────────────────────────────
{
  const perm = fullValidPermission();
  // No permissionLimits object at all → treated as default 1 → publish allowed
  const err = findError(perm, /Permission Limit/i);
  record('US-155975.limits.default1', 'Permission Limit defaults to 1 → publish allowed', !err);
}

// ─── Application Form ──────────────────────────────────────────────────────
{
  const perm = fullValidPermission();
  perm.applicationForms = [];
  const err = findError(perm, /^Application Form$/);
  const msgOk = err && /configure at least 1 form to publish/i.test(err.message);
  record('US-155975.form.required', 'Application Form: at least 1 form required with exact message',
    !!msgOk, err ? `msg="${err.message}"` : 'no error');
}

// ─── "This field is required" messaging across sections ────────────────────
{
  const perm = { id: 'x' } as any; // empty
  const { errors } = validatePermissionForPublish(perm);
  const requiredMsgCount = errors.filter((e) => e.message === 'This field is required').length;
  record('US-155975.ui.msgPhrasing', 'Errors use "This field is required" phrasing',
    requiredMsgCount >= 4, `count=${requiredMsgCount}/${errors.length}`);
}

// ─── Bonus: US-188673 prefix duplicate logic ───────────────────────────────
{
  const all = [{ id: 'a', prefix: 'RES', type: 'Permit', status: 'Published' }];
  const err = checkPrefixDuplicate('RES', 'Suspension', 'b', all);
  record('US-188673.dup.crossType', 'Duplicate prefix across types blocked',
    !!err, err ?? 'no error');
}
{
  const all = [{ id: 'a', prefix: 'RES', type: 'Permit', status: 'Published' }];
  const err = checkPrefixDuplicate('RES', 'Permit', 'b', all);
  record('US-188673.dup.sameType', 'Same prefix within same type allowed', err === null,
    err ?? 'null (correct)');
}

// ─── Write results ─────────────────────────────────────────────────────────
const outDir = path.resolve(__dirname, '..', '..', 'test-results');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'validator-results.json');
fs.writeFileSync(outFile, JSON.stringify({
  suite: 'US-155975 validator unit tests',
  startedAt: new Date().toISOString(),
  total: results.length,
  passed: results.filter((r) => r.passed).length,
  failed: results.filter((r) => !r.passed).length,
  results,
}, null, 2));

const passed = results.filter((r) => r.passed).length;
const failed = results.length - passed;
console.log(`\n─── SUMMARY ─────────────────`);
console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
console.log(`Written: ${outFile}`);
process.exit(failed ? 1 : 0);
