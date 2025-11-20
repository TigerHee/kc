import {useMemo} from 'react';
import {useTheme} from '@krn/ui';

export const OTHER_COIN_COLOR = 'rgba(140, 140, 140, 0.40)';
export const SORT_COLORS = [
  '#01BC8D',
  '#D3F475',
  '#45B0FC',
  '#F8B200',
  '#9A60B4',
];
export const colorList = [...SORT_COLORS, OTHER_COIN_COLOR];

export const useMakeOption = ({list}) => {
  const {colorV2} = useTheme();

  const preferencePieOption = useMemo(() => {
    const data = list.map(i => ({
      value: i?.percent,
      name: i?.currency,
      color: i?.color,
    }));

    return {
      legend: {
        show: false,
      },
      series: [
        {
          // 设置每个扇区的颜色
          itemStyle: {
            normal: {
              color: function (resp) {
                return resp?.data?.color;
              },
            },
          },

          type: 'pie',
          radius: ['64%', '88%'],
          center: ['50%', '48%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            position: 'center',
            label: {
              formatter: params => {
                const {data, percent} = params;

                return `{a|${data.name}}` + '\n' + `{b|${percent}%}`;
              },
              rich: {
                a: {
                  color: colorV2.text40,
                  fontSize: 14,
                  lineHeight: 30,
                },
                b: {
                  color: colorV2.text,
                  fontWeight: 'bold',
                  fontSize: 14,
                },
              },
              show: true,
            },
          },
          labelLine: {
            show: false,
          },
          tooltip: {
            trigger: 'item',
          },
          data,
        },
      ],
    };
  }, [colorV2.text, colorV2.text40, list]);
  return preferencePieOption;
};
