/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2025-06-30 17:33:26
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-30 17:33:32
 * @FilePath: /kucoin-main-web/src/pages/r/[code].js
 * @Description: 邀请有礼的分享邀请路由 会重定向去 注册页面
 *
 *
 */
import React from 'react';
import { push } from 'utils/router';
import { withRouter } from 'components/Router';
import { injectLocale } from '@kucoin-base/i18n';

@withRouter()
@injectLocale
export default class ReferralPage extends React.Component {
  componentDidMount() {
    const { query } = this.props;
    const { code } = query;
    push(`/ucenter/signup?rcode=${code}&utm_source=friendInvite`);
  }

  render() {
    return <div />;
  }
}
