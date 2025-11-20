/**
 * Owner: odan.ou@kupotech.com
 */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import { _t } from 'utils/lang';
import wsSubscribe from 'hocs/wsSubscribe';
import { PushConf } from 'common/utils/socketProcess';

/**
 * 订阅Symbols变化逻辑
 */
@wsSubscribe({
  getTopics: (Topic, props) => {
    const { needSubs = true } = props;
    const topicList = [];
    if (needSubs) {
      // 增加 symbools 变动 订阅
      topicList.push(
        [PushConf.SYMBOLSCHANGENOTICE.topic],
      );
    }
    return topicList;
  },
  didUpdate: (prevProps, currentProps) => {
    return currentProps.needSubs !== prevProps.needSubs;
  },
})
class SymbolsChangeComp extends PureComponent {
  render() {
    return null;
  }
}

export default SymbolsChangeComp;
