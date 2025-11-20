export interface ReportCheckResultData {
  projectKey: string;
  repoName: string;
  branchName: string;
  commitId: string;
  createUser: string; // build user
  scanState: string; // scan state  扫描状态，1：等待扫描，2: 扫描中，3:扫描完成，4: 扫描异常
  passState: string; // pass state  pass状态，1：unknown，2: pass，3:no pass
}
