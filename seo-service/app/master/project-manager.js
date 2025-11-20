/**
 * Owner: hanx.wei@kupotech.com
 */
const EventEmitter = require('events');
const Queue = require('@utils/queue');
const crypto = require('crypto');

class ProjectManager extends EventEmitter {
  constructor() {
    super();
    this.projects = new Map();
  }

  _genProjectTaskSetId() {
    return crypto.randomBytes(8).toString('hex');
  }

  // routes { [theme]: { webRoutes, appRoutes } }
  // routesWithLangMap { [theme]: { withLangRoutesMap, withLangAppRoutesMap } }
  // withLangRoutesMap, withLangAppRoutesMap { [lang]: [route] }
  createProjectTaskSet(options) {
    const {
      type,
      langs = [],
      routes = null,
      routesWithLangMap = null,
      routeSets = [],
      taskIdSet = new Set(),
      keepDistFile,
    } = options;
    const id = this._genProjectTaskSetId();
    return {
      id,
      type,
      langs,
      routes,
      routesWithLangMap,
      routeSets,
      taskIdSet,
      keepDistFile,
      process: null, // child_process
    };
  }

  getProject(projectName) {
    return this.projects.get(projectName) || null;
  }

  setProject(projectName, projectTaskSet) {
    this.projects.set(projectName, {
      pending: new Queue(),
      current: projectTaskSet,
      stopping: false,
    });
  }

  deleteProject(projectName) {
    this.projects.delete(projectName);
  }
}

module.exports = ProjectManager;
