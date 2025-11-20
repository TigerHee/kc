/**
 * Owner: pike@kupotech.com
 */
import { _t } from 'tools/i18n';
import MuiTimePicker from 'components/common/NewMuiTimePicker';
import EarnCoinSelector from './MuiEarnCoinSelector';
import MuiSelect from 'components/common/NewMuiSelect';
import { map as _map } from 'lodash';
import moment from 'moment';

const DAYS = 365;

const disabledDate = (current, values) => {
  if (values?.current?.length > 0) {
    const date = values.current[0];
    const lastDis = moment().diff(date, 'days');
    return (
      (current > moment().endOf('day') &&
        current.diff(date, 'days') > (lastDis > DAYS ? DAYS : 0)) ||
      Math.abs(date.diff(current, 'days')) > DAYS
    );
  }
  return current && current > moment().endOf('day');
};

/**
 *  关于赚币账户的filter配置。因为赚币账户和其他账户的配置不一样。不合适共用，所以单独拆出赚币逻辑。
 * 产品种类筛选为：活期赚币、Staking、活动、波卡竞拍、BurningDrop、ETH2.0
 * 类型筛选为：转入、转出、申购、赎回、买入、卖出、利息收益、POL收益
 */
export const getEarnFields = ({
  bizTypeItems = {},
  productCategoryItems = {},
  orderStatusItems = {},
  initConfig,
  needCurrencies = true,
  needBizType = true,
  needOrderStatus = false, // 赚币需要
}) => {
  // const bizTypeItemsKeys = Object.keys(bizTypeItems);
  const newBizTypeItems = bizTypeItems
    ? _map(bizTypeItems, (v) => ({ label: () => v.name, code: v.value, _label: v.name }))
    : [];
  newBizTypeItems.unshift({
    label: () => _t('earn.account.dirType.all'),
    code: '',
    _label: _t('earn.account.dirType.all'),
  });

  // const productCategoryItemsKeys = Object.keys(productCategoryItems);
  const newProductCategoryItems = productCategoryItems
    ? _map(productCategoryItems, (v) => ({ label: () => v.name, code: v.value, _label: v.name }))
    : [];

  const onFilter = (inputValue, option) => {
    let result = false;
    try {
      result = option._label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    } catch (e) {
      result = false;
    }
    return result;
  };

  // const orderStatusItemsKeys = Object.keys(orderStatusItems);
  const newOrderStatusItems = orderStatusItems
    ? _map(orderStatusItems, (v) => ({ label: () => v.name, code: v.value, _label: v.name }))
    : [];
  newOrderStatusItems.unshift({
    label: () => _t('earn.account.tableStaking.allStatus'),
    code: '',
    _label: _t('earn.account.tableStaking.allStatus'),
  });

  const defaultOption = [
    {
      id: 'rangeDate',
      key: 'rangeDate',
      label: _t('time'),
      ocx: (
        <MuiTimePicker disablePortal={false} placeholder={_t('time')} disabledDate={disabledDate} />
      ),
      ...(initConfig ? { initialValue: [initConfig.startAt, initConfig.endAt] } : {}),
    },
    {
      id: 'productCategory',
      key: 'productCategory',
      label: _t('earn.account.type.all'),
      // items: newProductCategoryItems,
      ocx: (
        <MuiSelect
          onFilter={onFilter}
          placeholder={_t('earn.account.type.all')}
          options={newProductCategoryItems}
        />
      ),
      ...(initConfig ? { initialValue: initConfig.proType } : {}),
    },
  ];

  // 第三个
  if (needBizType) {
    defaultOption.splice(1, 0, {
      id: 'bizType',
      key: 'bizType',
      label: _t('earn.account.dirType.all'),
      items: newBizTypeItems,
      ocx: (
        <MuiSelect
          onFilter={onFilter}
          placeholder={_t('earn.account.dirType.all')}
          options={newBizTypeItems}
        />
      ),
      ...(initConfig ? { initialValue: initConfig.direction } : {}),
    });
  }

  if (needCurrencies) {
    defaultOption.unshift({
      id: 'currency',
      key: 'currency',
      needAll: false,
      label: _t('account.detail.coin'),
      ocx: (
        <EarnCoinSelector
          allowSearch
          placeholder={_t('earn.account.earnDetail.coin')}
          disableClearable={false}
        />
      ),
      ...(initConfig ? { initialValue: initConfig.currency } : {}),
    });
  }

  //  赚币筛选
  if (needOrderStatus) {
    defaultOption.push({
      id: 'orderStatus',
      key: 'orderStatus',
      label: _t('earn.account.tableStaking.allStatus'),
      items: newOrderStatusItems,
      ocx: (
        <MuiSelect
          placeholder={_t('earn.account.tableStaking.allStatus')}
          options={newOrderStatusItems}
          onFilter={onFilter}
        />
      ),
      ...(initConfig ? { initialValue: initConfig.direction } : {}),
    });
  }

  return defaultOption;
};
