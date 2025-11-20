/**
 * Owner: willen@kupotech.com
 */
/**
 * showError 依赖模型，babel-reigster-model 插件的存在，这里的模型依赖会被缓存起来。
 * 当执行到 App 渲染的时候，缓存的模型会统一注册并执行 subscriptions 造成阻塞
 * 所以这里添加异步加载模型并注册的逻辑
 */
import _ from 'lodash';

const onError = (error, dispatch) => {
};

export default onError;
