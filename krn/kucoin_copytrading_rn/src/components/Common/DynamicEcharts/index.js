import {LineChart, PieChart, ScatterChart} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import React, {forwardRef, memo, useEffect, useRef} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';
import SvgChart, {SVGRenderer} from '@wuba/react-native-echarts/svgChart';

const E_HEIGHT = 300;
const E_WIDTH = 375;

echarts.use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent,
  LegendComponent,
  VisualMapComponent,
  ScatterChart,
  PieChart,
  LineChart,
]);

const DynamicEcharts = forwardRef(props => {
  const {width = E_WIDTH, height = E_HEIGHT} = props;
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    let chart;
    chart = echarts.init(svgRef.current, 'light', {
      renderer: 'svg',
      width: parseFloat(width),
      height: parseFloat(height),
    });
    chart.setOption(props.option);
    props.initChart?.(chart);
    return () => {
      if (!chart) return;
      chart.dispose();
    };
  }, [props]);
  return (
    <View
      style={css`
        width: ${width};
        height: ${height};
      `}>
      <SvgChart ref={svgRef} />
    </View>
  );
});

export default memo(DynamicEcharts);
