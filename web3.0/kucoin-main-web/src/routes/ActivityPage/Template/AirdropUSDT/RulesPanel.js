/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';
import { _t } from 'tools/i18n';
import Html from 'components/common/Html';
import BaseComponent from '../../module/BaseComponent';
// import { Popover } from '../../module/Popover';
import style from './style.less';
import { useLocale } from '@kucoin-base/i18n';

const ProjectIntroduction = () => {
  useLocale();
  const dateRatio = [
    { label: '05/07 ~ 05/11 (5 Days)', value: '20%' },
    { label: '05/12 ~ 05/16 (5 Days)', value: '12%' },
    { label: '05/17 ~ 05/21 (5 Days)', value: '10%' },
    { label: '05/22 ~ 05/28 (7 Days)', value: '8%' },
    { label: '05/29 ~ 06/07 (10 Days)', value: '5%' },
    { label: '06/08 ~ 06/21 (14 Days)', value: '3%' },
    { label: '06/22 ~ 08/14 (54 Days)', value: '1%' },
  ];
  const popContent = (
    <div className={style.popContent}>
      <div>
        {dateRatio.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <div style={{ marginTop: '12px' }}>
                <span className={style.text}>{item.label}&nbsp;/&nbsp;</span>
                <span className={style.highlight}>{item.value}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return (
    <BaseComponent baseHead={_t('trxAirdrop.activity.rule')}>
      <div className={style.panel}>
        <div className={style.title}>
          {_t('trxAirdrop.activity.date')}/
          <span style={{ color: '#F5CD8D' }}>{_t('trxAirdrop.yearly.return')}</span>
        </div>
        <div>
          <Popover overlayClassName={style.popContainer} content={popContent}>
            <div className={style.ruleImg} />
          </Popover>
          <div className={style.text}>
            <Html>{_t('trxAirdrop.activity.info')}</Html>
          </div>
        </div>
      </div>
    </BaseComponent>
  );
};

ProjectIntroduction.propTypes = {
  content: PropTypes.string,
};

ProjectIntroduction.defaultProps = {
  content: '',
};

export default ProjectIntroduction;
