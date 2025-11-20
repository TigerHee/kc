/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Flex, Text } from 'Bot/components/Widgets';
import LabelPopover from 'Bot/components/Common/LabelPopover';
import { _t, _tHTML } from 'Bot/utils/lang';
import { formatNumber } from 'Bot/helper';
import Investment from 'Bot/components/Common/Investment/index.js';

/**
 * @description: 创建/运行中修改投资额会用到
 * @return {*}
 */
export default ({
  buySellNum = {},
  symbolInfo = {},
  balance = {},
  minInvest,
  form,
  inverstLabel,
}) => {
  const { quota, base, basePrecision, quotaPrecision, symbolCode } = symbolInfo;
  const { baseAmount, quoteAmount } = balance;
  const { needInverstBase, needInverstQuota } = buySellNum;
  const useBaseCurrency = form.getFieldValue('useBaseCurrency');
  return (
    <>
      <Investment minInvest={minInvest} symbol={symbolCode} hasMultiCoin label={inverstLabel} />
      {!!useBaseCurrency && (
        <>
          <Flex fs={12} sb mb={8} mt={8} lh="130%">
            <Text color="text40" className="nowrap ">
              {_t('zicfenbu')}
            </Text>
            <Flex flexWrap fe fw={500}>
              <Text color="text">{formatNumber(baseAmount, basePrecision)}</Text>
              <Text color="text40">&nbsp;{base} +&nbsp;</Text>
              <Text color="text">{formatNumber(quoteAmount, quotaPrecision)}</Text>
              <Text color="text40">&nbsp;{quota} </Text>
            </Flex>
          </Flex>
          <Flex fs={12} sb lh="130%">
            <LabelPopover
              textProps={{ fs: 12, color: 'text40', lh: '12px', fw: 400 }}
              label={_t('gridwidget3')}
              content={
                <>
                  <span className="fs-16 fw">{_t('gridwidget3')}</span>
                  <p>{_tHTML('oxx2ARDjJh767Due5Ckgf2', { base, quota })}</p>
                </>
              }
            />
            <Flex flexWrap fe fw={500}>
              <Text color="text">{formatNumber(needInverstBase, basePrecision)}</Text>
              <Text color="text40">&nbsp;{base} + &nbsp;</Text>
              <Text color="text">{formatNumber(needInverstQuota, quotaPrecision)}</Text>
              <Text color="text40">&nbsp;{quota} </Text>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};
