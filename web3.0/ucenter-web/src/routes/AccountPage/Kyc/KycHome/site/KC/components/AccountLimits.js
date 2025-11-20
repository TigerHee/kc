/**
 * Owner: willen@kupotech.com
 */

import { ICHookOutlined } from '@kux/icons';
import { styled, Tag } from '@kux/mui';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';

const LimitsWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: 31px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 23px 15px;
  }
  .currentTitleBox {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-right: 8px;
    }
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
        color: ${({ theme }) => theme.colors.primary};
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
  }
`;

const LoadingBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 116px 0;
`;

const AccountLimits = () => {
  const kycInfo = useSelector((s) => s.kyc.kycInfo);
  const privileges = useSelector((s) => s.kyc.privileges);
  const limitList = [
    { key: 'withDrawLimit', title: _t('kyc_homepage_withdraw'), unitKey: 'withdrawUnit' },
    { key: 'p2pLimit', title: _t('kyc_homepage_P2P'), unitKey: 'p2pUnit' },
    { key: 'trading', title: _t('kyc_homepage_trade') },
    { key: 'fiatLimit', title: _t('kyc_homepage_deposit') },
    { key: 'earnCoin', title: _t('kyc_homepage_earn') },
    { key: 'leverLimit', title: _t('kyc_homepage_leverage') },
  ];

  const currentLevel = useMemo(() => {
    // 假失败（verifyStatus=5（假失败）或（verifyStatus=1且regionType!=3(假失败)））
    // 假失败页面展示kyc1的权益
    if (
      kycInfo?.verifyStatus === 5 ||
      (kycInfo?.verifyStatus === 1 &&
        kycInfo?.regionType !== 3 &&
        kycInfo?.dismissCountryVerifyStatus === 1)
    ) {
      return 'kyc1';
    } else if (kycInfo?.verifyStatus === 1) {
      return 'kyc3';
    } else if (kycInfo?.intermediateVerifyStatus === 1) {
      return 'kyc2';
    } else if (kycInfo?.primaryVerifyStatus === 1) {
      return 'kyc1';
    } else {
      return 'kyc0';
    }
  }, [kycInfo]);

  return (
    <LimitsWrapper data-inspector="account_kyc_limits">
      <LimitsTitle>{_t('uBtahDK7ApTCpeKyQ3EC55')}</LimitsTitle>
      {Object.keys(privileges).length && Object.keys(kycInfo).length ? (
        <Table>
          <thead>
            <tr>
              <th>{_t('kyc_homepage_limit1')}</th>
              {currentLevel === 'kyc3' ? null : (
                <th>
                  <div className="currentTitleBox">
                    <span>{_t('kyc_homepage_limit21')}</span>
                    <Tag color="primary">{_t('kyc_homepage_limit22')}</Tag>
                  </div>
                </th>
              )}
              <th>{_t('kyc_homepage_limit3')}</th>
            </tr>
          </thead>
          <tbody>
            {limitList.map((item) => {
              const current = privileges?.[currentLevel] || {};
              let currentValue;
              const verified = privileges?.kyc3 || {};
              let verifiedValue;
              let hidden = false;
              if (['withDrawLimit', 'p2pLimit'].includes(item.key)) {
                if (+current[item.key] === -1 || +verified[item.key] === -1) hidden = true;
                currentValue = `${current[item.key]} ${current[item.unitKey]}`;
                verifiedValue = `${verified[item.key]} ${verified[item.unitKey]}`;
              } else if (['leverLimit'].includes(item.key)) {
                if (+current[item.key] === -2 || +verified[item.key] === -2) hidden = true;
                if (+current[item.key] === -1) currentValue = '-';
                else currentValue = _t('kyc_homepage_125x', { number: current[item.key] });
                if (+verified[item.key] === -1) currentValue = '-';
                else verifiedValue = _t('kyc_homepage_125x', { number: verified[item.key] });
              } else if (['fiatLimit'].includes(item.key)) {
                if (+current[item.key] === -2 || +verified[item.key] === -2) hidden = true;
                if (+current[item.key] === -1) currentValue = '-';
                else currentValue = <ICHookOutlined />;
                if (+verified[item.key] === -1) currentValue = '-';
                else verifiedValue = <ICHookOutlined />;
              } else if (['trading', 'earnCoin'].includes(item.key)) {
                currentValue = current[item.key] ? <ICHookOutlined /> : '-';
                verifiedValue = verified[item.key] ? <ICHookOutlined /> : '-';
              }
              return hidden ? null : (
                <tr key={item.key}>
                  <td>{item.title}</td>
                  {currentLevel === 'kyc3' ? null : <td>{currentValue}</td>}
                  <td>{verifiedValue}</td>
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
