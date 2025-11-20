import Banner from '@/components/Banner';
import ProxyScript from '@/components/ProxyScript';
import DynamicRedPacket from '@/components/RedPacket/DynamicRedPacket';
import { useUserStore } from '@/store/user';
import { getTenantConfig } from '@/tenant';
import * as kunlun from '@kc/web-kunlun';
import { CompliantBox } from 'gbiz-next/compliantCenter';
import { IS_CLIENT_ENV } from 'kc-next/env';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import styles from './styles.module.scss';
import ErrorBoundary from '@/components/ErrorBoundary';
import { manualTrack } from '@/tools/ga';

const Markets = dynamic(() => import('@/components/Markets'), { ssr: false });
const Rewards = dynamic(() => import('@/components/Rewards'), { ssr: false });
const Trade = dynamic(() => import('@/components/Trade'), { ssr: false });
const ProductHighlights = dynamic(() => import('@/components/ProductHighlights'), { ssr: false });
const Security = dynamic(() => import('@/components/Security'), { ssr: false });
const Community = dynamic(() => import('@/components/Community'), { ssr: false });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false });
const DownloadGuidance = dynamic(() => import('@/components/DownloadGuidance'), { ssr: false });
const FixedArea = dynamic(() => import('@/components/FixedArea'), { ssr: false });
const DownloadBanner = dynamic(() => import('@/components/DownloadBanner'), { ssr: false });
const QuickStart = dynamic(() => import('@/components/QuickStart'), { ssr: false });

export default function HomePage() {
  const isLogin = useUserStore(state => state.isLogin);
  const tenantConfig = getTenantConfig();

  useEffect(() => {
    kunlun.report('home_page_view');
  }, []);

  useEffect(() => {
    if (typeof isLogin === 'boolean') {
      manualTrack(['page', '1'], {
        // 是否支持 passkey
        is_support_passkey: !!(
          navigator.credentials &&
          window.PublicKeyCredential
        ),
        is_login: isLogin,
      });
    }
  }, [isLogin]);

  useEffect(() => {
    // 获取用户登陆后是否为新用户
    if (isLogin) {
      import('gbiz-next/gps').then(mod => {
        mod.default();
      });
    }
  }, [isLogin]);

  return (
    <div className={styles.page}>
      {/* Banner */}
      <ErrorBoundary>
        <Banner />
      </ErrorBoundary>
      {/* 行情 */}
      <ErrorBoundary>
        <CompliantBox spm="compliance.homepage.topList.1">
          <Markets />
        </CompliantBox>
      </ErrorBoundary>
      {/* 奖励引导 */}
      {tenantConfig.showRewards && (
        <ErrorBoundary>
          <CompliantBox spm="compliance.homepage.stepGuide.1">
            <Rewards />
          </CompliantBox>
        </ErrorBoundary>
      )}
      {/* 交易 */}
      <ErrorBoundary>
        <CompliantBox spm="compliance.homepage.trade.1">
          <Trade />
        </CompliantBox>
      </ErrorBoundary>
      {/* 产品亮点 */}
      <ErrorBoundary>
        <CompliantBox spm="compliance.homepage.introduction.1">
          <ProductHighlights />
        </CompliantBox>
      </ErrorBoundary>
      {/* 安全 */}
      <ErrorBoundary>
        <Security />
      </ErrorBoundary>
      {/* 社区 */}
      <ErrorBoundary>
        <Community />
      </ErrorBoundary>
      {/* FAQ */}
      <ErrorBoundary>
        <CompliantBox spm="compliance.homepage.faq.1">
          <FAQ />
        </CompliantBox>
      </ErrorBoundary>
      {/* 下载引导 */}
      <ErrorBoundary>
        <CompliantBox spm="compliance.homepage.bottom.download">
          <DownloadGuidance />
        </CompliantBox>
      </ErrorBoundary>
      {/* 快速启动 */}
      <ErrorBoundary>
        <CompliantBox spm="compliance.homepage.startjourney.1">
          <QuickStart />
        </CompliantBox>
      </ErrorBoundary>
      {/* 右下角固定图标 */}
      <ErrorBoundary>
        <FixedArea />
      </ErrorBoundary>
      {/* 底部的下载浮窗 */}
      <ErrorBoundary>
        <CompliantBox spm="compliance.homepage.h5.topDownload">
          <DownloadBanner />
        </CompliantBox>
      </ErrorBoundary>
      {/* 红包 */}
      {IS_CLIENT_ENV && (
        <ErrorBoundary>
          <DynamicRedPacket />
        </ErrorBoundary>
      )}
      {tenantConfig.loadProxyScript && (
        <ErrorBoundary>
          <ProxyScript />
        </ErrorBoundary>
      )}
    </div>
  );
}
