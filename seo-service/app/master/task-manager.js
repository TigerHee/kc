/**
 * Owner: hanx.wei@kupotech.com
 */
const EventEmitter = require('events');
const crypto = require('crypto');
const PriorityQueue = require('@utils/priority-queue');
const Queue = require('@utils/queue');

class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.taskQueue = new PriorityQueue();
    this.routeTaskQueue = new Queue();
  }

  _genTaskId() {
    return crypto.randomBytes(12).toString('hex');
  }

  createRouteTask(projectName, projectTaskSet) {
    const taskId = this._genTaskId();
    this.routeTaskQueue.push({
      taskId,
      projectName,
      projectTaskSet,
    });
  }

  createTask(options, projectTaskSet) {
    const {
      lang = '',
      projectName = '',
      routeSetName = '',
      routes = [],
      routeWithLangPrefix = false,
      priority = 0,
      isApp = false,
      theme = '',
    } = options;
    const taskId = this._genTaskId();
    this.taskQueue.push({
      taskId,
      projectName,
      lang,
      routeSetName,
      routes,
      routeWithLangPrefix,
      isApp,
      theme,
    }, priority);
    projectTaskSet.taskIdSet.add(taskId);
  }

  // 调试用方法
  _show() {
    const arr = this.taskQueue._all();
    const newArr = arr.map(task => {
      return `${task.taskId}/${task.projectName}/${task.lang}`;
    });
    console.log(newArr);
  }

  peekNextTask() {
    return this.taskQueue.peek();
  }

  getNextTask() {
    // this._show();
    return this.taskQueue.pop();
  }

  getNextRouteTask() {
    return this.routeTaskQueue.pop();
  }

  isFinished() {
    return this.taskQueue.len() === 0 && this.routeTaskQueue.len() === 0;
  }

  removeTasksOfProject(projectName) {
    // 从任务队列删除某个项目的任务
    this.taskQueue.remove(({ value: task }) => task.projectName === projectName);
    // this._show();
  }

  removeTasksOfIdSet(taskIdSet) {
    // 从任务队列删除某个存在的任务
    this.taskQueue.remove(({ value: task }) => taskIdSet.has(task.taskId));
  }

  removeRouteTaskOfProject(projectName) {
    this.routeTaskQueue.remove(task => task.projectName === projectName);
  }
}

module.exports = TaskManager;
