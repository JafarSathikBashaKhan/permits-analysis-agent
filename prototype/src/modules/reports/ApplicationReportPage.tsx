import { ReportShell } from './ReportShell';

export function ApplicationReportPage() {
  return (
    <ReportShell
      title="Application Reports"
      description="Submissions, approvals, NFI, cancellations and suspensions."
      tabs={['Submitted', 'Active', 'NFI', 'Cancelled', 'Suspension']}
    />
  );
}
