/**
 * Owner: sheldon.ye@kupotech.com
 * @description: WEB3 入口切换组件
 * @since: 2025/02/19
 */
import React, { useEffect, useMemo } from 'react';
import { useCompliantShowWithInit } from '@packages/compliantCenter';
import { useLang } from '../../hookTool';
import { addLangToPath, kcsensorsClick } from '../../common/tools';
import { WEB3_ENTRANCE_TAB_SPM } from '../config';
import { TabContainer, TabItem, TabItemBox } from './styled';
import { MarginWrapper } from '../styled';

// 神策 AB 实验配置值

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

  const { init: compliantInitTag, show: showByCompliant } = useCompliantShowWithInit(
    WEB3_ENTRANCE_TAB_SPM,
  );

  const { t } = useLang();

  const navigateToWeb3Home = () => {
    kcsensorsClick(['web3WalletPageSwitch', '0']);
    const targetUrl = addLangToPath('/web3', lang);
    window.location.href = targetUrl;
  };

  // 根据【展业规则】计算是否可以渲染【WEB3 入口】
  const renderWeb3Entrance = useMemo(() => {
    // 没有初始化完毕
    if (!compliantInitTag) {
      // 没有则返回加载中状态
      return WEB3_ENTRANCE_RENDER_STATUS.INIT;
    }
    // 返回计算结果
    return showByCompliant ? WEB3_ENTRANCE_RENDER_STATUS.SHOW : WEB3_ENTRANCE_RENDER_STATUS.HIDE;
  }, [showByCompliant, compliantInitTag]);

  // 菜单栏蒙层控制逻辑
  useEffect(() => {
    // 不是处于加载状态则消除蒙层
    if (renderWeb3Entrance !== WEB3_ENTRANCE_RENDER_STATUS.INIT) {
      onInitFinishHandle && onInitFinishHandle();
    }
  }, [renderWeb3Entrance, onInitFinishHandle]);

  return (
    <>
      {/* 规则一：是否为灰度用户 */}
      {renderWeb3Entrance === WEB3_ENTRANCE_RENDER_STATUS.SHOW && (
        // 规则二：展业控制
        <MarginWrapper mt={mt} mb={mb} ml={ml} mr={mr}>
          <TabContainer inDrawer={inDrawer}>
            <TabItemBox inDrawer={inDrawer} padding="4px 0 4px 4px">
              <TabItem inDrawer={inDrawer} active>
                {t('cex_header_exchange_text')}
              </TabItem>
            </TabItemBox>
            <TabItemBox inDrawer={inDrawer} padding="4px 4px 4px 0" onClick={navigateToWeb3Home}>
              <TabItem inDrawer={inDrawer}>{t('cex_header_web3_text')}</TabItem>
            </TabItemBox>
          </TabContainer>
        </MarginWrapper>
      )}
    </>
  );
}
