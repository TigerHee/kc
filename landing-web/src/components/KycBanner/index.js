/**
 * Owner: solar@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { kcsensorsClick, saTrackForBiz } from 'utils/ga';
import { CloseOutlined } from '@kufox/icons';
import authRightArrow from 'assets/kyc-banner/auth_right_arrow.svg';
import kycWarning from 'assets/kyc-banner/kyc_warning.svg';
import styles from './style.less';
import { useSelector, useDispatch } from 'dva';

export default () => {
  const { topMessage, buttonAgree, buttonAgreeWebUrl, closable } =
    useSelector((state) => state.user.forceKycInfo)?.notice || {};
  const forceKycInfo = useSelector((state) => state.user.forceKycInfo);
  const showKycNotice = Boolean(forceKycInfo.bizType);
  const [showNotice, setShowNotice] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'user/queryIpDismiss',
      payload: {
        bizType: 'FORCE_KYC_MESSAGE,IP_TOP_MESSAGE,CLEARANCE_MESSAGE',
      },
    });
  }, [dispatch]);
  useEffect(() => {
    // 曝光时上报
    saTrackForBiz({}, ['tradingKycHeader', '1']);
  }, []);
  if (!showNotice) return null;
  return showKycNotice ? (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <img src={kycWarning} alt="" className={styles['warning-icon']} />
        <div className={styles.content}>{topMessage}</div>
        {buttonAgree && (
          <a
            href={buttonAgreeWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={() => {
              // 点击跳转第三方时上报
              kcsensorsClick(['tradingKycHeader', '2']);
            }}
          >
            <span>{buttonAgree}</span>
            <img src={authRightArrow} alt="" />
          </a>
        )}
        {closable && (
          <button
            className={styles.close}
            onClick={(e) => {
              setShowNotice(false);
            }}
          >
            <CloseOutlined size="16" />
          </button>
        )}
      </div>
    </div>
  ) : null;
};
