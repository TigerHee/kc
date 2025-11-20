/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import classnames from 'classnames';
import { useTheme } from '@emotion/react';
import { ICInfoContainOutlined } from '@kux/icons';
import useMarginModel from '@/hooks/useMarginModel';
import { getCoinInfo } from '@/hooks/common/useCoin';
import TooltipWrapper from '@/components/TooltipWrapper';
import { _t } from 'src/utils/lang';

const BorrowingInfoTip = ({ currency, className, size = 14, ...otherProps }) => {
  const { colors } = useTheme();
  const { coinsConfig } = useMarginModel(['coinsConfig']);
  const { currencyName } = getCoinInfo({ coin: currency });

  const {
    borrowMinAmount, // 币种借入最小金额范围
    currencyLoanMinUnit, // 币种最小借出单位
  } = coinsConfig[currency] || {};

  return (
    <TooltipWrapper
      isTip
      title={
        <div>
          {_t('hm1vT76XbhQ1n1Eq1vpZUs', {
            borrowMinAmount,
            currency: currencyName,
          })}
          <br />
          {_t('eEdsU2Xt2KYHYmdfJqtNxF', {
            currencyLoanMinUnit,
            currency: currencyName,
          })}
        </div>
      }
      className={classnames('ml-6', { [className]: !!className })}
      {...otherProps}
    >
      <ICInfoContainOutlined color={colors.text40} size={size} />
    </TooltipWrapper>
  );
};

export default React.memo(BorrowingInfoTip);
