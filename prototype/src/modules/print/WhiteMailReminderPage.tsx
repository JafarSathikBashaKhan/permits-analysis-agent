import { PrintList, buildPrintRows } from './PrintList';
import { applications, Application } from '../../data/mock';
import { usePersistentState } from '../../hooks/usePersistentState';

export function WhiteMailReminderPage() {
  const [persistedApps] = usePersistentState<Application[]>('prototype:applications:rows', () => [...applications]);
  const apps = persistedApps && persistedApps.length > 0 ? persistedApps : applications;
  
  return (
    <PrintList
      eyebrow="Applications"
      title="White Mail Reminder"
      description="White-mail reminder pipeline for physical permit re-issue and expiry follow-up."
      activeLabel="Active"
      rows={buildPrintRows(apps, 'active')}
    />
  );
}
