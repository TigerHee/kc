/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { LabelPopoverTemp } from 'Bot/Strategies/components/LabelPopover';
import { formatEffectiveDecimal, floatToPercent } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'dva';

const MLabelPopoverTemp = styled(LabelPopoverTemp)`
  color: ${({ theme }) => theme.colors.text30};
  text-decoration-color: ${({ theme }) => theme.colors.text30};
`;

/**
 * @description: tax文案配置
 * @param {*} kycCountryCode
 * @param {*} taxRate
 * @return {*}
 */
const getTaxCfg = ({ kycCountryCode, taxRate }) => {
  const dftTaxRate = 0.01;
  const taxText = {
    india: {
      text: _t('tax.hint', { taxRate: floatToPercent(taxRate || dftTaxRate) }),
    },
    ng: {
      text: _t('trade-front.tax.tips.ng'),
    },
  };
  const country = kycCountryCode?.toLowerCase();
  return taxText[country] || taxText.india;
};
/**
 * @description: 修改原有数据
 * @param {*} items
 * @param {*} kycCountryCode
 * @return {*}
 */
const insertTax = (items, kycCountryCode) => {
  const hasTax = taxHas(items);
  if (!hasTax) return items;
  // 有税费展示, 需要在每列最后面添加一列tax, 并和最后一列合并展示
  const sameId = 2;

  const taxColumnCreator = ({ quota, quotaPrecision, item }) => {
    const meta = getTaxCfg({ kycCountryCode, taxRate: item.taxRate });
    return {
      label: (
        <MLabelPopoverTemp title={_t('tax')} content={meta.text} className="tax">
          {_t('tax')}
        </MLabelPopoverTemp>
      ),
      value: Number(item.tax) > 0 ? formatEffectiveDecimal(item.tax, quotaPrecision) : null,
      unit: quota,
      inSameColumn: sameId, // 合并展示字段
    };
  };
  return items.map((el) => {
    const { quota, quotaPrecision } = el._symbolInfo;
    const _lists = el.lists.slice(0);
    // 最后一列添加inSameColumn
    _lists[_lists.length - 1].inSameColumn = sameId;
    // 插入tax列
    _lists.splice(
      _lists.length - 1,
      0,
      taxColumnCreator({ quota, quotaPrecision, item: el._item }),
    );
    return {
      ...el,
      lists: _lists,
    };
  });
};
const taxHas = (items) => {
  return items?.some((el) => Number(el._item.tax) > 0);
};
// 拦截处理tax
const useTax = (items) => {
  const hasTax = taxHas(items);

  const dispatch = useDispatch();
  const kycCountryCode = useSelector((state) => state.BotApp.kycCountryCode);
  React.useEffect(() => {
    if (hasTax) {
      dispatch({
        type: 'BotApp/getBotUserInfo',
      });
    }
  }, [hasTax]);

  // 拦截处理tax
  const _items = React.useMemo(() => {
    return insertTax(items, kycCountryCode);
  }, [items, kycCountryCode]);
  return _items;
};

export default useTax;
