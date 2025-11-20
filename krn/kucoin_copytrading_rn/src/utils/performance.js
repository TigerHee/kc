import {useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import {safeBridge} from '@krn/toolkit';

import {useRoute} from 'hooks/hybridNavigation';
import useLayout from 'hooks/useLayout';
import useTracker from 'hooks/useTracker';
import {dependencies} from '../../package.json';

let _globalInitStartTime; // 全局变量，记录应用初始化开始时间
let _globalTriggerNavigationRouterStartTime; // 全局变量，记录导航路由触发开始时间

const MEASURE_PERFORMANCE_LCP_SENSOR_PAGE_ID = 'B20CopyTradePerformanceLCP'; // 页面性能测量标识符

export class MeasureTTIHelper {
  // 初始化开始时间
  static initStart() {
    const enterTime = new Date().getTime();
    _globalInitStartTime = enterTime;
  }

  // 标记导航路由开始时间
  static markNavigationRouterStart() {
    const preEnterStartTime = new Date().getTime();
    _globalTriggerNavigationRouterStartTime = preEnterStartTime;
  }
}

// 自定义 Hook，用于测量页面元素的 TTI（可交互时间）
export const useMeasureElementTTI = () => {
  const [layout, handlePageRootLayout] = useLayout(); // 获取页面布局信息
  const time = useRef(0); // 用于记录是否已经测量过
  const {name} = useRoute(); // 获取当前路由名称
  const {onCustomEvent} = useTracker(); // 获取自定义事件触发方法

  useEffect(() => {
    // 首次 react commit 页面根节点阶段时间
    if (name && layout.width > 50 && !time.current) {
      const isNavigationOperation = !!_globalTriggerNavigationRouterStartTime; // 判断是否是导航操作 为空表示MPA启动新RN 容器进入页面

      // 新启动 rn 容器时 调用原生上报页面加载 TTI
      if (!isNavigationOperation) {
        safeBridge.onPageMount(name);
      }

      time.current += 1; // 标记已经测量过
      const renderContentTime = new Date().getTime(); // 获取当前时间
      // 根据是否是路由导航操作，选择不同的开始时间
      const startTime = isNavigationOperation
        ? _globalTriggerNavigationRouterStartTime
        : _globalInitStartTime;
      const diffTime = renderContentTime - startTime; // 计算时间差

      // 触发自定义事件，记录性能数据
      onCustomEvent('expose', {
        pageId: MEASURE_PERFORMANCE_LCP_SENSOR_PAGE_ID,
        properties: {
          diffTime,
          isNavigationOperation,
          route: name,
          platform: Platform.OS,
          rnVersion: dependencies?.['react-native'],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, name]);

  return {
    handlePageRootLayout, // 返回处理页面根布局的方法
  };
};
