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
import { _t } from 'tools/i18n';

const colors = [
  '#00A87E',
  '#01BC8D',
  '#00D7A1',
  '#1FDB8C',
  '#3FE997',
  '#71D5A5',
  '#18D8C1',
  '#00D7CA',
  '#01BCBC',
  '#00A3A3',
  '#008FA2',
  '#00789E',
];
const Wrapper = styled.div`
  width: 100%;
`;

const Content = styled.div`
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 20px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    justify-content: center;
    margin-bottom: 0;
  }
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 24px;
  line-height: 31px;
  color: #e1e8f5;
  margin-bottom: 20px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    font-size: 20px;
    line-height: 26px;
  }
`;

const Left = styled.div`
  width: 340px;
  height: 340px;
  margin: 0 80px 0 -17px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0 70px 0 -17px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 234px;
    height: 234px;
    margin: 0 0 40px 0;
  }
`;
const Right = styled.div`
  width: 360px;
  flex: 1;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

const Item = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #e1e8f5;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    line-height: 18px;
  }
`;

const ItemName = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 14px;
  font-weight: 500;

  > div {
    width: 12px;
    min-width: 12px;
    max-width: 12px;
    height: 12px;
    margin-right: 10px;
    border-radius: 12px;
  }
`;

const TokenAllocation = () => {
  const { currentLang } = useLocale();
  const { releaseSchedule = [] } = useSelector((state) => state.spotlight.detailInfo, shallowEqual);
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
              fontSize: 14,
              align: 'right',
              verticalAlign: 'bottom',
              color: '#181e29',
            },
            itemStyle: {
              borderRadius: 0,
              borderColor: '#181e29',
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
  }, [currentLang, releaseSchedule, getColor]);

  // 饼图响应式
  const onResize = useCallback(() => {
    if (!chartRef.current) {
      return;
    }
    chartRef.current.resize();
  }, []);

  return !releaseSchedule?.length ? null : (
    <Wrapper>
      <Title>{_t('suXfVRr5zYCUFtcENsVuAx')}</Title>
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
                <span>
                  <NumberFormat lang={currentLang} options={{ style: 'percent' }}>
                    {divide(percentage || '0', 100)}
                  </NumberFormat>
                </span>
              </Item>
            );
          })}
        </Right>
      </Content>
    </Wrapper>
  );
};

export default memo(TokenAllocation);
