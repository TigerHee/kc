/**
 * Owner: vijay.zhou@kupotech.com
 */

import { currentLang, useLocale } from '@kucoin-base/i18n';
import { ICHookOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import classnames from 'classnames';
import { isString } from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import formatLocalLangNumber from 'src/routes/AccountPage/Kyc/utils/formatLocalLangNumber';
import { _t } from 'tools/i18n';
import { kycStatusEnum } from '../constants';
import useKyc3Status from '../hooks/useKyc3Status';

const LimitsWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: 31px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 23px 15px;
  }
`;

const LimitsTitle = styled.h4`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 15px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  thead {
    th {
      padding: 7px 0;
      color: ${({ theme }) => theme.colors.text40};
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      background-color: ${({ theme }) => theme.colors.cover2};
      ${({ theme }) => theme.breakpoints.down('sm')} {
        font-size: 12px;
        line-height: 15.6px;
      }
      &:nth-of-type(1) {
        padding-left: 24px;
        text-align: left;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        ${({ theme }) => theme.breakpoints.down('sm')} {
          padding-left: 8px;
        }
      }
      &:nth-last-of-type(1) {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        ${({ theme }) => theme.breakpoints.down('sm')} {
          padding-right: 8px;
          text-align: right;
        }
      }
      &:not(&:nth-last-of-type(1)):not(&:nth-of-type(1)) {
        span:nth-of-type(1) {
          ${({ theme }) => theme.breakpoints.down('sm')} {
            display: block;
            margin-bottom: 2px;
          }
        }
      }
    }
  }
  tbody {
    td {
      padding-top: 16px;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      ${({ theme }) => theme.breakpoints.down('sm')} {
        padding-top: 12px;
        line-height: 15.6px;
      }
      &:nth-of-type(1) {
        padding-left: 24px;
        font-size: 15px;
        text-align: left;
        ${({ theme }) => theme.breakpoints.down('sm')} {
          padding-left: 0;
          color: ${({ theme }) => theme.colors.text40};
          font-weight: 400;
          font-size: 12px;
        }
      }
      &:nth-last-of-type(1) {
        ${({ theme }) => theme.breakpoints.down('sm')} {
          text-align: right;
        }
        svg {
          position: relative;
          top: 2px;
          font-size: 16px;
        }
      }
    }
    .textActive {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Tag = styled.span`
  padding: 2px 6px;
  margin-left: 8px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primary8};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: 0;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary8};
  }
`;

const empty = ' ';

// /kyc/web/kyc/privileges 接口拿数据
const AccountLimits = () => {
  const { kycInfo, kyc3Status, advanceStatus } = useKyc3Status();
  const privileges = useSelector((s) => s.kyc_th.privileges);
  const { isRTL } = useLocale();

  const isBaseVerified = useMemo(
    () => [kycStatusEnum.KYC_VERIFIED].includes(kyc3Status),
    [kyc3Status],
  );
  const isAdvanceVerified = useMemo(
    () => [kycStatusEnum.ADVANCE_VERIFIED].includes(advanceStatus),
    [advanceStatus],
  );

  const limitList = [
    { key: 'withDrawLimit', title: _t('kyc_homepage_withdraw'), unitKey: 'withdrawUnit' },
    { key: 'trading', title: _t('kyc_homepage_trade') },
    { key: 'fiatLimit', title: _t('kyc_homepage_deposit') },
  ];

  return (
    <LimitsWrapper data-inspector="account_kyc_limits">
      <LimitsTitle>{_t('uBtahDK7ApTCpeKyQ3EC55')}</LimitsTitle>
      {Object.keys(privileges).length && Object.keys(kycInfo).length ? (
        <Table>
          <thead>
            <tr>
              <th>{_t('kyc_homepage_limit1')}</th>
              <th>
                <span>{_t('07e9663790df4000a960')}</span>
                {isBaseVerified && !isAdvanceVerified ? (
                  <Tag color="primary">{_t('kyc_homepage_limit22')}</Tag>
                ) : null}
              </th>
              <th>
                <span>{_t('ba8efe58d5fb4000a605')}</span>
                {isAdvanceVerified && <Tag color="primary">{_t('kyc_homepage_limit22')}</Tag>}
              </th>
            </tr>
          </thead>
          <tbody>
            {limitList.map((item) => {
              const current = privileges?.standard || {};
              const verified = privileges?.advance || {};
              // 第二列【Crypto】（以前是【Standard】）的值
              let currentValue;
              // 第三列【Fiat】（以前是【Advance】）的值
              let verifiedValue;
              let hidden = false;

              // 表头改title了，含义也发生变化
              // 第一行（【withDrawLimit】）数据的取值需要调整
              // 其他行不变
              if (['withDrawLimit'].includes(item.key)) {
                const obj = isAdvanceVerified ? privileges?.advance : privileges?.standard;
                // 加密币提现限额
                const withDrawLimitValue = obj?.withDrawLimit;
                // 法币提现限额
                const fiatLimitValue = obj?.fiatLimit;
                // 币种单位，加密币/法币的单位用同一个字段
                const unit = obj?.withdrawUnit;
                //  -2 为不可使用，有一个是则隐藏
                if (+withDrawLimitValue === -2 || +fiatLimitValue === -2) hidden = true;
                const calc = (value) => {
                  value = formatLocalLangNumber({
                    data: value,
                    lang: currentLang,
                    interceptDigits: 2,
                  });
                  return +value === -1
                    ? '-' // -1 为不展示数值
                    : +value === 0
                    ? 'NotLimit' // 0 为无限制，用指定字符串，下面会处理
                    : value // 有其他值则按文字方向拼接数值和单位
                    ? isRTL
                      ? `${unit} ${value}`
                      : `${value} ${unit}`
                    : empty;
                };
                currentValue = calc(withDrawLimitValue);
                verifiedValue = calc(fiatLimitValue);
              } else if (['fiatLimit'].includes(item.key)) {
                if (+current[item.key] === -2 || +verified[item.key] === -2) hidden = true;
                if (+current[item.key] === -1) currentValue = '-';
                else currentValue = <ICHookOutlined />;
                if (+verified[item.key] === -1) currentValue = '-';
                else verifiedValue = <ICHookOutlined />;
              } else if (['trading'].includes(item.key)) {
                currentValue = current[item.key] ? <ICHookOutlined /> : '-';
                verifiedValue = verified[item.key] ? <ICHookOutlined /> : '-';
              }

              return hidden ? null : (
                <tr key={item.key}>
                  <td>{item.title}</td>
                  <td
                    className={classnames({
                      textActive: isBaseVerified && !isAdvanceVerified,
                    })}
                  >
                    {isString(currentValue) && currentValue?.includes('NotLimit')
                      ? _t('967eebf066114800acaa')
                      : currentValue}
                  </td>
                  <td
                    className={classnames({
                      textActive: isAdvanceVerified,
                    })}
                  >
                    {isString(verifiedValue) && verifiedValue?.includes('NotLimit')
                      ? _t('967eebf066114800acaa')
                      : verifiedValue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : null}
    </LimitsWrapper>
  );
};

export default AccountLimits;
