/**
 * Owner: jessie@kupotech.com
 */

import { styled, useTheme } from '@kux/mui';
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';
import { dateToChartTimeMinute } from 'helper';
import React, { useEffect, useMemo } from 'react';

Chart.register(LineController, LineElement, PointElement, LinearScale, Filler, CategoryScale);
let chartObj = {};
function drawLine(theme, changeRate) {
  let chart = null;
  return function draw(x_data, y_data, id) {
    const canvasId = document.getElementById(id);
    const context = canvasId.getContext('2d');
    context.lineWidth = 8;
    const gradient = context.createLinearGradient(0, 11, 0, 100);
    gradient.addColorStop(0, changeRate < 0 ? theme.colors.secondary8 : theme.colors.primary8);
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    if (!chart) {
      chart = true;
      if (chartObj[id] instanceof Chart) {
        chartObj[id].destroy();
        console.log('chart destroy by update action');
      }
      try {
        chartObj[id] = new Chart(canvasId, {
          type: 'line',
          data: {
            labels: x_data,
            datasets: [
              {
                data: y_data,
                fill: 'start',
                backgroundColor: gradient,
              },
            ],
          },
          options: {
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
            layout: {
              padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
            },
            elements: {
              line: {
                borderWidth: 1,
                borderColor: changeRate < 0 ? theme.colors.secondary : theme.colors.primary,
              },
              point: {
                radius: 0,
              },
            },
          },
        });
      } catch (e) {
        console.error(e, 'error----');
      }
    } else {
      chartObj[id].data.datasets[0].data = y_data;
      chartObj[id].data.datasets[0].backgroundColor = gradient;
      (chartObj[id].options.elements.line.borderColor =
        changeRate < 0 ? theme.colors.secondary : theme.colors.primary),
        (chartObj[id].data.labels = x_data);
      chartObj[id].update();
    }
  };
}

const ChartWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  justify-content: flex-end;
`;
const ChartCanvas = styled.canvas`
  width: 100px !important;
  // height: 32px !important;
  height: 44px !important;
`;

const Card = (props) => {
  const { id, trend, changeRate, symbol } = props;
  const theme = useTheme();

  const draw = useMemo(() => drawLine(theme, changeRate), [theme, changeRate]);

  useEffect(() => {
    if (Array.isArray(trend) && trend.length) {
      let y_data = [],
        x_data = [];
      trend.map((i) => {
        y_data.push(i[1]);
        x_data.push(dateToChartTimeMinute(new Date(i[0] * 1000)));
      });
      draw(x_data, y_data, id);
    }
  }, [trend, id, draw]);

  // 组件销毁需要清理
  useEffect(() => {
    return () => {
      if (chartObj[id] instanceof Chart) {
        chartObj[id]?.destroy();
        delete chartObj[id];
        console.log('chart destroy by component lifecycle');
      }
    };
  }, []);

  return (
    <ChartWrapper>
      <ChartCanvas id={id} data-symbol={symbol} />
    </ChartWrapper>
  );
};
export default React.memo(Card, function areEqual(prevProps, nextProps) {
  // true 抑制， false 让他更新
  const old = Number(prevProps.changeRate) < 0;
  const now = Number(nextProps.changeRate) < 0;
  const isChangeRateNotChange = old === now && nextProps.changeRate !== undefined;
  const isTrendNotChange = prevProps.trend === nextProps.trend && nextProps.trend.length > 0;
  if (isChangeRateNotChange && isTrendNotChange) {
    return true;
  }
  return false;
});
