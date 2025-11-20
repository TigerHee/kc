/*
  * owner: borden@kupotech.com
 */
import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { ICMoreOutlined } from '@kux/icons';
import { useSelector } from 'dva';
import { partition } from 'lodash';
import Dropdown from '@mui/Dropdown';
import useIsMargin from '@/hooks/useIsMargin';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import { deepEqual } from 'src/utils/tools';
import PriceInfo from './PriceInfo';
import StatisticsInfo from './StatisticsInfo';
import ManagementFee from './ManagementFee';
import useRealTimeMarketInfo from './useRealTimeMarketInfo';
import ReferRate from './ReferRate';

/** 样式开始 */
const StyledStatisticsInfo = styled(StatisticsInfo)`
  margin-left: 24px;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
`;
const CICMoreOutlined = styled(ICMoreOutlined)`
  fill: ${({ theme }) => theme.colors.icon};
  cursor: pointer;
  &:hover {
    fill: ${({ theme }) => theme.colors.text};
  }
`;
const Overlay = styled.div`
  min-width: 240px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 14px;
  transform: translateY(18px);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.layer};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  & > .infobar-market-info {
    padding: 12px;
    margin-left: 0;
    display: flex;
    justify-content: space-between;
  }
`;
/** 样式结束 */

const renderGroup = (group, props) =>
  group.map((v) => (v.isHide ? null : v.render(props)));

const InfoGroup = React.memo(({ low, vol, high, volValue }) => {
  const etfCoin = useEtfCoin();
  const isMargin = useIsMargin();
  const infoBarMediaFlag = useSelector(state => state.setting.infoBarMediaFlag);
  const infoGroup = [
    {
      foldIndex: 4,
      render: (props) => <StyledStatisticsInfo key="high" {...high} {...props} />,
    },
    {
      foldIndex: 3,
      render: (props) => <StyledStatisticsInfo key="low" {...low} {...props} />,
    },
    {
      foldIndex: 2,
      render: (props) => <StyledStatisticsInfo key="vol" {...vol} {...props} />,
    },
    {
      foldIndex: 1,
      render: (props) => <StyledStatisticsInfo key="volValue" {...volValue} {...props} />,
    },
    {
      isHide: !isMargin, // 隐藏条件
      foldIndex: 5, // 折叠顺序
      render: (props) => <ReferRate key="referRate" {...props} />,
    },
    {
      isHide: !etfCoin,
      foldIndex: 5,
      render: (props) => <ManagementFee key="dailyManageFee" {...props} />,
    },
  ];
  if (infoBarMediaFlag > 0) {
    const [foldGroup, displayGroup] = partition(
      infoGroup,
      (v) => (v.foldIndex <= infoBarMediaFlag),
    );
    return (
      <Fragment>
        {renderGroup(displayGroup)}
        <span className="ml-16">
          <Dropdown
            holdDropdown
            trigger="hover"
            disablePortal={false}
            placement="bottom-end"
            overlay={
              <Overlay>
                {renderGroup(foldGroup, {
                  isFold: true,
                  className: 'infobar-market-info',
                })}
              </Overlay>
            }
          >
            <CICMoreOutlined size={16} />
          </Dropdown>
        </span>
      </Fragment>
    );
  }
  return renderGroup(infoGroup);
}, deepEqual);

const RealTimeMarketInfo = () => {
  const {
    low,
    vol,
    high,
    volValue,
    changeRate,
    changePrice,
    lastDealPrice,
  } = useRealTimeMarketInfo();

  return (
    <Container>
      <PriceInfo
        price={lastDealPrice}
        changeRate={changeRate}
        changePrice={changePrice}
      />
      <InfoGroup low={low} vol={vol} high={high} volValue={volValue} />
    </Container>
  );
};

export default RealTimeMarketInfo;

export { default as ReferRate } from './ReferRate';
export { default as PriceInfo } from './PriceInfo';
export { default as ManagementFee } from './ManagementFee';
export { default as StatisticsInfo } from './StatisticsInfo';
export { default as useRealTimeMarketInfo } from './useRealTimeMarketInfo';
