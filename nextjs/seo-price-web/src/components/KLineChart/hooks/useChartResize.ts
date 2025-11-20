/**
 * Owner: will.wang@kupotech.com
 */

import { IS_CLIENT } from "@/config/env";
import { useThrottleFn, useEventListener, useUpdateEffect } from "ahooks";
import { bootConfig } from "kc-next/boot";
import { IChartApi } from "lightweight-charts";
import { MutableRefObject } from "react";


export default (props: {
  chartRef: MutableRefObject<IChartApi | null>;
  domId: string;
  isSm: boolean;
}) => {
  const { chartRef, domId, isSm } = props;

  // 拖动容器重置表格size
  const resizeChart = useThrottleFn(() => {
    // learn_and_earn_card 计算k线区域剩余的宽度
    let rightDom = document.querySelector('#learn_and_earn_card');

    if (bootConfig._BRAND_SITE_ === 'TH') {
      rightDom = document.querySelector('#price-coin-rank');
    }

    const contentWrapper = document.querySelector('#price_content_wrapper');
    const dom = IS_CLIENT && document.getElementById(domId);

    if (rightDom && contentWrapper && dom && typeof window !== 'undefined') {
      const flexDirection = window.getComputedStyle(contentWrapper).flexDirection;
      let _width = dom.clientWidth;

      if (flexDirection === 'row') {
        _width = contentWrapper.clientWidth - rightDom.clientWidth - 50;
      }

      const _height = dom.offsetHeight;
      
      if (_width > 0 && _height > 0 && chartRef.current) {
        chartRef.current.resize(_width, _height);
      }
    }
  }, { wait: 100 });

  useEventListener('resize', resizeChart.run);

  useUpdateEffect(resizeChart.run, [isSm]);
}