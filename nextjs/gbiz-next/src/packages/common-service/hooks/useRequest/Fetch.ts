/*
 * @owner: borden@kupotech.com
 */
import { execMaybeAsyncFn } from '../../tools';

export default class Fetch {
  count: any = 0;
  pluginImpls: any[] = [];

  state: any = {
    loading: undefined,
    params: undefined,
    data: undefined,
    error: undefined,
  };

  serviceRef: any;
  options: any;
  subscribe: any;

  constructor(serviceRef: any, options: any, subscribe: any, initState: any = {}) {
    this.serviceRef = serviceRef;
    this.options = options;
    this.subscribe = subscribe;
    this.state = {
      ...this.state,
      ...initState,
    };
  }

  setState(s: any = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    this.subscribe();
  }

  runPluginHandler(event: any, ...rest: any[]) {
    const r = this.pluginImpls.map(i => i[event]?.(...rest)).filter(Boolean);
    return Object.assign({}, ...r);
  }

  async asyncRunPluginHandler(event: any, ...rest: any[]) {
    const eventHandlers = this.pluginImpls.map(i => i[event]).filter(Boolean);
    const results = await Promise.all(
      eventHandlers.map(async (fn: any) => {
        const ret = await execMaybeAsyncFn(fn, ...rest);
        return ret;
      })
    );

    return results.reduce((acc: any, result: any) => Object.assign(acc, result), {});
  }

  async runAsync(...params: any[]) {
    this.count += 1;
    const currentCount = this.count;

    params =
      typeof this.options.formatParams === 'function'
        ? await execMaybeAsyncFn(this.options.formatParams, params)
        : params;

    const {
      stopNow = false,
      returnNow = false,
      ...state
    } = await this.asyncRunPluginHandler(
      'onBefore',
      params
    );

    if (stopNow) {
      return new Promise(() => {});
    }

    this.setState({
      loading: true,
      params,
      ...state,
    });

    if (returnNow) {
      return Promise.resolve(state.data);
    }

    this.options.onBefore?.(params);

    try {
      let { servicePromise } = this.runPluginHandler('onRequest', this.serviceRef.current, params);

      if (!servicePromise) {
        servicePromise = this.serviceRef.current(...params);
      }

      let res = await servicePromise;

      if (currentCount !== this.count) {
        // 当请求被取消时，阻止
        return new Promise(() => {});
      }

      res =
        typeof this.options.formatResult === 'function' ? await execMaybeAsyncFn(this.options.formatResult, res) : res;

      this.setState({
        data: res,
        error: undefined,
        loading: false,
      });

      this.options.onSuccess?.(res, params);

      this.runPluginHandler('onSuccess', res, params);

      this.options.onFinally?.(params, res, undefined);

      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, res, undefined);
      }

      return res;
    } catch (error: any) {
      if (currentCount !== this.count) {
        // 当请求被取消时，阻止
        return new Promise(() => {});
      }

      this.setState({
        error,
        loading: false,
      });

      this.options.onError?.(error, params);

      this.runPluginHandler('onError', error, params);

      this.options.onFinally?.(params, undefined, error);

      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, undefined, error);
      }

      throw error;
    }
  }

  run(...params: any[]) {
    this.runAsync(...params).catch((error: any) => {
      if (!this.options.onError) {
        console.error(error);
      }
    });
  }

  cancel() {
    this.count += 1;

    this.setState({
      loading: false,
    });

    this.runPluginHandler('onCancel');
  }

  refresh() {
    this.run(...(this.state.params || []));
  }

  refreshAsync() {
    return this.runAsync(...(this.state.params || []));
  }
}
