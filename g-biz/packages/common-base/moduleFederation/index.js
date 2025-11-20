/*
 * @Owner: elliott.su@kupotech.com
 */
import React from 'react';
import { FAILURE, LOADING, SUCCESS } from './const';
import { loadRemoteModule, registerRemote, splitPackageName } from './util';

/**
 * 单次注册模块联邦
 * @param {string} name 当前消费者的名称，预留字段，可选
 * @param {array} remotes 依赖的远程模块列表 name 项目名, entry 项目入口, preload 选填，是否预加载资源
 */
export function init({ remotes = [] }) {
  remotes.forEach((item) => {
    registerRemote(item);
  });
}

/**
 * 批量注册模块联邦
 * @param {array} remotes 依赖的远程模块列表 name 项目名, entry 项目入口, preload 选填，是否预加载资源
 */
export function registerRemotes(remotes = []) {
  remotes.forEach((item) => {
    registerRemote(item);
  });
}

/**
 * 加载远程组件
 * @param {string} remotePackage 远程包名，格式name/module，如trade-web/List
 * @param {object} opts 配置项 loading字段表示加载组件, error字段表示加载失败组件
 */
export function loadRemote(remotePackage, opts = {}) {
  const { loading: LoadingComponent = () => null, error: ErrorComponent = () => null } = opts;
  const hoc = (C) => C;
  const [name, module] = splitPackageName(remotePackage);

  return class loadMF extends React.PureComponent {
    constructor() {
      super();
      this.state = {
        comp: null,
        state: LOADING,
      };
      this.load();
    }

    async load() {
      loadRemoteModule(name)
        .then(async (m) => {
          const factory = await m.get(module);
          return factory();
        })
        .then((res) => {
          this.setState({ comp: res.default, state: SUCCESS });
        })
        .catch((err) => {
          this.setState({ state: FAILURE });
          console.error(err);
        });
    }

    render() {
      const { comp, state } = this.state;

      if (state === LOADING) {
        return <LoadingComponent {...this.props} />;
      }
      if (state === FAILURE) {
        return <ErrorComponent {...this.props} />;
      }
      const Component = hoc(comp);
      return <Component {...this.props} />;
    }
  };
}

/**
 * 加载远程函数
 * @param {string} remotePackage 远程包名，格式name/module，如trade-web/List
 */
export async function loadUtil(remotePackage) {
  const [name, module] = splitPackageName(remotePackage);
  const m = await loadRemoteModule(name);
  const factory = await m.get(module);
  return factory();
}

export default {
  init,
  registerRemotes,
  loadRemote,
  loadUtil,
};
