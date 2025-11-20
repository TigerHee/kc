/**
 * Owner: willen@kupotech.com
 */
import AbsoluteLoading from 'components/AbsoluteLoading';
import { withRouter } from 'components/Router';
import UnfreezeAccount from 'components/UnfreezeAccount';
import qs from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import CodeError from './CodeError';
import ConfirmFreeze from './ConfirmFreeze';

@connect((state) => {
  const { frozen, codeError, frozenTime, pageLoading } = state.account_freeze;
  return {
    codeError,
    frozen,
    frozenTime,
    pageLoading,
  };
})
@withRouter()
export default class Freeze extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      query: { code },
    } = this.props;
    const _code =
      code || encodeURIComponent(qs.parse(window.location.search, { decode: false }).code);
    dispatch({
      type: 'account_freeze/checkFreeze',
      payload: {
        code: _code,
      },
    });
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      query: { code },
    } = this.props;
    const _code =
      code || encodeURIComponent(qs.parse(window.location.search, { decode: false }).code);
    if (prevProps.frozen !== this.props.frozen) {
      dispatch({
        type: 'account_freeze/checkFreeze',
        payload: {
          code: _code,
        },
      });
    }
  }

  logout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/logout',
      payload: {
        to: '/',
      },
    });
  };

  render() {
    const { frozen, codeError, frozenTime, pageLoading } = this.props;

    return !pageLoading ? (
      <div data-inspector="freezing_page">
        {codeError ? (
          <CodeError />
        ) : frozen ? (
          <UnfreezeAccount timer={frozenTime} logout={this.logout} />
        ) : (
          <ConfirmFreeze />
        )}
      </div>
    ) : (
      <AbsoluteLoading size="large" />
    );
  }
}
