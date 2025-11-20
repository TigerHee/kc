import { kucoinv2Storage as storage } from 'tools/storage';
import { v4 as uuidV4 } from "uuid";
import { IS_PROD } from "config/env";

interface Token {
  token?: string;
  token_sm?: string;
}

interface ReportType {
  setIDConfig: (...args: any[]) => void;
  logWebNetwork: (...args: any[]) => void;
  logSelfDefined: (...args: any[]) => void;
  logStay: (...args: any[]) => void;
  logAction: (...args: any[]) => void;
  logFingerprint: (...args: any[]) => Promise<Token>;
}

let report: ReportType | null = null;
let reportReadyResolve: ((r: ReportType) => void) | null = null;
const reportReady = new Promise<ReportType>((resolve) => {
  reportReadyResolve = resolve;
});
function initConfig(deviceInfo: any, options = {}) {
  if (report) return report;
  import("@kc/report").then((mod) => {
    const _Report = mod.default || mod;
    _Report.useV2();

    _Report.configure({
      host: window.location.origin,
      api: "/_api/frontend-event-tracking/eventTracking",
      deviceInfo,
      channel: "web",
      env: IS_PROD ? "prod" : "test",
      ...options,
    });

    // 设置设备ID
    let clientId = storage.getItem("clientId");
    if (!clientId) {
      clientId = uuidV4();
      storage.setItem("clientId", clientId);
    }
    _Report.setIDConfig(null, clientId);

    report = _Report;
    reportReadyResolve?.(_Report);
  });
}

export function initReport(deviceInfo: any, options: any) {
  if (typeof window === "undefined") return;
  initConfig(deviceInfo, options);
}

export async function getReport(): Promise<ReportType | null> {
  if (typeof window === "undefined") return null;
  if (report) return report;
  // 等待初始化完成
  return await reportReady;
}
