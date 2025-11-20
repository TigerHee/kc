import access from '@/access';

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/welcome',
    name: '欢迎使用',
    icon: 'HomeOutlined',
    component: './Welcome',
    hideInMenu: true,
    // access: 'withoutLogin',
  },
  {
    path: '/login',
    name: '登录',
    layout: false,
    component: './login/index',
  },
  {
    name: '任务管理',
    icon: 'SnippetsOutlined',
    path: '/task',
    access: 'withLogin',
    routes: [
      {
        name: '常规任务',
        icon: 'SnippetsOutlined',
        path: '/task/list',
        component: './task/TaskList',
      },
      {
        name: '万能任务',
        icon: 'SnippetsOutlined',
        path: '/task/black-hole',
        component: './task/BlackHole',
      },
      {
        name: '任务详情',
        icon: 'SnippetsOutlined',
        path: '/task/detail/:id',
        component: './task/detail/[id]',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/compliance',
    name: '合规管理',
    icon: 'SafetyCertificateOutlined',
    access: 'withLogin',
    routes: [
      {
        name: '合规需求',
        icon: 'SafetyCertificateOutlined',
        path: '/compliance/demand',
        component: './compliance/ComplianceDemandList',
      },
      {
        name: '合规需求详情',
        icon: 'SafetyCertificateOutlined',
        hideInMenu: true,
        path: '/compliance/demand/detail/:id',
        component: './compliance/demand-details/[id]',
      },
      {
        name: '合规代码',
        icon: 'SafetyCertificateOutlined',
        path: '/compliance/atomic',
        component: './compliance/ComplianceAtomicList',
      },
    ],
  },
  {
    name: '告警统计',
    icon: 'WarningOutlined',
    path: '/alert',
    access: 'withLogin',
    routes: [
      {
        name: '告警列表',
        icon: 'WarningOutlined',
        path: '/alert/list',
        component: './alert/AlertList',
      },
      {
        name: '告警详情',
        icon: 'WarningOutlined',
        path: '/alert/detail',
        component: './alert/AlertDetail',
        hideInMenu: true,
      },
      {
        name: '告警分析',
        icon: 'WarningOutlined',
        path: '/alert/analyze',
        component: './alert/AlertAnalyze',
      },
      {
        name: '告警组管理',
        icon: 'WarningOutlined',
        path: '/alert/group',
        component: './alert/AlertGroup',
        access: 'canAdmin',
      },
    ],
  },
  // {
  //   name: '文档管理',
  //   icon: 'ReadOutlined',
  //   path: '/wiki',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       name: '必读文档管理',
  //       path: '/wiki/must-read',
  //       icon: 'smile',
  //       component: './wiki/MustReadWikiList',
  //       access: 'canAdmin',
  //     },
  //   ],
  // },
  {
    name: '项目概览',
    icon: 'ApartmentOutlined',
    path: '/project',
    access: 'withLogin',
    routes: [
      {
        path: '/project/route',
        name: '路由列表',
        icon: 'PullRequestOutlined',
        access: 'withLogin',
        component: './project/RouteList',
      },
      {
        name: '项目列表',
        icon: 'DesktopOutlined',
        path: '/project/list',
        component: './project/ProjectList',
        access: 'withLogin',
      },
      {
        name: '项目详情',
        icon: 'DesktopOutlined',
        path: '/project/detail/:name',
        component: './project/detail/[name]',
        hideInMenu: true,
        access: 'withLogin',
      },
      {
        name: '仓库配置',
        icon: 'CodepenOutlined',
        path: '/project/repo-list',
        component: './project/ProjectRepoList',
        access: 'canAdmin',
      },
      // {
      //   name: '项目总览',
      //   icon: 'smile',
      //   path: '/project/full-dashboard',
      //   component: './project/ProjectFullDashboard',
      //   access: 'canAdmin',
      // },
    ],
  },
  {
    name: '扫描报告',
    icon: 'OneToOneOutlined',
    path: '/report',
    access: 'withLogin',
    routes: [
      {
        name: '合规扫描报告',
        icon: 'FileProtectOutlined',
        path: '/report/compliance',
        component: './report/ComplianceReport',
      },
      {
        name: '合规扫描报告详情',
        icon: 'DashboardOutlined',
        path: '/report/compliance/detail/:id',
        component: './report/compliance-details/[id]',
        hideInMenu: true,
      },
      {
        name: 'Cookies报告',
        icon: 'FileTextOutlined',
        path: '/report/onetrust',
        component: './report/OnetrustReport',
      },
      {
        name: 'Safebrowsing报告',
        icon: 'FileProtectOutlined',
        path: '/report/safebrowsing',
        component: './report/SafebrowsingReport',
      },
      {
        name: 'Virustotal报告',
        icon: 'FileTextOutlined',
        path: '/report/virustotal',
        component: './report/VirustotalReport',
      },
      {
        name: '项目依赖报告',
        icon: 'FileSyncOutlined',
        path: '/report/package-js',
        component: './report/PackageJsReport',
      },
      {
        name: '路由加固报告',
        icon: 'FileSyncOutlined',
        path: '/report/jscrambler',
        component: './report/JscramblerReport',
      },
      {
        name: '离线配置报告',
        icon: 'FileSyncOutlined',
        path: '/report/offconfig',
        component: './report/OffConfigReport',
      },
    ],
  },
  {
    name: '调度任务',
    icon: 'HeatMapOutlined',
    path: '/job',
    access: 'withLogin',
    routes: [
      {
        name: '调度看板',
        icon: 'DashboardOutlined',
        path: '/job/dashboard',
        access: 'withLogin',
        component: './job/JobDashboard',
      },
      {
        name: '调度定义',
        icon: 'UngroupOutlined',
        path: '/job/define',
        access: 'withLogin',
        component: './job/JobDefine',
      },
      {
        name: '调度列表',
        icon: 'UnorderedListOutlined',
        path: '/job/list',
        access: 'canAdmin',
        component: './job/JobList',
      },
      {
        name: '调度日志',
        icon: 'TagsOutlined',
        path: '/job/log',
        access: 'withLogin',
        component: './job/JobLog',
      },
    ],
  },
  // {
  //   name: '工作流管理',
  //   icon: 'NodeExpandOutlined',
  //   path: '/workflow',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       name: '工作流列表',
  //       icon: 'smile',
  //       path: '/workflow/list',
  //       access: 'canAdmin',
  //       component: './workflow/WorkflowList',
  //     },
  //   ],
  // },
  {
    name: '工具集合',
    icon: 'ToolOutlined',
    path: 'tool',
    access: 'withLogin',
    routes: [
      {
        name: 'SourceMap解析',
        icon: 'CodeOutlined',
        path: '/tool/sourcemap',
        access: 'withLogin',
        component: './tool/SourceMap',
      },
      {
        name: 'Lottie 工具',
        icon: 'CodeOutlined',
        path: '/tool/lottie',
        access: 'withLogin',
        component: './tool/Lottie',
      },
    ],
  },
  {
    name: '系统管理',
    icon: 'UsergroupAddOutlined',
    path: '/auth',
    access: 'canAdmin',
    routes: [
      {
        name: '授权管理',
        icon: 'UsergroupAddOutlined',
        path: '/auth/apikey-list',
        access: 'canAdmin',
        component: './auth/ApikeyList',
      },
      {
        name: '用户管理',
        icon: 'UsergroupAddOutlined',
        path: '/auth/user-list',
        access: 'canAdmin',
        component: './auth/UserList',
      },
      {
        name: '告警管理',
        icon: 'WarningOutlined',
        path: '/auth/admin/alarm-list',
        access: 'canAdmin',
        component: './admin/AlarmList',
      },
      {
        name: 'PR拒绝记录',
        icon: 'ThunderboltOutlined',
        path: '/auth/admin/pr-reject-record-list',
        access: 'canAdmin',
        component: './auth/PrRejectRecordList',
      },
      {
        name: '用户wiki文档状态',
        icon: 'FileWordOutlined',
        path: '/auth/wiki-status/:userId',
        access: 'canAdmin',
        hideInMenu: true,
        component: './auth/UserWikiStatus/[userId]',
      },
      {
        name: '必读文档管理',
        path: '/auth/must-read',
        icon: 'FileWordOutlined',
        component: './wiki/MustReadWikiList',
        access: 'canAdmin',
      },
      {
        name: '工作流管理',
        icon: 'NodeExpandOutlined',
        path: '/auth/workflow',
        access: 'canAdmin',
        routes: [
          {
            name: '工作流列表',
            icon: 'NodeExpandOutlined',
            path: '/auth/workflow/list',
            access: 'canAdmin',
            component: './workflow/WorkflowList',
          },
        ],
      },
    ],
  },
  {
    name: '系统公告',
    icon: 'NotificationOutlined',
    path: '/announcement',
    access: 'canAdmin',
    routes: [
      {
        name: '更新公告',
        icon: 'NotificationOutlined',
        path: '/announcement/update',
        access: 'canAdmin',
        component: './announcement/FeatureUpdateList',
      },
      {
        name: '停机公告',
        icon: 'NotificationOutlined',
        path: '/announcement/breakdown',
        access: 'canAdmin',
        component: './announcement/SystemBreakdownList',
      },
    ],
  },
  {
    name: '个人中心',
    icon: 'UserOutlined',
    path: '/personal',
    access: 'withLogin',
    routes: [
      {
        name: '个人信息',
        icon: 'UserOutlined',
        path: '/personal/info',
        component: './personal/PersonalInfo',
      },
      {
        name: '消息通知',
        icon: 'NotificationOutlined',
        path: '/personal/notice',
        component: './personal/PersonalNotice',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
