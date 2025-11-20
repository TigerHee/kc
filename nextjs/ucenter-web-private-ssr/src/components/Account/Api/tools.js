/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { tenantConfig } from 'config/tenant';
import { mapKeys, omit, pick } from 'lodash-es';
import { SubAccountDisableApiKeys } from 'config/base';
import { _t } from 'tools/i18n';

const CreateCheckboxItem = styled.div`
  margin-left: 8px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  div {
    margin-top: 4px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }

  em {
    position: relative;
    top: -1px;
    margin-left: 6px;
    padding: 2px 4px;
    color: #ed6666;
    font-size: 12px;
    font-style: initial;
    line-height: 18px;
    background: rgba(237, 102, 102, 0.08);
    border-radius: 2px;
  }
`;

function showDisableLabel(permissionMapKey, isSubAccount, subAccountDisableLabelI18Key) {
  return (
    isSubAccount &&
    SubAccountDisableApiKeys.includes(permissionMapKey) &&
    subAccountDisableLabelI18Key
  );
}

/**
 * 获取权限列表
 * @param noWithdraw -- 是否不显示提币权限
 * @param permissionMap -- 可开通权限
 * @param isLeadTradeApi - 是否创建合约带单交易 api
 */
export const getAuthList = (
  noWithdraw,
  permissionMap = {},
  isSubAccount = false,
  isOther = false,
  isLeadTradeApi = false,
) => {
  const arr = [];
  const authMap = tenantConfig.api.apiAuthMap(_t);
  const map = isLeadTradeApi
    ? // 带单 api 只有通用权限 和 合约带单交易权限
    pick(authMap, ['API_COMMON', 'API_LEADTRADE_FUTURES'])
    : // 普通 api 没有 合约带单交易权限
    omit(authMap, ['API_LEADTRADE_FUTURES']);
  mapKeys(map, ({ name, desc, subAccountDisableLabel }, key) => {
    if (key === 'API_COMMON' || key === 'API_LEADTRADE_FUTURES') {
      // 通用权限、合约带单交易权限，不可取消
      // 目前合约带单交易权限不可取消是业务需要，后续应该要移除
      arr.push({
        value: key,
        disabled: true,
        label: (
          <CreateCheckboxItem>
            {name}
            {showDisableLabel(key, isSubAccount, subAccountDisableLabel) ? (
              <em>{subAccountDisableLabel}</em>
            ) : null}
            <div>{desc}</div>
          </CreateCheckboxItem>
        ),
      });
    } else if (key === 'API_WITHDRAW' && permissionMap && permissionMap[key]) {
      // withdraw 有附加文案，子账号没有withdraw权限
      if (!noWithdraw) {
        arr.push({
          value: key,
          disabled: false,
          label: (
            <CreateCheckboxItem>
              {name}
              <em>{_t('api.suggest.no')}</em>
              <div>{desc}</div>
            </CreateCheckboxItem>
          ),
        });
      }
    } else if (key === 'API_TRANSFER' && permissionMap && permissionMap[key]) {
      // transfer根据api type不同有不同文案
      arr.push({
        value: key,
        disabled: false,
        label: (
          <CreateCheckboxItem>
            {name}
            <div>{isOther ? _t('9f97788cc42a4000a483') : _t('gpYdsM8J4hi7JPy7EFYWLB')}</div>
          </CreateCheckboxItem>
        ),
      });
    } else if (key && permissionMap && permissionMap[key]) {
      // 子账号不支持的类型仍然需要展示，如果permissionMap中没有该key
      const showDisabled = showDisableLabel(key, isSubAccount, subAccountDisableLabel);
      arr.push({
        value: key,
        disabled: !permissionMap[key] || showDisabled,
        label: (
          <CreateCheckboxItem>
            {name}
            {showDisabled ? <em>{subAccountDisableLabel}</em> : null}
            <div>{desc}</div>
          </CreateCheckboxItem>
        ),
      });
    }
  });
  return arr;
};

/**
 * 获取权限列表(仅数据，不带样式)
 * params：noWithdraw -- 是否不显示提币权限
 */
export const getAuthListSimple = (noWithdraw) => {
  const arr = [];
  const authMap = tenantConfig.api.apiAuthMap(_t);
  mapKeys(authMap, function ({ name }, key) {
    if (key === 'API_WITHDRAW') {
      if (!noWithdraw) {
        arr.push({
          value: key,
          label: name,
        });
      }
    } else {
      arr.push({
        value: key,
        label: name,
      });
    }
  });
  return arr;
};

export const ipWhite1AuthList = ['API_WITHDRAW'];
