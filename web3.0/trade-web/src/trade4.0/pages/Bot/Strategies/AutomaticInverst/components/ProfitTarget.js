/**
 * Owner: mike@kupotech.com
 */
import React, { useRef } from 'react';
import ProfitTargetDialog from './ProfitTargetDialog';
import { _t } from 'Bot/utils/lang';
import { EditRow, Unset } from 'Bot/components/Common/Row';
import { floatText } from 'Bot/helper';
/**
 * @description: 盈利目标
 * @return {*}
 */
export default ({ onChange, value }) => {
  const dialogRef = useRef();
  const toggle = () => {
    dialogRef.current.toggle();
  };
  return (
    <>
      <EditRow
        onClick={toggle}
        label={_t('auto.profittarget')}
        value={
          <Unset
            value={value.profitTarget}
            show={`${floatText(value.profitTarget)}(${
              value.isTargetSellBase ? _t('auto.hintandsell') : _t('auto.onlyhint')
            })`}
          />
        }
      />
      <ProfitTargetDialog dialogRef={dialogRef} onChange={onChange} value={value} />
    </>
  );
};
