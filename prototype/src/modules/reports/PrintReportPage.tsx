import { ReportShell } from './ReportShell';

export function PrintReportPage() {
  return (
    <ReportShell
      title="Print Reports"
      description="White-mail reminder and physical permit dispatch metrics."
      tabs={['White Mail Reminder', 'Physical Permission']}
    />
  );
}
