import { ReportShell } from './ReportShell';

export function VoucherReportPage() {
  return (
    <ReportShell
      title="Voucher Reports"
      description="Voucher issue, activation and unused voucher tracking."
      tabs={['Unused Voucher', 'Activated Voucher']}
    />
  );
}
