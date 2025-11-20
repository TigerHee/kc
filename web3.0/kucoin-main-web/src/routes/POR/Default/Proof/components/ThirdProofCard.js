/**
 * Owner: harry@kupotech.com
 */
import React from 'react';
import independentImg from 'static/por/independent.svg';
import { showDateTimeByZoneEight } from '@/helper';
import { currentLang } from '@kucoin-base/i18n';
import { _t } from '@/tools/i18n';
import { useResponsive, Button } from '@kux/mui';
import saveAs from '@/utils/saveAs';
import styles from '../proof.less';

/**  2025-07-07 外部审计临时更新，前端写死静态审计报告地址 */
const THIRD_REPORT_CONFIG = {
  auditTime: showDateTimeByZoneEight(1751472000000, 'YYYY/MM/DD'),
  downloadUrl:
    'https://assets.staticimg.com/cms/media/RHjKt24rRcDV68DGNv9Xb2ElxkUjMiQZuIW9bfnRr.pdf',
};

const Btn = () => {
  const downloadReport = () => {
    saveAs(THIRD_REPORT_CONFIG.downloadUrl);
  };
  return (
    <div className="btn_oper">
      <Button className="mr-18 black_btn" onClick={downloadReport}>
        {_t('1N4RhNyFr7KmPXuB6FZpHq')}
      </Button>
    </div>
  );
};

const ThirdProofOperator = ({ children }) => {
  const showTimeText = `${_t('9d37bae54d534800a910')} ${THIRD_REPORT_CONFIG.auditTime}`;

  return (
    <div>
      <div className="card_title">{_t('assets.por.audit.thirdPart')}</div>
      <div className="card_time">
        <span>{showTimeText}</span>
        <div>{_t('assets.por.audit.thirdPart.des')}</div>
      </div>
      <div className="card_btn">{children}</div>
    </div>
  );
};

/**
 *  2025-07-07 外部审计静态组件
 */
export const ThirdProofCard = () => {
  const { xs, sm, md, lg } = useResponsive();
  const isMobile = xs && !sm && !md && !lg;

  return (
    <div className={`${styles.card} card_wrap`}>
      <div className={`card`}>
        <div className="card_oper_wrap">
          <div>
            <ThirdProofOperator>{!isMobile && <Btn />}</ThirdProofOperator>
          </div>
        </div>
        <div className="card_img_wrap">
          <img className="card_img" src={independentImg} alt="" />
        </div>
        {isMobile && <Btn />}
      </div>
    </div>
  );
};
