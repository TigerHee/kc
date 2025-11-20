/**
 * Owner: hanx.wei@kupotech.com
 */
const cluster = require('cluster');
const cp = require('child_process');
const path = require('path');
const EventEmitter = require('events');
const WorkerManager = require('./worker-manager');
const ProjectManager = require('./project-manager');
const TaskManager = require('./task-manager');
const Messenger = require('./messenger');
const Server = require('./server');
const Scheduler = require('./schedule');
const FileManager = require('./file-manager');
const { forkAll, forkOne, forkRouteTaskWorker } = require('./fork');
const logger = require('@app/master/logger');
const robot = require('@app/master/robot');
const getCNRouteSetName = require('@utils/get-cn-route-set-name');
const { execSync } = require('@utils/exec');
const wait = require('@utils/wait');
const sliceArray = require('@utils/slice-array');
const { NGINX_CACHE_SECONDS_BUFFER } = require('@scripts/constants');
// const { callServerlessCancel } = require('@app/master/call-serverless');
const terminate = require('terminate');

process.on('uncaughtException', err => {
  console.log(err);
  logger.error('master process exit uncaughtException', err);
  robot.error(
    `master process exit uncaughtException: ${
      err.msg || err.message || err.type
    }`
  );
});
process.on('unhandledRejection', err => {
  console.log(err);
  logger.error('master process exit unhandledRejection', err);
  robot.error(
    `master process exit unhandledRejection: ${
      err.msg || err.message || err.type
    }`
  );
});

class Master extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.workerManager = new WorkerManager(this.options.config);
    this.projectManager = new ProjectManager();
    this.taskManager = new TaskManager();
    this.fileManager = new FileManager({
      allLangs: this.options.config.langs.newLangs,
      globalSupportThemes: this.options.config.globalSupportThemes,
      rootDistConfigs: this.options.config.rootDistConfigs,
      projectConfigs: this.options.config.projectConfigs,
    });
    this.messenger = new Messenger(this);
    this.server = new Server(this);
    this.scheduler = new Scheduler(this);
    this.startWorkerCount = 0;
    this.allWorkerStarted = false;
    this.workerHeartBeats = [];

    this.server.on('run', data => {
      switch (data.type) {
        case 'ALL':
          this.run(data.params);
          break;
        case 'PARTIAL':
          this.runRoutes(data.params);
          break;
        case 'CHILDPROCESS_TASK':
          this.runChildProsessTask(data.params);
          break;
        case 'ALL_PROJECTS':
          this.runAllProjects(data.params);
          break;
        case 'CLEAR_PROJECTS':
          this.clearProjects(data.params);
          break;
        default:
          break;
      }
    });

    this.on('worker-started', this.onWorkerStart.bind(this));
    this.on('worker-exit', this.onWorkerExit.bind(this));
    this.once('all-worker-started', () => {
      this.server.start(this.options.config.port);
      this.checkWorkerStatus();
    });

    this.on('routes-gen', this.onRoutesGen.bind(this));
    this.on('pages-gen', this.onPagesGen.bind(this));
    this.on('worker-handler-stopped', this.onWorkingHandlerStopped.bind(this));
    this.on('worker-heart-beat', this.onWorkerHeartBeat.bind(this));
  }

  async runChildProsessTask(params) {
    const { project: projectName, langs: paramLangs } = params;
    const project = this.projectManager.getProject(projectName);
    const projectConfig = this.options.config.projectConfigs[projectName];
    const langs = this.resolveLangs(projectConfig, paramLangs);
    const projectTaskSet = this.projectManager.createProjectTaskSet({
      type: 'ALL',
      langs,
      routeSets: projectConfig.routeSets,
    });
    // 删除文件, 先删除软链
    logger.info(`开始清理 ${projectName} 项目旧版文件`);
    robot.info(`开始清理 ${projectName} 项目旧版文件`);
    execSync(
      `rm -rf ${projectConfig.distConfig.projectDistPath} ${projectConfig.distConfig.projectMobileDistPath}`
    );

    if (project) {
      robot.info(`终止运行中 ${projectName} ALL 任务`);
      logger.info(
        `终止运行中 ${projectName} ALL 任务, id: ${project.current.id}`
      );
      if (project.current.process) {
        try {
          await terminate(project.current.process.pid);
          logger.info(`终止 ${projectName} 执行进程`);
          robot.info(`终止 ${projectName} 执行进程`);
        } catch (err) {
          logger.error(`${projectName} 执行进程终止错误`, err);
          robot.error(`${projectName} 执行进程终止错误`, err);
        }
      }
      project.current = projectTaskSet;
      this.startChildProcessTask(projectConfig, projectTaskSet);
    } else {
      this.projectManager.setProject(projectConfig.projectName, projectTaskSet);
      this.startChildProcessTask(projectConfig, projectTaskSet);
    }
  }

  async startChildProcessTask(projectConfig, projectTaskSet) {
    // 删除旧文件
    this.fileManager.ensureProjectDirForAll(projectConfig.projectName);
    const project = this.projectManager.getProject(projectConfig.projectName);
    // 等待 nginx 缓存更新
    if (!this.options.config.isDev) {
      await wait(NGINX_CACHE_SECONDS_BUFFER);
    }
    // 比对 id
    if (project.current.id !== projectTaskSet.id) {
      return;
    }
    // 生成
    robot.info(`开始执行 ${projectConfig.projectName} ALL 任务`);
    logger.info(
      `开始执行 ${projectConfig.projectName} ALL 任务, id: ${project.current.id}`
    );
    project.current.process = cp.fork(
      path.resolve(__dirname, '../projects/trade-web/gen-script.js'),
      projectTaskSet.langs
    );

    const closeHandler = (code, signal) => {
      project.current.process = null;
      if (code === 1) {
        logger.info(`生成 ${projectConfig.projectName} 发生错误`);
        robot.info(`生成 ${projectConfig.projectName} 发生错误`);
        this.projectManager.deleteProject(projectConfig.projectName);
        return;
      }
      // 子进程正常退出
      if (code === 0 && signal === null) {
        logger.info(`${projectConfig.projectName} 生成完成`);
        robot.info(`${projectConfig.projectName} 生成完成`);
        this.projectManager.deleteProject(projectConfig.projectName);
        this.fileManager.ensureProjectDistDirLink(projectConfig);
      }
    };

    project.current.process.on('close', closeHandler);

    project.current.process.on('message', msg => {
      try {
        const { type, message } = msg;

        switch (type) {
          case 'info':
            logger.info(message);
            break;
          case 'warn':
            logger.warn(message);
            break;
          case 'error':
            logger.error(message);
            break;
          case 'debug':
            logger.debug(message);
            break;
          default:
            break;
        }
      } catch (error) {
        logger.error(`打印trade-web日志失败: ${JSON.stringify(msg)}`);
        logger.error(error);
      }
    });
  }

  checkWorkerStatus() {
    // 10 分钟检测一轮 worker 状态
    setTimeout(() => {
      if (this.workerHeartBeats.length !== 0) {
        for (let i = 0; i < this.workerHeartBeats.length; i++) {
          if (this.workerHeartBeats[i] === false) {
            // 心跳检测失败的 worker
            logger.warn(`worker heart beat failed: worker ${i + 1}`);
          }
        }
        this.workerHeartBeats.fill(false);
      }
      this.workerManager.workers.forEach(worker => {
        this.messenger.send(worker.instance, {
          event: 'heart-beat',
        });
      });
      this.checkWorkerStatus();
    }, 10 * 60 * 1000);
  }

  onWorkerHeartBeat(event) {
    const i = Number(event.fromWorker);
    this.workerHeartBeats[i - 1] = true;
  }

  onWorkerStart(event) {
    const { fromWorker: index, instance } = event;
    this.workerManager.initWorker(index, instance);
    if (this.allWorkerStarted) {
      // is refork
      logger.info(`worker ${index} restarted`);
      return;
    }
    logger.info(`worker ${index} started`);
    this.startWorkerCount++;
    if (this.startWorkerCount < this.options.config.workerCount + 1) {
      return;
    }
    this.allWorkerStarted = true;
    this.emit('all-worker-started');
    logger.info(`${this.options.config.workerCount} all workers started`);
  }

  onWorkerExit(event) {
    event.instance.removeAllListeners();
    this.workerManager.deleteWorker(event.fromWorker);
  }

  resolveLangs(projectConfig, paramLangs = []) {
    if (paramLangs && paramLangs.length !== 0) return paramLangs;
    const configLangs = this.options.config.langs.newLangs;
    const supportLangs = projectConfig.supportLangs;
    let _supportLangs = supportLangs.length !== 0 ? supportLangs : configLangs;
    // 测试环境减少构建数量
    if (this.options.config.IS_TEST_ENV) {
      _supportLangs = this.options.config.testLangs;
    }
    return _supportLangs;
  }

  start() {
    this.fileManager.initDirs();
    const options = {
      master: this,
      count: this.options.config.workerCount,
    };
    forkAll(options);
    this.messenger.listen();
    this.scheduler.register(this.options.config.isTest);
    cluster.on('exit', worker => {
      logger.info(`worker ${worker.__index} 退出`);
      if (worker.__index !== '0') {
        forkOne({ index: worker.__index, ...options });
      } else {
        forkRouteTaskWorker();
      }
    });
  }

  stopProjectWorkers(projectName) {
    const workers = this.workerManager.getWorkingProjectWorkers(projectName);
    if (workers.length !== 0) {
      workers.forEach(worker => {
        this.messenger.send(worker.instance, {
          event: 'stop',
          payload: { projectName },
        });
      });
    } else {
      // 该项目没有运行中的 worker，还在等待执行中，处理完成
      this.handleProjectWorkersStopped(projectName);
    }
  }

  onWorkingHandlerStopped(event) {
    logger.debug(`worker ${event.fromWorker} stopped`);
    const projectName = event.payload.projectConfig.projectName;
    const currentWorker = this.workerManager.getWorker(event.fromWorker);
    // worker stop status reset
    this.messenger.send(currentWorker.instance, {
      event: 'reset-stop-status',
      payload: { projectName },
    });
    this.workerManager.setWorkerFree(currentWorker);
    const workers = this.workerManager.getWorkingProjectWorkers(projectName);
    logger.debug(`stop left working worker: ${workers.length}`);
    if (workers.length === 0) {
      this.handleProjectWorkersStopped(projectName);
    }
  }

  handleProjectWorkersStopped(projectName) {
    const project = this.projectManager.getProject(projectName);
    logger.debug(`project pending taskSets: ${project.pending.len()}`);
    logger.debug(
      `project taskIdSet cleared: ${project.current.taskIdSet.size}`
    );
    logger.info(
      `${projectName} 所有 worker 终止任务，等待执行新任务集数量：${project.pending.len()}`
    );
    const projectTaskSet = project.pending.pop();
    project.stopping = false;
    if (projectTaskSet) {
      const projectConfig = this.options.config.projectConfigs[projectName];
      project.current = projectTaskSet;
      this.startAllWork(projectConfig, projectTaskSet);
    }
  }

  async runAllProjects(params) {
    logger.info('触发全量任务');
    robot.info('触发全量任务，删除项目软链入口，终于运行中任务');
    const { projects, langs: paramLangs } = params;
    for (const projectName of projects) {
      const projectConfig = this.options.config.projectConfigs[projectName];
      for (const theme in projectConfig.distConfig) {
        const projectThemeDistConfig = projectConfig.distConfig[theme];
        execSync(
          `rm -rf ${projectThemeDistConfig.projectDistPath} ${projectThemeDistConfig.projectMobileDistPath} ${projectThemeDistConfig.projectAppDistPath}`
        );
      }
      // 清理所有运行中的项目
      const project = this.projectManager.getProject(projectName);
      const langs = this.resolveLangs(projectConfig, paramLangs);
      const projectTaskSet = this.projectManager.createProjectTaskSet({
        type: 'ALL',
        langs,
        routeSets: projectConfig.routeSets,
      });
      if (project) {
        logger.info(
          `终止运行中 ${projectName} ALL 任务, id: ${project.current.id}`
        );
        this.taskManager.removeRouteTaskOfProject(projectName);
        this.taskManager.removeTasksOfProject(projectName);
        project.pending.empty();
        project.current.taskIdSet.clear();
        project.pending.push(projectTaskSet);
        // const useServerless = this.options.config.USE_SERVERLESS;
        // if (
        //   useServerless &&
        //   this.options.config.SERVERLESS_PROJECTS.includes(projectName)
        // ) {
        //   logger.debug('call serverless cancel');
        //   await callServerlessCancel(projectName);
        // }
        if (!project.stopping) {
          project.stopping = true;
          this.stopProjectWorkers(projectName);
        }
      } else {
        this.projectManager.setProject(
          projectConfig.projectName,
          projectTaskSet
        );
        this.startAllWork(projectConfig, projectTaskSet);
      }
    }
  }

  async run(params) {
    const { project: projectName, langs: paramLangs } = params;
    logger.info(`触发 ${projectName} ALL 任务`);
    const projectConfig = this.options.config.projectConfigs[projectName];
    // 先删除软链
    robot.info(`开始清理 ${projectName} 项目软链入口`);
    for (const theme in projectConfig.distConfig) {
      const projectThemeDistConfig = projectConfig.distConfig[theme];
      execSync(
        `rm -rf ${projectThemeDistConfig.projectDistPath} ${projectThemeDistConfig.projectMobileDistPath} ${projectThemeDistConfig.projectAppDistPath}`
      );
    }
    // serverless 的工程，触发时取消之前触发的
    // const useServerless = this.options.config.USE_SERVERLESS;
    // if (
    //   useServerless &&
    //   this.options.config.SERVERLESS_PROJECTS.includes(projectName)
    // ) {
    //   logger.debug('call serverless cancel');
    //   await callServerlessCancel(projectName);
    // }
    const project = this.projectManager.getProject(projectName);
    const langs = this.resolveLangs(projectConfig, paramLangs);
    const projectTaskSet = this.projectManager.createProjectTaskSet({
      type: 'ALL',
      langs,
      routeSets: projectConfig.routeSets,
    });
    // 运行中项目检查
    if (project) {
      robot.info(`终止运行中 ${projectName} ALL 任务`);
      logger.info(
        `终止运行中 ${projectName} ALL 任务, id: ${project.current.id}`
      );
      this.taskManager.removeRouteTaskOfProject(projectName);
      this.taskManager.removeTasksOfProject(projectName);
      project.pending.empty();
      project.current.taskIdSet.clear();
      project.pending.push(projectTaskSet);
      if (!project.stopping) {
        project.stopping = true;
        this.stopProjectWorkers(projectName);
      }
    } else {
      this.projectManager.setProject(projectConfig.projectName, projectTaskSet);
      this.startAllWork(projectConfig, projectTaskSet);
    }
  }

  async runRoutes(params) {
    const {
      project: projectName,
      langs: paramLangs,
      routes = null,
      routesWithLangMap = null,
      routeSets = [],
      keepDistFile = false,
      insertCurrentProject = false,
    } = params;
    logger.info(`触发 ${projectName} PARTIAL 任务`);
    const projectConfig = this.options.config.projectConfigs[projectName];
    // 运行中项目检查
    const project = this.projectManager.getProject(projectName);
    const langs = this.resolveLangs(projectConfig, paramLangs);
    const projectTaskSet = this.projectManager.createProjectTaskSet({
      type: 'PARTIAL',
      langs,
      routes,
      routesWithLangMap,
      routeSets,
      keepDistFile,
    });
    if (project) {
      // 可在进行中的项目插入任务队列
      if (
        insertCurrentProject &&
        routes !== null &&
        routesWithLangMap === null &&
        routeSets.length === 0
      ) {
        this.startRoutesWorkCurrently(
          projectConfig,
          projectTaskSet,
          project.current
        );
      } else {
        robot.info(`${projectName} 任务运行中，进入 pending 队列`);
        logger.info(`${projectName} 任务运行中，进入 pending 队列`);
        project.pending.push(projectTaskSet);
      }
    } else {
      this.projectManager.setProject(projectConfig.projectName, projectTaskSet);
      this.startRoutesWork(projectConfig, projectTaskSet);
    }
  }

  async startAllWork(projectConfig, projectTaskSet) {
    this.fileManager.ensureProjectDirForAll(projectConfig.projectName);
    const project = this.projectManager.getProject(projectConfig.projectName);
    // 等待 nginx 缓存更新
    if (!this.options.config.isDev) {
      await wait(NGINX_CACHE_SECONDS_BUFFER);
    }
    // 比对 id
    if (project.current.id !== projectTaskSet.id) {
      return;
    }
    robot.info(`开始执行 ${projectConfig.projectName} ALL 任务`);
    logger.info(
      `开始执行 ${projectConfig.projectName} ALL 任务, id: ${project.current.id}`
    );
    if (projectConfig.routes !== null) {
      // 使用配置路由生成任务
      for (const theme in projectConfig.routes) {
        const { webRoutes, appRoutes } = projectConfig.routes[theme];
        if (webRoutes && webRoutes.length !== 0) {
          projectTaskSet.langs.forEach(lang => {
            this.taskManager.createTask(
              {
                lang,
                projectName: projectConfig.projectName,
                routes: webRoutes,
                routeSetName: 'config',
                theme,
                isApp: false,
              },
              projectTaskSet
            );
          });
        }
        if (appRoutes && appRoutes.length !== 0) {
          projectTaskSet.langs.forEach(lang => {
            this.taskManager.createTask(
              {
                lang,
                projectName: projectConfig.projectName,
                routes: appRoutes,
                routeSetName: 'config',
                theme,
                isApp: true,
              },
              projectTaskSet
            );
          });
        }
      }
      this.startGenPages();
    } else {
      // 通知 worker 获取路由
      this.startGenRoutes(projectConfig, projectTaskSet);
    }
  }

  // 定时触发，在运行中的工程不会执行
  startLambdaScheduleWork(projectName) {
    const projectConfig = this.options.config.projectConfigs[projectName];
    const langs = this.resolveLangs(projectConfig);
    const projectTaskSet = this.projectManager.createProjectTaskSet({
      type: 'ALL',
      langs,
      routeSets: projectConfig.routeSets,
      keepDistFile: true,
    });
    this.projectManager.setProject(projectName, projectTaskSet);
    this.startGenRoutes(projectConfig, projectTaskSet);
  }

  // 执行中的项目插入任务
  startRoutesWorkCurrently(
    projectConfig,
    newProjectTaskSet,
    currentProjectTaskSet
  ) {
    robot.info(`运行中项目 ${projectConfig.projectName} 新增任务`);
    logger.info(`运行中项目 ${projectConfig.projectName} 新增任务`);
    for (const theme in newProjectTaskSet.routes) {
      const { webRoutes, appRoutes } = newProjectTaskSet.routes[theme];
      if (webRoutes && webRoutes.length !== 0) {
        newProjectTaskSet.langs.forEach(lang => {
          this.taskManager.createTask(
            {
              lang,
              projectName: projectConfig.projectName,
              routes: webRoutes,
              routeSetName: 'routes',
              priority: 0,
              theme,
              isApp: false,
            },
            currentProjectTaskSet
          );
        });
      }
      if (appRoutes && appRoutes.length !== 0) {
        newProjectTaskSet.langs.forEach(lang => {
          this.taskManager.createTask(
            {
              lang,
              projectName: projectConfig.projectName,
              routes: appRoutes,
              routeSetName: 'routes',
              priority: 0,
              theme,
              isApp: true,
            },
            currentProjectTaskSet
          );
        });
      }
    }
  }

  startRoutesWork(projectConfig, projectTaskSet) {
    robot.info(`开始执行 ${projectConfig.projectName} PARTIAL 任务`);
    logger.info(`开始执行 ${projectConfig.projectName} PARTIAL 任务`);
    if (projectTaskSet.routes !== null) {
      this.fileManager.ensureProjectDirForRoutes(
        projectConfig.projectName,
        projectTaskSet
      );
      for (const theme in projectTaskSet.routes) {
        const { webRoutes, appRoutes } = projectTaskSet.routes[theme];
        if (webRoutes && webRoutes.length !== 0) {
          projectTaskSet.langs.forEach(lang => {
            this.taskManager.createTask(
              {
                lang,
                projectName: projectConfig.projectName,
                routes: webRoutes,
                routeSetName: 'routes',
                theme,
                isApp: false,
              },
              projectTaskSet
            );
          });
        }
        if (appRoutes && appRoutes.length !== 0) {
          projectTaskSet.langs.forEach(lang => {
            this.taskManager.createTask(
              {
                lang,
                projectName: projectConfig.projectName,
                routes: appRoutes,
                routeSetName: 'routes',
                theme,
                isApp: true,
              },
              projectTaskSet
            );
          });
        }
      }
      this.startGenPages();
    } else if (projectTaskSet.routesWithLangMap !== null) {
      // 特定语言+路由交叉组合
      this.fileManager.ensureProjectDirForWithLangRoutes(
        projectConfig.projectName,
        projectTaskSet
      );
      for (const theme in projectTaskSet.routesWithLangMap) {
        const { withLangRoutesMap, withLangAppRoutesMap } =
          projectTaskSet.routesWithLangMap[theme];
        if (withLangRoutesMap !== null) {
          Object.keys(withLangRoutesMap).forEach(lang => {
            this.taskManager.createTask(
              {
                lang,
                projectName: projectConfig.projectName,
                routes: withLangRoutesMap[lang],
                routeWithLangPrefix: true,
                routeSetName: 'routes',
                theme,
                isApp: false,
              },
              projectTaskSet
            );
          });
        }
        if (withLangAppRoutesMap !== null) {
          Object.keys(withLangAppRoutesMap).forEach(lang => {
            this.taskManager.createTask(
              {
                lang,
                projectName: projectConfig.projectName,
                routes: withLangAppRoutesMap[lang],
                routeWithLangPrefix: true,
                routeSetName: 'routes',
                theme,
                isApp: true,
              },
              projectTaskSet
            );
          });
        }
      }
      this.startGenPages();
    } else if (projectTaskSet.routeSets.length !== 0) {
      this.fileManager.ensureProjectDirForRouteSets(
        projectConfig.projectName,
        projectTaskSet
      );
      // 通知 worker 获取路由
      this.startGenRoutes(projectConfig, projectTaskSet);
    }
  }

  startGenRoutes(projectConfig, projectTaskSet, lastWorker = null) {
    const worker = lastWorker || this.workerManager.getFreeRouteWorker();
    if (worker === null) {
      this.taskManager.createRouteTask(
        projectConfig.projectName,
        projectTaskSet
      );
    } else {
      this.workerManager.setWorkerWorking(
        {
          project: projectConfig.projectName,
          taskId: '',
        },
        worker
      );
      this.messenger.send(worker.instance, {
        event: 'action',
        payload: {
          projectName: projectConfig.projectName,
          handlerName: 'genRoutes',
          params: {
            routeSets: projectTaskSet.routeSets,
            langs: projectTaskSet.langs,
            lambdaOptions: {
              keepDistFile: projectTaskSet.keepDistFile || false,
            },
          },
        },
      });
    }
  }

  startGenPages(lastWorker) {
    // worker 复用
    if (lastWorker) {
      const task = this.taskManager.getNextTask();
      if (task === null) {
        // 没有任务分发，让 worker 空闲
        this.workerManager.setWorkerFree(lastWorker);
        return;
      }
      this.workerManager.setWorkerWorking(
        {
          project: task.projectName,
          taskId: task.taskId,
        },
        lastWorker
      );
      this.messenger.send(lastWorker.instance, {
        event: 'action',
        payload: {
          projectName: task.projectName,
          handlerName: 'genPages',
          params: { task },
        },
      });
      return;
    }
    // 分配 worker 执行
    const worker = this.workerManager.getFreePageWorker();
    // 没有空闲 worker 就返回，等待 worker 工作完成认领任务
    if (worker === null) return;
    const task = this.taskManager.getNextTask();
    // 没有任务分发
    if (task === null) return;
    this.workerManager.setWorkerWorking(
      {
        project: task.projectName,
        taskId: task.taskId,
      },
      worker
    );
    this.messenger.send(worker.instance, {
      event: 'action',
      payload: {
        projectName: task.projectName,
        handlerName: 'genPages',
        params: { task },
      },
    });
    this.startGenPages();
  }

  onRoutesGen(event) {
    const { projectConfig: currentProjectConfig, routes: allRoutesInfos } =
      event.payload;
    const project = this.projectManager.getProject(
      currentProjectConfig.projectName
    );
    // 终止遗漏的任务
    if (project.stopping) {
      this.onWorkingHandlerStopped(event);
      return;
    }
    const currentProject = project?.current;
    if (!currentProject) {
      logger.error('onRoutesGen current project got null');
      return;
    }
    const currentWorker = this.workerManager.getWorker(event.fromWorker);
    this.workerManager.setWorkerFree(currentWorker);
    const nextRouteTask = this.taskManager.getNextRouteTask();
    if (nextRouteTask) {
      const nextProjectConfig =
        this.options.config.projectConfigs[nextRouteTask.projectName];
      this.startGenRoutes(
        nextProjectConfig,
        nextRouteTask.projectTaskSet,
        currentWorker
      );
    }
    if (allRoutesInfos.length === 0) {
      // 全部路由集合在 gen-routes 时由 serverless 生成
      this.handleProjectFinished(
        currentProjectConfig.projectName,
        this.options.config.USE_SERVERLESS
      );
      return;
    }
    allRoutesInfos.forEach(routesInfo => {
      for (const theme of routesInfo.themes) {
        if (routesInfo.withoutLang.length !== 0) {
          // 生成不带语言的路由
          const slicedRoutes = sliceArray(routesInfo.withoutLang);
          currentProject.langs.forEach(lang => {
            let priority = routesInfo.priority;
            slicedRoutes.forEach((routes, i) => {
              this.taskManager.createTask(
                {
                  lang,
                  projectName: currentProjectConfig.projectName,
                  routes,
                  routeSetName: routesInfo.routeSetName,
                  priority: i === 0 && priority > 1 ? 2 : priority++,
                  isApp: routesInfo.isApp,
                  theme,
                },
                currentProject
              );
            });
          });
        }
        if (routesInfo.withLang !== null) {
          // 不同语言需要生成的路由不一样
          Object.keys(routesInfo.withLang).forEach(lang => {
            let priority = routesInfo.priority;
            const slicedRoutes = sliceArray(routesInfo.withLang[lang]);
            slicedRoutes.forEach((routes, i) => {
              this.taskManager.createTask(
                {
                  lang,
                  projectName: currentProjectConfig.projectName,
                  routes,
                  routeWithLangPrefix: true,
                  routeSetName: routesInfo.routeSetName,
                  priority: i === 0 && priority > 1 ? 2 : priority++,
                  isApp: routesInfo.isApp,
                  theme,
                },
                currentProject
              );
            });
          });
        }
      }
    });
    this.startGenPages();
  }

  onPagesGen(event) {
    const { projectConfig: currentProjectConfig, result } = event.payload;
    const project = this.projectManager.getProject(
      currentProjectConfig.projectName
    );
    // 终止遗漏的任务
    if (project.stopping) {
      this.onWorkingHandlerStopped(event);
      return;
    }
    const currentProject = project?.current;
    if (!currentProject) {
      logger.error('onPagesGen current project got null');
      return;
    }
    const currentWorker = this.workerManager.getWorker(event.fromWorker);
    currentWorker.current.taskId = '';
    currentProject.taskIdSet.delete(result.task.taskId);
    logger.debug(
      `get result urls from worker ${event.fromWorker} taskId ${result.task.taskId}, result.error: ${result.error}`
    );
    if (result.error === null) {
      const message = `${currentProjectConfig.projectName} 项目 ${
        result.task.lang
      } 语言 ${getCNRouteSetName(result.task.routeSetName)} ${
        result.task.theme
      } 子任务完成，共：${result.total}，失败：${result.failedUrls.length}`;
      logger.info(
        `${message}, taskSetId: ${project.current.id}`,
        result.failedUrls
      );
      robot.info(message);
      this.fileManager.ensureProjectDistDirLink(currentProjectConfig);
    } else {
      // worker 页面生成错误
      robot.error(
        `${currentProjectConfig.projectName} 项目 ${
          result.task.lang
        } 语言 ${getCNRouteSetName(result.task.routeSetName)} ${
          result.task.theme
        } 子任务失败`
      );
    }
    // 检查任务队列，继续分发任务或者设置 worker 空闲
    if (!this.taskManager.isFinished()) {
      logger.info(
        `${currentProjectConfig.projectName} still taskIdSet left: ${
          currentProject.taskIdSet.size
        }, total task left: ${this.taskManager.taskQueue.len()}`
      );
      this.startGenPages(currentWorker);
    } else {
      logger.info(`end taskIdSet left: ${currentProject.taskIdSet.size}`);
      this.workerManager.setWorkerFree(currentWorker);
    }
    // 检查项目是否完成
    if (currentProject.taskIdSet.size === 0) {
      this.handleProjectFinished(currentProjectConfig.projectName);
    }
  }

  handleProjectFinished(projectName, useServerless) {
    const project = this.projectManager.getProject(projectName);
    if (useServerless) {
      logger.info(`${projectName} serverless call finished`);
      robot.info(`项目 ${projectName} lambda 调用完成`);
    } else {
      logger.info(`${projectName} finished`);
      robot.info(`项目 ${projectName} 任务完成`);
    }
    // 该项目完成，检查 pending 队列
    const projectPendingCount = project.pending.len();
    if (projectPendingCount === 0) {
      logger.debug('no pending, delete project');
      this.projectManager.deleteProject(projectName);
      return;
    }
    logger.info(`等待执行新任务集数量：${projectPendingCount}`);
    // 执行 pending 队列
    const nextTaskSet = project.pending.pop();
    // 正常 pending 只会有 partial 任务集，终止任务时不会触发 onPagesGen 或者前面兜底处理
    if (nextTaskSet) {
      project.current = nextTaskSet;
      const projectConfig = this.options.config.projectConfigs[projectName];
      if (nextTaskSet.type === 'PARTIAL') {
        this.startRoutesWork(projectConfig, nextTaskSet);
      } else {
        // 可以认为 nextTaskSet.type 不是指定路由则一定是全量任务
        // 每次全量任务的触发都会清空 pending
        // 只有在当前 project 终止任务流程漏掉了某 worker 导致其执行完毕时进入这里
        if (project.stopping) {
          project.stopping = false;
        }
        this.startAllWork(projectConfig, nextTaskSet);
      }
    }
  }

  onCMSUpdate(payload) {
    const { projectName, routes: routesInfo } = payload;
    const projectConfig = this.options.config.projectConfigs[projectName];
    const project = this.projectManager.getProject(projectName);
    const { themes, isApp, withLang } = routesInfo;
    const withLangRoutesMap = isApp ? null : withLang;
    const withLangAppRoutesMap = isApp ? withLang : null;
    const routesWithLangMap = {};
    for (const theme of themes) {
      routesWithLangMap[theme] = {
        withLangRoutesMap,
        withLangAppRoutesMap,
      };
    }
    const projectTaskSet = this.projectManager.createProjectTaskSet({
      type: 'PARTIAL',
      routesWithLangMap,
    });
    if (project) {
      robot.info(`${projectName} 任务运行中，进入 pending 队列`);
      logger.info(`${projectName} 任务运行中，进入 pending 队列`);
      project.pending.push(projectTaskSet);
    } else {
      this.projectManager.setProject(projectName, projectTaskSet);
      this.startRoutesWork(projectConfig, projectTaskSet);
    }
  }

  clearProjects(params) {
    const { projects } = params;
    const ensure = false; // 只删除
    for (const projectName of projects) {
      const project = this.projectManager.getProject(projectName);
      if (!project) {
        const projectConfig = this.options.config.projectConfigs[projectName];
        for (const theme in projectConfig.distConfig) {
          const projectThemeDistConfig = projectConfig.distConfig[theme];
          execSync(
            `rm -rf ${projectThemeDistConfig.projectDistPath} ${projectThemeDistConfig.projectMobileDistPath} ${projectThemeDistConfig.projectAppDistPath}`
          );
        }
        this.fileManager.ensureProjectDirForAll(projectName, ensure);
      } else {
        robot.info(`${projectName} 任务运行中，清理终止`);
        logger.info(`${projectName} 任务运行中，清理终止`);
      }
    }
  }
}

module.exports = Master;
