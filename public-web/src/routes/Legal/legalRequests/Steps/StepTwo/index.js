/**
 * Owner: odan.ou@kupotech.com
 */

import { useCallback, useEffect, useState } from 'react';
import VerifyID from './VerifyID';
import { ErrorStatus, ReviewStatus } from './VerifyStatus';

/**
 * 等二步
 * @param {{
 *  onVerifyRefresh: Function,
 *  verifyData: { status: number, reason?: string },
 *  token: string,
 *  screen?: string,
 * }} props 状态(status) -1:未提交身份证明 0待核验 1通过 2拒绝
 */
const LoginStepTwo = (props) => {
  const { onVerifyRefresh, verifyData, token, screen } = props;
  const [conf, setConf] = useState({
    type: '', // verify, review, error
  });
  const onChange = useCallback((type) => {
    setConf((item) => ({
      ...item,
      type,
    }));
  }, []);

  useEffect(() => {
    const { status, reason } = verifyData || {};
    // 未提交
    let res = {
      type: 'verify',
      reason,
    };
    // 核验中
    if (status === 0) res.type = 'review';
    // 通过（通过状态不会显示，会直接到第三步）
    // 拒绝
    if (status === 2) res.type = 'error';
    setConf(res);
  }, [verifyData]);

  const hash = {
    verify: (
      <VerifyID
        onChange={onChange}
        linkKey="review"
        onVerifyRefresh={onVerifyRefresh}
        token={token}
        screen={screen}
      />
    ),
    review: <ReviewStatus screen={screen} />,
    error: (
      <ErrorStatus onChange={onChange} linkKey="verify" reason={conf.reason} screen={screen} />
    ),
  };

  return <div>{hash[conf.type]}</div>;
};

export default LoginStepTwo;
