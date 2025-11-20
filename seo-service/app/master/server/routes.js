/**
 * Owner: hanx.wei@kupotech.com
 */
const router = require('koa-router')();
const NORMAL_PROJECTS = new Set([
  'kucoin-main-web',
  'kucoin-seo-web',
  'public-web',
  'pool-x-web',
  'marketing-growth-web',
  'ucenter-web',
  'trade-public-web',
  'professional-web',
  'platform-operation-web',
  'cashback-referral-web',
  'payment-web',
  'seo-sitemap-web',
  'margin-web-3.0',
  'seo-learn-web',
  'customer-web',
  'kumex-pro',
  'brisk-web',
  'seo-price-web',
  'news-web',
  'seo-cms-web',
]);
const CHILDPROCESS_TASK_PROJECTS = new Set(['trade-web']);
const { THEME_DEFAULT, SUPPORT_THEMES } = require('@scripts/themes');

// health check
router.get('/', ctx => {
  ctx.body = 'ok';
});

router.post('/run', ctx => {
  const { project: projectName, langs } = ctx.request.body;
  let project = projectName;

  // 合约项目名转换
  if (projectName === 'kumex-website') {
    project = 'kumex-pro';
  }

  if (
    !NORMAL_PROJECTS.has(project) &&
    !CHILDPROCESS_TASK_PROJECTS.has(project)
  ) {
    ctx.body = {
      code: 200,
      success: false,
      message: `Invalid project name ${project}`,
    };
  } else {
    if (langs && !Array.isArray(langs)) {
      ctx.body = {
        code: 200,
        success: false,
        message: '语言参数请传入一个数组',
      };
      return;
    }
    process.nextTick(() => {
      if (project === 'trade-web') {
        ctx.app.server.emit('run', {
          type: 'CHILDPROCESS_TASK',
          params: { project, langs },
        });
      } else {
        ctx.app.server.emit('run', {
          type: 'ALL',
          params: { project, langs },
        });
      }
    });
    ctx.body = {
      code: 200,
      success: true,
      message: `Run ${project} SSG tasks for all`,
    };
  }
});

router.post('/run_routes', ctx => {
  const {
    project: projectName,
    langs,
    routes: webRoutes = [],
    appRoutes = [],
    withLangRoutesMap = null,
    withLangAppRoutesMap = null,
    routeSets,
    themes = [],
    keepDistFile,
  } = ctx.request.body;

  let project = projectName;

  // 合约项目名转换
  if (projectName === 'kumex-website') {
    project = 'kumex-pro';
  }

  if (themes.length === 0) {
    themes.push(THEME_DEFAULT);
  }

  // trade-web 用独立子进程，暂时不再提供 worker run routes 的支持
  if (CHILDPROCESS_TASK_PROJECTS.has(project)) {
    ctx.body = {
      code: 200,
      success: false,
      message: `run_routes is not supported with ${project}`,
    };
    return;
  }
  if (!NORMAL_PROJECTS.has(project)) {
    ctx.body = {
      code: 200,
      success: false,
      message: `Invalid project name: ${project}`,
    };
    return;
  }
  if (langs && !Array.isArray(langs)) {
    ctx.body = {
      code: 200,
      success: false,
      message: '语言参数请传入一个数组',
    };
    return;
  }
  for (const theme of themes) {
    if (!SUPPORT_THEMES.includes(theme)) {
      ctx.body = {
        code: 200,
        success: false,
        message: `Invalid theme: ${theme}`,
      };
      return;
    }
  }

  // 根据主题和 app 构造 routes 对象
  const routesObj =
    webRoutes.length !== 0 || appRoutes.length !== 0 ? {} : null;
  const routesWithLangMapObj =
    withLangRoutesMap !== null || withLangAppRoutesMap !== null ? {} : null;
  for (const theme of themes) {
    if (routesObj) {
      routesObj[theme] = {
        webRoutes,
        appRoutes,
      };
    }
    if (routesWithLangMapObj) {
      routesWithLangMapObj[theme] = {
        withLangRoutesMap,
        withLangAppRoutesMap,
      };
    }
  }
  process.nextTick(() => {
    ctx.app.server.emit('run', {
      type: 'PARTIAL',
      params: {
        project,
        langs,
        routes: routesObj,
        routesWithLangMap: routesWithLangMapObj,
        routeSets,
        keepDistFile,
      },
    });
  });
  ctx.body = {
    code: 200,
    success: true,
    message: `Run ${project} SSG tasks for routes`,
  };
});

// 清理
router.post('/clear_projects', ctx => {
  const { projects } = ctx.request.body;
  for (const projectName of projects) {
    let project = projectName;

    // 合约项目名转换
    if (projectName === 'kumex-website') {
      project = 'kumex-pro';
    }

    if (
      !NORMAL_PROJECTS.has(project) &&
      !CHILDPROCESS_TASK_PROJECTS.has(project)
    ) {
      ctx.body = {
        code: 200,
        success: false,
        message: `Invalid project name ${project}`,
      };
      return;
    }
  }
  process.nextTick(() => {
    ctx.app.server.emit('run', {
      type: 'CLEAR_PROJECTS',
      params: {
        projects,
      },
    });
  });
  ctx.body = {
    code: 200,
    success: true,
    message: 'Clear ssg for projects',
  };
});

// 全量触发
router.post('/run_all_projects', ctx => {
  const { langs } = ctx.request.body;
  if (langs && !Array.isArray(langs)) {
    ctx.body = {
      code: 200,
      success: false,
      message: '语言参数请传入一个数组',
    };
    return;
  }
  const projects = Array.from(NORMAL_PROJECTS);
  const project = Array.from(CHILDPROCESS_TASK_PROJECTS)[0];
  process.nextTick(() => {
    ctx.app.server.emit('run', {
      type: 'ALL_PROJECTS',
      params: { langs, projects },
    });
    ctx.app.server.emit('run', {
      type: 'CHILDPROCESS_TASK',
      params: { project, langs },
    });
  });
  ctx.body = {
    code: 200,
    success: true,
    message: 'Run all projects',
  };
});

module.exports = router.routes();
