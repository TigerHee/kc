/**
 * Owner: willen@kupotech.com
 */
import UnfreezeAccount from 'components/UnfreezeAccount';
import statelessLifeCycle from 'hocs/statelessLifeCycle';
import { connect } from 'react-redux';
import { push as routerPush } from 'utils/router';
import InReview from './InReview';
import ReviewFail from './ReviewFail';

const APPLYING = 0;
const REFUSE = 2;

const Frozen = (props) => {
  const { frozenTime, applyStatus, rejectReason, dispatch } = props;

  const handleApply = (unfreezeSub) => {
    routerPush(`/freeze/apply${unfreezeSub ? '?unfreezeSub' : ''}`);
  };

  const logout = () => {
    dispatch({
      type: 'app/logout',
      payload: {
        to: '/',
      },
    });
  };

  if (applyStatus === APPLYING) {
    return <InReview logout={logout} />;
  }
  if (applyStatus === REFUSE) {
    return <ReviewFail logout={logout} reason={rejectReason} onApply={handleApply} />;
  }
  return <UnfreezeAccount canApply onApply={handleApply} timer={frozenTime} logout={logout} />;
};

const handleMounted = (props) => {
  const { dispatch } = props;
  dispatch({
    type: 'account_freeze/pullApplyInfo',
  });
};

const FrozenWithLifeCycle = statelessLifeCycle({ handleMounted })(Frozen);

export default connect((state) => {
  const { frozenTime, applyStatus, rejectReason } = state.account_freeze;
  return {
    frozenTime,
    applyStatus,
    rejectReason,
  };
})(FrozenWithLifeCycle);
