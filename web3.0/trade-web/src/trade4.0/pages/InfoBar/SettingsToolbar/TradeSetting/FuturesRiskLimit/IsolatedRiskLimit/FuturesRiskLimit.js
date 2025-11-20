/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';

import { _t } from 'utils/lang';

import Button from '@mui/Button';

import SymbolText from '@/components/SymbolText';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';

import FuturesRiskLimitContent from './FuturesRiskLimitContent';

import {
  CurrentFuturesRow,
  CurrentFuturesLabel,
  CurrentFuturesValue,
  FuturesButtonWrapper,
  DrawerContent,
} from '../../style';

/**
 * FuturesRiskLimit
 * 风险限额
 */
const FuturesRiskLimit = (props) => {
  const { onOk } = props;
  const currentSymbol = useGetCurrentSymbol();
  const contentRef = useRef();

  const loading = useSelector(
    (state) => state.loading.effects['futuresSetting/postChangeRiskLimit'],
  );

  const submitEvent = async () => {
    if (contentRef.current) {
      await contentRef.current.submit();
    }
  };

  return (
    <Fragment>
      <DrawerContent>
          {/* <CurrentFuturesRow>
            <CurrentFuturesLabel>{_t('trade.settingFutures.title')}</CurrentFuturesLabel>
            <CurrentFuturesValue>
              <SymbolText symbol={currentSymbol} />
            </CurrentFuturesValue>
          </CurrentFuturesRow> */}
          <FuturesRiskLimitContent onOk={onOk} ref={contentRef} />
      </DrawerContent>
      <FuturesButtonWrapper>
        <Button variant="contained" onClick={submitEvent} loading={loading} disabled={loading}>
          {_t('security.form.btn')}
        </Button>
      </FuturesButtonWrapper>
    </Fragment>
  );
};

export default memo(FuturesRiskLimit);
