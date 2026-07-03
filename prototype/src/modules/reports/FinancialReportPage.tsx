import { ReportShell } from './ReportShell';

export function FinancialReportPage() {
  return (
    <ReportShell
      title="Financial Reports"
      description="Income tracking, admin fees, VAT and diesel surcharge."
      tabs={['Income', 'Diesel Surcharge']}
    />
  );
}
