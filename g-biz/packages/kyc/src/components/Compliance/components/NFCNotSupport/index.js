/**
 * Owner: tiger@kupotech.com
 * 不支持 NFC 设备提示
 */
import { styled, Button } from '@kux/mui';
import JsBridge from '@tools/bridge';
import { tenantConfig } from '@packages/kyc/src/config/tenant';
import warnIcon from './img/warn.svg';
import useLang from '../../../../hookTool/useLang';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 92px 24px 0;
  text-align: center;
  .warnIcon {
    width: 148px;
    height: 148px;
    margin-bottom: 24px;
  }
  .title {
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 130%;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
  }
  .desc {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.text60};
  }
  .link {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 44px;
    color: ${({ theme }) => theme.colors.primary};
  }
  .KuxButton-root {
    min-width: 220px;
  }
`;

export default () => {
  const { _t } = useLang();

  const onExitWebview = () => {
    JsBridge.open({
      type: 'func',
      params: {
        name: 'exit',
      },
    });
  };

  const onOpenSupport = () => {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${encodeURIComponent(tenantConfig.compliance.nfcExplainUrl)}`,
      },
    });
  };

  return (
    <Wrapper>
      <img className="warnIcon" src={warnIcon} alt="warnIcon" />
      <div className="title">{_t('ae77ab37a9c74000aa5e')}</div>
      <div className="desc">{_t('23f1405bb39c4000a775')}</div>

      {tenantConfig.compliance.nfcExplainUrl ? (
        <div className="link" onClick={onOpenSupport}>
          {_t('13e81d4870b94000abf8')}
        </div>
      ) : null}

      <Button size="large" onClick={onExitWebview}>
        {_t('45c0b5acc2c14000a626')}
      </Button>
    </Wrapper>
  );
};
