/**
 * Owner: sheldon.ye@kupotech.com
 * @description: WEB3 入口切换组件
 * @since: 2025/02/19
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Empty, Modal, Stack, useTheme } from '@kux/design';
import clsx from 'clsx';
import { useCompliantShowWithInit } from 'packages/compliantCenter';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import { kcsensorsClick } from '../../common/tools';
import { WEB3_ENTRANCE_TAB_SPM } from '../config';
import styles from './styles.module.scss';
import { usePageProps } from 'provider/PageProvider';
import { useTenantConfig } from 'packages/header/tenantConfig';

// WEB3 入口渲染状态
const WEB3_ENTRANCE_RENDER_STATUS = {
  // 初始化数据【展业/神策】
  INIT: 'INIT',
  // 展示 WEB3 入口
  SHOW: 'SHOW',
  // 隐藏 WEB3 入口
  HIDE: 'HIDE',
};

export default function EntranceTab(props) {
  const { lang, mt = 0, mb = 0, ml = 0, mr = 0, onInitFinishHandle, inDrawer = false } = props;
  const [renderWeb3Entrance, setRenderWeb3Entrance] = useState(WEB3_ENTRANCE_RENDER_STATUS.INIT);
  const [isWeb3ConfirmShow, setIsWeb3ConfirmShow] = useState(false);
  const { init: compliantInitTag, show: showByCompliant } = useCompliantShowWithInit(WEB3_ENTRANCE_TAB_SPM);
  const { t } = useTranslation('header');
  const theme = usePageProps()?.theme;
  const tenantConfig = useTenantConfig();
  const navigateToWeb3Home = () => {
    kcsensorsClick(['web3WalletPageSwitch', '0']);
    const targetUrl = addLangToPath('/web3');
    window.location.href = targetUrl;
  };

  // 根据【展业规则】计算是否可以渲染【WEB3 入口】
  useEffect(() => {
    // 没有初始化完毕
    if (!compliantInitTag) {
      // 没有则返回加载中状态
      setRenderWeb3Entrance(WEB3_ENTRANCE_RENDER_STATUS.INIT);
    }
    // 返回计算结果
    setRenderWeb3Entrance(showByCompliant ? WEB3_ENTRANCE_RENDER_STATUS.SHOW : WEB3_ENTRANCE_RENDER_STATUS.HIDE);
  }, [showByCompliant, compliantInitTag]);

  // 菜单栏蒙层控制逻辑
  useEffect(() => {
    // 不是处于加载状态则消除蒙层
    if (renderWeb3Entrance !== WEB3_ENTRANCE_RENDER_STATUS.INIT) {
      onInitFinishHandle && onInitFinishHandle();
    }
  }, [renderWeb3Entrance, onInitFinishHandle]);

  /**
   * EU 站跳 web3 的时候弹出提示确认框
   */
  function handelWeb3Click() {
    if (tenantConfig.isNeedWeb3Confirm) {
      setIsWeb3ConfirmShow(true);
      return;
    }
    navigateToWeb3Home();
  }

  return (
    <>
      {/* 规则一：是否为灰度用户 */}
      {renderWeb3Entrance === WEB3_ENTRANCE_RENDER_STATUS.SHOW && (
        // 规则二：展业控制
        <div style={{ marginTop: mt || 0, marginBottom: mb || 0, marginLeft: ml || 0, marginRight: mr || 0 }}>
          <section
            className={clsx(styles.tabContainer, inDrawer && theme === 'dark' && styles.tabContainerDarkInDrawer)}
          >
            <div className={styles.tabItemBox}>
              <span
                className={clsx(
                  styles.tabItem,
                  styles.tabItemActive,
                  inDrawer && theme === 'dark' && styles.tabItemActive1
                )}
              >
                {/*只改 EU 站 Header 不让出现交易所，其他地方不该 */}
                {tenantConfig.getEntranceTabBrandName(t)}
              </span>
            </div>
            <div className={clsx(styles.tabItemBox, styles.tabItemBoxRight)} onClick={handelWeb3Click}>
              <span className={styles.tabItem}>{t('cex_header_web3_text')}</span>
            </div>
          </section>
          {/* 交易所跳 web3 确认弹窗 */}
          <Modal
            okText={t('9b4dfbebe3fb4800a09c')}
            cancelText={t('54798ed4f8604800a2e2')}
            isOpen={isWeb3ConfirmShow}
            onClose={() => {
              setIsWeb3ConfirmShow(false);
            }}
            onCancel={() => {
              setIsWeb3ConfirmShow(false);
            }}
            onOk={() => {
              navigateToWeb3Home();
              setIsWeb3ConfirmShow(false);
            }}
          >
            <Stack direction="vertical" spacing="small">
              <Empty name="prompt" size="small" />
              <span className={styles.goWeb3ConfirmTitle}>{t('5977f710334a4000ab7c')}</span>
              <span style={{ textAlign: 'center' }}>{t('a12c5c6f12014800a335')}</span>
            </Stack>
          </Modal>
        </div>
      )}
    </>
  );
}
