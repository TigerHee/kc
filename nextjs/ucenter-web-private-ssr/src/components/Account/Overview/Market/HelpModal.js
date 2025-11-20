/**
 * Owner: willen@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import { useMarketMultiSiteConfig } from 'hooks/useMarketMultiSiteConfig';
import { find, keys, some } from 'lodash-es';
import { useSelector } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';

const HelpModalWrapper = styled(Dialog)`
  .KuxDialog-content {
    padding-bottom: 32px;
  }
`;
const ExtendLink = styled.a`
  display: block;
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;
`;
const HelpModal = ({ show, onCancel }) => {
  const { isSub = false } = useSelector((state) => state.user.user) || {};
  // 行情多站点配置 控制行情模块内部功能
  const { marketMultiSiteConfig } = useMarketMultiSiteConfig();

  // 是否支持币币交易
  const supportCoinTrading = some(keys(marketMultiSiteConfig), (key) => {
    if (marketMultiSiteConfig[key]?.subModules?.length) {
      return some(
        marketMultiSiteConfig[key].subModules,
        (subModule) => subModule?.operateConfig?.coinTrading,
      );
    }
    return marketMultiSiteConfig[key].operateConfig?.coinTrading;
  });

  // 是否支持机器人交易
  const supportRobotTrading = some(keys(marketMultiSiteConfig), (key) => {
    if (marketMultiSiteConfig[key]?.subModules?.length) {
      return some(
        marketMultiSiteConfig[key].subModules,
        (subModule) => subModule?.operateConfig?.robotTrading,
      );
    }
    return marketMultiSiteConfig[key].operateConfig?.robotTrading;
  });

  // 是否支持合约交易
  const supportFuture = some(keys(marketMultiSiteConfig), (key) => {
    if (marketMultiSiteConfig[key]?.subModules?.length) {
      const hasFuture = find(
        marketMultiSiteConfig[key].subModules,
        (subModule) => subModule.name === 'FUTURE' && subModule.open,
      );
      return !!hasFuture;
    }
    return false;
  });

  return (
    <HelpModalWrapper
      title={_t('4rAsd5Bj3UNBJiJvRan35X')}
      footer={null}
      open={show}
      onCancel={onCancel}
    >
      {supportCoinTrading && (
        <ExtendLink href={addLangToPath('/support/360015207073')} target="_blank">
          {_t('eQTALgKFPzWrTDtnChKrQH')}
        </ExtendLink>
      )}
      {isSub
        ? null
        : supportRobotTrading && (
          <ExtendLink href={addLangToPath('/support/7060533348761')} target="_blank">
            {_t('2k1URrBt8teK7mV4g7BabY')}
          </ExtendLink>
        )}
      {supportFuture && (
        <ExtendLink href={addLangToPath('/support/360039738293')} target="_blank">
          {_t('fucshuVb6D3M1tqighsi4f')}
        </ExtendLink>
      )}
    </HelpModalWrapper>
  );
};
export default HelpModal;
