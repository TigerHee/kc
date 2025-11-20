/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Footer } from '@kucoin-biz/footer';
import { useTheme } from '@kux/mui';
import config from 'config';
import HOST from 'utils/siteConfig';

const { v2ApiHosts } = config;

export default () => {
  const { currentLang } = useLocale();
  const theme = useTheme();
  const styleConfig = { background: theme.colors.overlay };
  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    DOCS_HOST: HOST.DOCS_HOST, // 文档地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    MAINSITE_API_HOST: v2ApiHosts.CMS, // kucoin主站API地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
    TRADING_BOT_HOST: HOST.TRADING_BOT_HOST, // 机器人
  };
  return (
    <Footer
      currentLang={currentLang}
      styleConfig={styleConfig}
      {...hostConfig}
      theme={theme.currentTheme}
    />
  );
};
