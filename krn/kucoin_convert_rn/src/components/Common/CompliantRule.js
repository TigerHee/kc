/**
 * Owner: Ray.Lee@kupotech.com
 */

import {useSelector} from 'react-redux';

// 展业中台显隐组件
const CompliantRule = ({spmId, children}) => {
  const configs = useSelector(state => state.app.compliantRuleConfigs);

  // 没有 key 就显示, 有 key 就隐藏
  const show = configs !== null && configs[spmId] === undefined;

  return show ? children : null;
};

export default CompliantRule;
