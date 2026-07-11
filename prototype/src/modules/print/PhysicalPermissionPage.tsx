import { PrintList, buildPrintRows } from './PrintList';
import { applications, Application } from '../../data/mock';
import { usePersistentState } from '../../hooks/usePersistentState';

export function PhysicalPermissionPage() {
  const [persistedApps] = usePersistentState<Application[]>('prototype:applications:rows', () => [...applications]);
  const apps = persistedApps && persistedApps.length > 0 ? persistedApps : applications;
  
  return (
    <PrintList
      eyebrow="Applications"
      title="Physical Permission"
      description="Physical permit issuing, download and print-partner dispatch."
      activeLabel="Print"
      rows={buildPrintRows(apps, 'print')}
    />
  );
}
