import useTheme from '@/hooks/useTheme';
import { getTenantConfig } from '@/tenant';
import Footer from 'gbiz-next/Footer';
import { getSiteConfig } from 'kc-next/boot';
import { getCurrentLang } from 'kc-next/i18n';

const CustomFooter = () => {
  const { theme } = useTheme();
  const currentLang = getCurrentLang();

  const styleConfig = { background: 'var(--kux-backgroundOverlay)' };

  const HOST = getSiteConfig();

  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    DOCS_HOST: HOST.DOCS_HOST, // 文档地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    MAINSITE_API_HOST: '/_api', // kucoin主站API地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
    TRADING_BOT_HOST: HOST.TRADING_BOT_HOST, // 机器人
  };

  console.log('footer theme', theme);

  return (
    <Footer
      currentLang={currentLang}
      styleConfig={styleConfig}
      {...hostConfig}
      theme={getTenantConfig().common.forceLightTheme ? 'light' : theme}
    />
  );
};

export default CustomFooter;
