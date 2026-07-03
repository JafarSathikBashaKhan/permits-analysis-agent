import { PrintList, buildPrintRows } from './PrintList';

export function PhysicalPermissionPage() {
  return (
    <PrintList
      eyebrow="Applications"
      title="Physical Permission"
      description="Physical permit issuing, download and print-partner dispatch."
      activeLabel="Print"
      rows={buildPrintRows('print')}
    />
  );
}
