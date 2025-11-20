/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat, ResizeObserver, styled } from '@kux/mui';
import NumberFormatUtil from '@kux/mui/utils/numberFormat.js';
import * as echarts from 'echarts';
import { divide } from 'helper';
import map from 'lodash/map';
import { memo, useCallback, useEffect, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import chartSvg from 'static/spotlight8/chart.svg';
import chartLightSvg from 'static/spotlight8/chartLight.svg';
import { _t } from 'tools/i18n';
import Title from './Title';

const colors = [
  '#85D186',
  '#5A91FC',
  '#FAC23F',
  '#EF87D2',
  '#7C7FB2',
  '#FFA6A6',
  '#01BC8D',
  '#EC7C46',
  '#98C6FF',
  '#5089F8',
  '#85E2FF',
  '#9589FF',
  '#00A87E',
  '#01BC8D',
  '#00D7A1',
  '#1FDB8C',
  '#3FE997',
];

const Wrapper = styled.section`
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${(props) => props.theme.breakpoints.down('lg')} {
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    justify-content: center;
    margin-bottom: 0;
  }
`;

const Left = styled.div`
  width: 356px;
  height: 356px;
  margin: 0 120px 0 -17px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0 48px 0 -17px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 240px;
    height: 240px;
    margin: 0 0 16px 0;
  }
`;
const Right = styled.div`
  max-width: 480px;
  flex: 1;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    max-width: 100%;
  }
`;

const ItemOld = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  ${(props) => props.theme.breakpoints.down('lg')} {
    justify-content: space-between;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    font-size: 14px;
  }
`;

const Item = styled.div`
  min-height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  border: 1px solid ${(props) => props.theme.colors.divider4};
  border-bottom: none;
  color: ${(props) => props.theme.colors.text};

  &:nth-of-type(2n) {
    background: ${(props) => props.theme.colors.cover2} !important;
  }

  &:first-of-type {
    border-radius: 12px 12px 0px 0px;
  }

  &:last-of-type {
    border-bottom: 1px solid ${(props) => props.theme.colors.divider4};
    border-radius: 0px 0px 12px 12px;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    justify-content: space-between;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const ItemName = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  height: 100%;
  padding: 11px 23px;
  color: ${(props) => props.theme.colors.text};
  border-right: 1px solid ${(props) => props.theme.colors.divider4};

  > div {
    width: 10px;
    min-width: 10px;
    max-width: 10px;
    height: 10px;
    margin-right: 10px;
    border-radius: 2px;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    flex: 1;
    > div {
      margin-right: 8px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 11px 15px;
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  padding: 11px 23px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 11px 15px;
  }
`;

const TokenAllocation = () => {
  const { currentLang } = useLocale();
  const { releaseSchedule = [] } = useSelector(
    (state) => state.spotlight8.detailInfo,
    shallowEqual,
  );
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  const ref = useRef(null);
  const chartRef = useRef();

  const getColor = useCallback((index) => colors[index] || colors[index % 10 || 0], []);

  useEffect(() => {
    if (ref.current) {
      const dataSource = map(releaseSchedule, (item) => {
        return {
          value: +item.percentage,
          name: item.title,
        };
      });
      const option = {
        series: [
          {
            name: 'Token Allocation',
            type: 'pie',
            radius: ['55%', '90%'],
            left: 0,
            bottom: 0,
            avoidLabelOverlap: false,
            label: {
              position: 'inner',
              formatter: (params) =>
                NumberFormatUtil({
                  lang: currentLang,
                  number: divide(params.data.value || '0', 100),
                  options: { style: 'percent' },
                }),
              rotate: 0,
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontSize: 12,
              align: 'right',
              verticalAlign: 'bottom',
              color: currentTheme === 'dark' ? '#181e29' : '#ffffff',
            },
            itemStyle: {
              borderRadius: 0,
              borderColor: currentTheme === 'dark' ? '#181e29' : '#ffffff',
              borderWidth: dataSource?.length > 1 ? 2 : 0,
              color: ({ dataIndex }) => getColor(dataIndex),
            },
            labelLine: {
              show: false,
            },
            data: dataSource,
          },
        ],
      };
      if (!chartRef.current) {
        chartRef.current = echarts.init(ref.current);
      }
      chartRef.current.setOption(option);
    }
  }, [currentLang, releaseSchedule, currentTheme, getColor]);

  // 饼图响应式
  const onResize = useCallback(() => {
    if (!chartRef.current) {
      return;
    }
    chartRef.current.resize();
  }, []);

  return !releaseSchedule?.length ? null : (
    <Wrapper>
      <Title
        title={_t('suXfVRr5zYCUFtcENsVuAx')}
        icon={currentTheme === 'dark' ? chartSvg : chartLightSvg}
      />
      <Content>
        <ResizeObserver onResize={onResize}>
          <Left ref={ref} />
        </ResizeObserver>
        <Right>
          {map(releaseSchedule, ({ title, percentage }, index) => {
            return (
              <Item key={`allocationItem_${index}`}>
                <ItemName>
                  <div style={{ background: getColor(index) }} />
                  {title}
                </ItemName>
                <ItemContent>
                  <NumberFormat lang={currentLang} options={{ style: 'percent' }}>
                    {divide(percentage || '0', 100)}
                  </NumberFormat>
                </ItemContent>
              </Item>
            );
          })}
        </Right>
      </Content>
    </Wrapper>
  );
};

export default memo(TokenAllocation);
