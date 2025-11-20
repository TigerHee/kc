import { getReport, initReport } from 'gbiz-next/report';

/**
 * report 对象的使用
 */
export async function setReportIdConfig(uid: number) {
  const report = await getReport();
  if (report) {
    report.setIDConfig(uid);
  }
}

export function initReportModule() {
  initReport(process.env.NEXT_PUBLIC_APP_NAME, { useSm: true });
}
