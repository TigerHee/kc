/**
 * Owner: willen@kupotech.com
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
import { useEffect, useMemo } from 'react';
import dateToChartTimeMinute from 'utils/dateToChartTimeMinute';

Chart.register(LineController, LineElement, PointElement, LinearScale, Filler, CategoryScale);

function drawLine(theme, changeRate) {
  let chart = null;
  return function draw(x_data, y_data, id) {
    if (!chart) {
      const canvasId = document.getElementById(id);
      const context = canvasId.getContext('2d');
      context.lineWidth = 8;
      const gradient = context.createLinearGradient(0, 11, 0, 100);
      gradient.addColorStop(0, changeRate < 0 ? theme.colors.secondary8 : theme.colors.primary8);
      gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      try {
        chart = new Chart(canvasId, {
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
            animation: false,
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
      } catch (e) {}
    } else {
      chart.data.datasets[0].data = y_data;
      chart.data.labels = x_data;
      chart.update();
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
  [dir='rtl'] & {
    justify-content: flex-start;
  }
`;
const ChartCanvas = styled.canvas`
  width: 120px;
  height: 47px !important;
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

  return (
    <ChartWrapper>
      <ChartCanvas id={id} data-symbol={symbol} />
    </ChartWrapper>
  );
};
export default Card;
