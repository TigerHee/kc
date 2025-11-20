import useTranslation from '@/hooks/useTranslation';
import { useCurrencyStore } from '@/store/currency';
import { useUserStore } from '@/store/user';
import * as kunlun from '@kc/web-kunlun';
import { Button } from '@kux/design';
import { Button as MuiButton } from '@kux/mui-next';
import { Tooltip } from '@kux/design';
// import useTheme from '@/hooks/useTheme';
import { AddfavoritesIcon } from '@kux/iconpack';
import { CompliantBox, useCompliantShow } from 'gbiz-next/compliantCenter';
import { useEffect, useMemo } from 'react';
import styles from './styles.module.scss';

export default function HomePage() {
  const isLogin = useUserStore(state => state.isLogin);
  const user = useUserStore(state => state.user);
  const { t } = useTranslation();
  // const { theme } = useTheme();
  // const isDark = theme === 'dark';

  const show = useCompliantShow('compliance.signup.leftIndia.1');
  const { rates, prices, currency, currencyList } = useCurrencyStore();

  console.log('rates', rates);
  console.log('prices', prices);
  console.log('currency', currency);
  console.log('currencyList', currencyList);

  useEffect(() => {
    kunlun.report('home_page_view');
  }, []);

  const loginStatus = useMemo(() => {
    if (isLogin === void 0) {
      return '检测登录中...';
    }
    return isLogin ? `已登录, uid: ${user!.uid}` : '未登录';
  }, [isLogin, user]);

  return (
    <div>
      <p>Hello, KuCoin!</p>
      <p>目前登录状态：{loginStatus}</p>
      <p>{t('common:home.title')}</p>
      <p>{show ? 'show' : 'hide'}</p>
      <CompliantBox spm="compliance.signup.leftIndia.2">
        <p>CompliantBox</p>
      </CompliantBox>
      <Button type="primary">Button</Button>
      <MuiButton color="primary">MuiButton</MuiButton>
      <div>{/* 当前主题: {theme} */}</div>
      <div className={styles.test}>test</div>
      <AddfavoritesIcon style={{ color: '#8c8c8c' }} />

      <Tooltip placement="right" content="This is a tip." mobileTransform={false}>
        <button>this is a tooltip</button>
      </Tooltip>
    </div>
  );
}
