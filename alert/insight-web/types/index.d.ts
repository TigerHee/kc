export namespace API {
  export type Response<T = any> = {
    code: number;
    data: T;
    message: string;
    success: boolean;
    time: string;
  };

  export type ListDataResponse<T = any> = {
    list: T[];
    total: number;
  };

  export type getUserInfo = {
    _id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    terminalPassword: string;
    role: 'admin' | 'user' | 'super_admin';
  };

  export type getJobList = {
    list: JobItem[];
    total: number;
  };

  export type JobItem = {
    _id: string;
    name: string;
    type: string;
    repeatInterval: string;
    progress: number;
    data: Record<string, any>;
    priority: number;
    failReason: string;
    failCount: number;
    lastRunAt: string;
    lastFinishedAt: string;
    nextRunAt: string;
  };

  export type getJobLog = {
    list: LogItem[];
    total: number;
  };

  export type LogItem = {
    _id: string;
    jobId: string | JobItem;
    data: Record<string, any>;
    status: string;
    error: string;
    createdAt: string;
  };

  export type getJobDefine = DefineItem[];

  export type DefineItem = {
    name: string;
    desc: string;
    options?: Record<string, any>;
    meta: {
      fn: string;
      filePath: string;
      concurrency: 5;
      lockLimit: 5;
      priority: 5;
      lockLifetime: 10000;
    };
  };

  export type getAgendaDashboardInfo = {
    totalQueueSizeDB: number;
    internal: {
      localQueueProcessing: number;
      localLockLimitReached: number;
    };
    jobStatus: Record<string, any>;
    config: {
      totalLockLimit: number;
      maxConcurrency: number;
      processEvery: number;
    };
    queuedJobs: number;
    runningJobs: number;
    lockedJobs: number;
    jobsToLock: number;
    isLockingOnTheFly: boolean;
  };

  export type getJobListByJobId = LogItem[];

  export type getApiKeyList = ApiKeysItem[];

  export type ApiKeysItem = {
    remark: string;
    secret: string;
    duration: number;
    status: 0 | 1;
    createdAt: string;
    owner: UserItem;
  };

  export type createApiKey = {
    remark: string;
    duration: number;
    data: {
      role: string;
      name: string;
      remark: string;
    };
  };

  export type getOneTrustReport = {
    list: OneTrustReportItem[];
    total: number;
  };

  export type getSafebrowsingReport = {
    list: SafebrowsingItem[];
    total: number;
  };

  export type getVirustotalReport = {
    list: VirustotalItem[];
    total: number;
  };

  export type getPackageJsReport = {
    list: PackageJsReportItem[];
    total: number;
  };

  export type PackageJsReportItem = {
    _id: string;
    repo: string;
    branch: string;
    slug: string;
    webChecker: boolean;
    webTest: boolean;
    appOffline: boolean;
    deps: PackageJsReportItemDeps[];
  };

  export type PackageJsReportItemDeps = {
    name: string;
    version: string;
    isLock: boolean;
    type: 'dependencies' | 'devDependencies' | 'peerDependencies';
  };

  export type OneTrustReportItem = {
    _id: string;
    domain: string;
    data: string[];
    createdAt: string;
    executor: string;
  };

  /**
   * 威胁类型的枚举值
   */
  export enum ThreatType {
    THREAT_TYPE_UNSPECIFIED = 'THREAT_TYPE_UNSPECIFIED', // 未知类型
    MALWARE = 'MALWARE', // 恶意软件
    SOCIAL_ENGINEERING = 'SOCIAL_ENGINEERING', // 社会工程学
    UNWANTED_SOFTWARE = 'UNWANTED_SOFTWARE', // 垃圾软件
    POTENTIALLY_HARMFUL_APPLICATION = 'POTENTIALLY_HARMFUL_APPLICATION', // 可能有害应用
  }

  /**
   * 平台类型的枚举值
   */
  export enum PlatformType {
    PLATFORM_TYPE_UNSPECIFIED = 'PLATFORM_TYPE_UNSPECIFIED', // 未知平台
    WINDOWS = 'WINDOWS', // 对 Windows 构成威胁
    LINUX = 'LINUX', // 对 Linux 构成威胁
    ANDROID = 'ANDROID', // 对 Android 构成威胁
    OSX = 'OSX', // 对 macOS (OS X) 构成威胁
    IOS = 'IOS', // 对 iOS 构成威胁
    ANY_PLATFORM = 'ANY_PLATFORM', // 对至少一个指定平台构成威胁
    ALL_PLATFORMS = 'ALL_PLATFORMS', // 对所有定义的平台构成威胁
    CHROME = 'CHROME', // 对 Chrome 构成威胁
  }

  export type SafebrowsingItem = {
    _id: string;
    threatType: ThreatType;
    platformType: PlatformType;
    threat: {
      hash: string;
      url: string;
      digest: string;
    };
    threatEntryMetadata: {
      key: string;
      value: string;
    }[];
    threatEntryType: string;
    cacheDuration: string; // 缓存持续时间
    createdAt: string;
    executor: string;
  };

  export type VirustotalItem = {
    _id: string;
    id: string;
    attributes: object;
    links: {
      self: string;
    };
    threatEntryType: string;
    createdAt: string;
    executor: string;
  };

  export type getOffConfigReport = {
    list: OffConfigReportItem[];
    total: number;
  };

  export type OffConfigReportItem = {
    _id: string;
    repo: string;
    branch: string;
    slug: string;
    createdAt: string;
    projectDistDirName: 'dist';
    maximumFileSizeToCacheInBytes: number;
    globPatterns: string[];
    onlyFullPkg: boolean;
    multiTenantSite: {
      [key: string]: {
        name: string;
        sourceName: string;
        appVersion: string;
      };
    };
  };

  export type getJscramblerReport = {
    list: JscramblerReportItem[];
    total: number;
  };

  export type JscramblerReportItem = {
    _id: string;
    repo: string;
    branch: string;
    slug: string;
    createdAt: string;
    config: string[];
  };

  export type getUserList = {
    list: UserItem[];
    total: number;
  };

  export type UserItem = {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    prAuth: {
      status: boolean;
      rejectReason: string;
    };
    readStatus: 'success' | 'error' | 'warning';
  };

  export type getReposList = {
    list: ReposItem[];
    total: number;
  };

  export type ReposItem = {
    _id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    group: string;
    description: string;
  };

  export type getWorkflowList = {
    list: WorkflowItem[];
    total: number;
  };

  export type WorkflowItem = {
    _id: string;
    name: string;
    desc: string;
    node: WorkflowItemNode[];
    createdBy: UserItem;
    createdAt: string;
    updatedAt: string;
    scope: string;
    relateProjects: number;
  };

  export type WorkflowItemNode = {
    _id?: string;
    name: string;
    desc: string;
    status?: boolean;
    job?: JobItem;
  };

  export type getOncallList = OncallItem[];

  export type OncallItem = {
    _id: string;
    business: string;
    desc: string;
    groupUsers: UserItem[];
    currentUser: UserItem;
    updatedAt: string;
    createdAt: string;
    isActive: boolean;
    relatedRepos: ReposItem[];
  };

  export type getTaskList = {
    list: TaskItem[];
    total: number;
  };

  export type WikiType = {
    pageId: number;
    url: string;
    title: string;
    status: string;
    errors: Array<{ title: string; content: string | string[] }>;
    needH5Audit?: boolean;
    h5AuditStatus?: boolean;
  };
  export type TaskItem = {
    wikiCheckerVersion: number;
    _id: string;
    taskName: string;
    taskId: string;
    wiki: WikiType;
    // workflowRecord: WorkflowItem[];
    // workflow: WorkflowItem;
    user: UserItem;
    createdAt: string;
    updatedAt: string;
    status: boolean;
    involveRepos: ReposItem[];
    involveUsers: UserItem[];
  };

  export type getProjectsList = {
    list: ProjectsItem[];
    total: number;
  };
  export type ProjectsItem = {
    _id: string;
    name: string;
    accessibleLink: string;
    owner: UserItem;
    repos: ReposItem;
    isDeleted: boolean;
    updatedAt: string;
    createdAt: string;
    status: boolean;
    workflowSchedule: ProjectWorkflowScheduleItem[];
    metaRoutes: {
      status: boolean;
      total: number;
      routes: string[];
      updatedAt: string;
    };
    metaDeps: {
      status: boolean;
      total: number;
      unLockTotal: number;
      lockTotal: number;
      updatedAt: string;
    };
    metaOfflineAppV3: {
      status: boolean;
      maximumFileSizeToCacheInBytes: number;
      updatedAt: string;
    };
    metaJscrambler: {
      status: boolean;
      updatedAt: string;
    };
    metaWebChecker: {
      status: boolean;
      updatedAt: string;
    };
    metaWebTest: {
      status: boolean;
      updatedAt: string;
    };
    metaTenant: {
      status: boolean;
      tenant: string[];
      updatedAt: string;
    };
    metaUnitTests: {
      status: boolean;
      updatedAt: string;
    };
    // workflow: WorkflowItem[];
    // workflowRecord: WorkflowItem[];
  };

  export interface ProjectWorkflowScheduleItem {
    _id: string;
    project: string;
    interval: string;
    job: string;
    workflowRecord: ProjectWorkflowRecordItem[];
    workflow: WorkflowItem;
    interval: string;
    createdAt: string;
  }

  export interface ProjectWorkflowRecordItem {
    _id: string;
    project: string;
    name: string;
    currentStep: number;
    nodes: ProjectWorkflowRecordNodeItem[];
    status: boolean;
    workflow: WorkflowItem;
    createdAt: string;
  }

  export interface ProjectWorkflowRecordNodeItem extends WorkflowItemNode {
    _id: string;
    name: string;
    desc: string;
    status: boolean;
    job: string;
  }

  export interface ProjectsItemDetail extends ProjectsItem {
    userRelatedProjects: {
      _id: string;
      name: string;
      accessibleLink: string;
      updatedAt: string;
    }[];
  }

  export interface ProjectDetailDepsInfo {
    report: PackageJsReportItem;
    meta: {
      status: boolean;
      total: number;
      unLockTotal: number;
      lockTotal: number;
      updatedAt: string;
    };
  }

  export interface ProjectDetailOfflineInfo {
    report: OffConfigReportItem;
    meta: {
      status: boolean;
      maximumFileSizeToCacheInBytes: number;
      updatedAt: string;
    };
  }

  export interface ProjectDetailJscramblerInfo {
    report: JscramblerReportItem;
    meta: {
      status: boolean;
      updatedAt: string;
    };
  }

  export type getRouteList = {
    list: RouteItem[];
    total: number;
  };

  export type RouteItem = {
    _id: string;
    user: UserItem;
    project: ProjectsItem;
    path: string;
    title: string;
    accessibleLink: string;
    tenant: string[];
    isNeedLogin: boolean;
    competitor: string;
    isIgnore: boolean;
  };

  export type getProjectGatherRoute = {
    list: ProjectGatherRouteItem[];
    total: number;
  };

  export type ProjectGatherRouteItem = {
    _id: string;
    name: string;
    routesCount: number;
    routes: RouteItem[];
    owner: UserItem;
    createdAt: string;
    updatedAt: string;
    // routes: RouteItem[];
  };

  export type BlackHoleInfo = {
    taskId: string;
    lastCommitAt: string;
    repos: ReposItem[];
    users: UserItem[];
  };

  export type getBlackHoleCommitList = {
    list: BlackHoleCommitItem[];
    total: number;
  };

  export type BlackHoleCommitItem = {
    _id: string;
    author: UserItem;
    branch: string;
    commitId: string;
    commitUrl: string;
    slug: string;
    taskId: string;
    createdAt: string;
    readStatus: boolean;
  };

  export type getAlarmList = {
    list: AlarmItem[];
    total: number;
  };

  export type AlarmItem = {
    _id: string;
    author: UserItem;
    branch: string;
    commitId: string;
    commitUrl: string;
    createdAt: string;
    eventKey: string;
    message: string;
    slug: string;
    warnText: string;
    alarmType: string;
    readStatus: boolean;
    authorOriginal: string;
  };

  export type getSystemMessageList = {
    list: SystemMessageItem[];
    total: number;
  };

  export type SystemMessageItem = {
    _id: string;
    title: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    readStatus: boolean;
  };

  export type parserSourceMapData = {
    originalPosition: {
      source: string;
      line: number;
      column: number;
    };
    originalCode: {
      lineNumber: number;
      code: string;
    }[];
  };

  export type PrRejectRecordItem = {
    _id: string;
    user: UserItem;
    reason: string;
    link: string;
    createdAt: string;
  };

  export type getPrRejectRecordList = {
    list: PrRejectRecordItem[];
    total: number;
  };

  export type getMustReadWikisList = {
    list: MustReadWikisItem[];
    total: number;
  };

  export type WikiViewersItem = {
    userId: string;
    displayName: string;
    views: number;
    lastViewedAt: string;
    lastVersionViewedNumber: number;
    lastVersionViewedUrl: string;
  };

  export type MustReadWikisItem = {
    _id: string;
    title: string;
    pageId: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    viewers: WikiViewersItem[];
  };

  export type MustReadWikisUserStatusItem = {
    _id: string;
    title: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    lastVersion: number;
    viewers?: WikiViewersItem;
    readStatus?: 'success' | 'error' | 'warning';
  };

  export type UserActionLogItem = {
    _id: string;
    user: UserItem;
    action: string;
    prev: string;
    current: string;
    createdAt: string;
    actionBy: UserItem;
  };

  type teamsHrefData = {
    name: string;
    url: string;
    _id: string;
  };
  type AlertOperator = {
    email: string;
    time: number;
    status: string;
    remark: string;
    _id: string;
  };
  export type AlertItem = {
    _id: string;
    alarmGroup: string;
    status: string;
    appKey: string;
    message: string;
    alertMsg: string;
    teamsHrefData: teamsHrefData[];
    operator: AlertOperator[];
    viewData: AlertOperator;
    finishData: AlertOperator;
    teamsSendList: string[];
    createTime: number;
    firstDirector: string;
  };
  export type GetAlertList = {
    list: AlertItem[];
    pagination: { total: number };
  };
  export type AlertStatus = {
    label: string;
    value: string;
    isCanFinish: boolean;
  };
  export type AlertStatusList = AlertStatus[];
  export type AlertAlarmGroupList = string[];
  export type getFeatureAnnouncementList = {
    list: FeatureAnnouncementItem[];
    total: number;
  };
  export type AlertAnalyzeItem = {
    alarmGroup: string;
    total: number;
    finishTotal: number;
    viewTotal: number;
    validTotal: number;
    statusCounts: Record<string, number>;
    finishTimeList: number[];
    viewTimeList: number[];
    workViewTimeList: number[];
  };
  export type GetAlertAnalyzeList = {
    list: AlertAnalyzeItem[];
  };
  export type AlertGroupItem = {
    _id: string;
    name: string;
  };
  export type GetAlertGroupList = AlertGroupItem[];

  export type FeatureAnnouncementItem = {
    _id: string;
    manualsUrl: string;
    featureUrl: string;
    feature: string;
    createdAt: string;
    user: UserItem;
  };

  export type getSystemBreakdownAnnouncementList = {
    list: SystemBreakdownAnnouncementItem[];
    total: number;
  };

  export type SystemBreakdownAnnouncementItem = {
    _id: string;
    startAt: string;
    finishAt: string;
    createdAt: string;
    content: string;
    user: UserItem;
  };
}
