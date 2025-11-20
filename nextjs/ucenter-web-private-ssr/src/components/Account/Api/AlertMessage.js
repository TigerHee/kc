/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import { tenantConfig } from 'config/tenant';
import React from 'react';
import { _t, _tHTML } from 'tools/i18n';
import { IP_LIMIT_COUNT, USE_TYPES } from './constants';

const AlertBox = styled.div`
  padding: 16px;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 12px;
  margin-bottom: 40px;
  > h3 {
    margin: 0 0 7px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
  }

  p {
    position: relative;
    margin: 0 0 6px;
    padding: 0 12px 0;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;

    a {
      color: rgba(1, 188, 141, 1);
    }

    &::before {
      position: absolute;
      top: 7px;
      left: 0;
      width: 4px;
      height: 4px;
      background: ${(props) => props.theme.colors.text60};
      border-radius: 4px;
      content: '';
    }
  }

  .warning {
    color: rgba(251, 166, 41, 1);
  }
`;

const AlertMessage = ({ useType, isLeadTradeApi }) => {
  return (
    <AlertBox>
      <p>{_tHTML('api.intro', { href: tenantConfig.api.docsUrl })}</p>
      <p>{_t('api.tip0', { num: isLeadTradeApi ? 5 : 20 })}</p>
      {useType === USE_TYPES.API ? (
        <React.Fragment>
          <p className="warning">{_t('api.tip1')}</p>
          {!isLeadTradeApi ? (
            <>
              <p className="warning">{_t('api.tip2')}</p>
              <p>{_t('api.tip3')}</p>
            </>
          ) : null}
          <p>{_t('api.tip4', { num: IP_LIMIT_COUNT })}</p>
          {!isLeadTradeApi ? <p>{tenantConfig.api.alertDesc(_t)}</p> : null}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p className="warning">{_t('1535z2EaStB65Hac8tofgG')}</p>
          <p>{_t('n3BEBt2hW1mS98P94FqDdg')}</p>
        </React.Fragment>
      )}
    </AlertBox>
  );
};

export default React.memo(AlertMessage);
