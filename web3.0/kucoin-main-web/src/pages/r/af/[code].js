/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2025-06-30 17:35:44
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-30 17:35:46
 * @FilePath: /kucoin-main-web/src/pages/r/af/[code].js
 * @Description: 合伙人的分享邀请路由 会重定向去 注册页面
 *
 *
 */
import React from 'react';
import { push } from 'utils/router';
import { withRouter } from 'components/Router';
import { injectLocale } from '@kucoin-base/i18n';

@withRouter()
@injectLocale
export default class AffiliatePage extends React.Component {
  componentDidMount() {
    const { query } = this.props;
    const { code } = query;
    push(`/ucenter/signup?rcode=${code}&utm_source=af`);
  }

  render() {
    return <div />;
  }
}
