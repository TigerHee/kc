/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment, useCallback } from 'react';
import Switch from '@mui/Switch';
import SvgComponent from '@/components/SvgComponent';
import { TableItem, TableItemRight, CloseWrapper } from './style';
import { useDispatch, useSelector } from 'dva';
import { _t } from 'utils/lang';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import SymbolPrecision from '@/components/SymbolPrecision';
import Empty from '@mui/Empty';
import { floadToPercent } from 'helper';

import { useSnackbar } from '@kux/mui';

const isAmplitudePush = (type) => type === 'AMPLITUDE_PUSH';

export const parseType = (type, warnType) => {
  if (isAmplitudePush(type)) {
    return _t('amplitude.period', { m: 5 });
  }
  switch (warnType) {
    case 0:
    default:
      return _t('pricewarn.up');
    case 1:
      return _t('pricewarn.down');
  }
};

/**
 * AlertMonitoring
 * 监控预警
 */
const AlertMonitoring = (props) => {
  const { ...restProps } = props;
  const records = useSelector((state) => state.priceWarn.records);

  const dispatch = useDispatch();
  const { message } = useSnackbar();

  const handleStatusChange = useCallback(async (status, id, type) => {
    await dispatch({
      type: 'priceWarn/changeStatus',
      payload: {
        type,
        status,
        primaryKey: id,
      },
    });
    message.success(_t('operation.succeed'));
  }, []);

  const handleDelete = useCallback(async (id, type) => {
    await dispatch({
      type: 'priceWarn/newRemove',
      payload: { type, primaryKey: id },
    });
    message.success(_t('operation.succeed'));
  }, []);

  return (
    <Fragment>
      {records?.length ? (
        records.map(
          ({ type, symbol, status, warnType, warnAmount, id, threshold }) => (
            <TableItem key={id} gray={!status} {...restProps}>
              <span>
                <SymbolCodeToName code={symbol} />
              </span>
              <span>{parseType(type, warnType)}</span>
              <TableItemRight>
                {isAmplitudePush(type) ? (
                  floadToPercent(threshold / 100)
                ) : (
                  <SymbolPrecision
                    symbol={symbol}
                    value={warnAmount}
                    precisionKey="pricePrecision"
                  />
                )}
              </TableItemRight>
              <TableItemRight>
                <Switch
                  checked={status === 1}
                  onChange={(checked) => handleStatusChange(checked, id, type)}
                />
              </TableItemRight>
              <CloseWrapper onClick={() => handleDelete(id, type)}>
                <SvgComponent fileName="toolbar" type="close" />
              </CloseWrapper>
            </TableItem>
          ),
        )
      ) : (
        <Empty />
      )}
    </Fragment>
  );
};

export default memo(AlertMonitoring);
