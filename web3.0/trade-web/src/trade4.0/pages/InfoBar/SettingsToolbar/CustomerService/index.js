/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import TooltipWrapper from '@/components/TooltipWrapper';
import { IconWrapper } from '../style';
import { _t } from 'utils/lang';
import useCustomerUrl from '@/hooks/useCustomerUrl';

/**
 * CustomerService
 * 客服模块
 */
const CustomerService = (props) => {
  const { ...restProps } = props;
  const { openUrl } = useCustomerUrl();

  return (
    <TooltipWrapper
      {...restProps}
      title={_t('iD7MXDzctJNPx8meu4hufy')}
      placement="bottom"
      disabledOnMobile
    >
      <IconWrapper
        fileName="toolbar"
        type="customer-service"
        onClick={openUrl}
      />
    </TooltipWrapper>
  );
};

export default memo(CustomerService);
