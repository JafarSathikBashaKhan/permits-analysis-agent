import { PrintList, buildPrintRows } from './PrintList';

export function WhiteMailReminderPage() {
  return (
    <PrintList
      eyebrow="Applications"
      title="White Mail Reminder"
      description="White-mail reminder pipeline for physical permit re-issue and expiry follow-up."
      activeLabel="Active"
      rows={buildPrintRows('active')}
    />
  );
}
