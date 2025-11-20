/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment } from 'react';
import { useSelector } from 'react-redux';

import Dropdown from '@mui/Dropdown';

import { _t, _tHTML } from 'utils/lang';
import { LIST } from './config';

import Overlay from '../Overlay';
import IconLabel from '../IconLabel';

import { useItemClick } from './useInformationProps';

/**
 * TradeInfomation
 * 交易信息模块
 */
const TradeInfomation = (props) => {
  const { showText, ...restProps } = props;
  const infoBarMediaFlag = useSelector(
    (state) => state.setting.infoBarMediaFlag,
  );

  const onItemClick = useItemClick();

  return (
    <Fragment>
      <Dropdown
        {...props}
        trigger="click"
        height="auto"
        contentPadding={0}
        title={_t('rL31Z8FGrairjgBjjv4gbm')}
        overlay={<Overlay onItemClick={onItemClick} options={LIST} />}
      >
        <IconLabel
          icon="trade-infomation"
          text={_t('rL31Z8FGrairjgBjjv4gbm')}
          showText={infoBarMediaFlag < 0}
          disabledOnMobile
        />
      </Dropdown>
    </Fragment>
  );
};

export default memo(TradeInfomation);
