/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import { styled } from '@/style/emotion';
import { Text, Flex } from 'Bot/components/Widgets';
import { _t, t } from 'Bot/utils/lang';
import { useSelector, useDispatch } from 'dva';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import StrategyPart, { useGetPart } from 'Bot/Strategies';
import { MIcons, SvgIcon } from 'Bot/components/Common/Icon';
import PreloaderWrapper from 'Bot/components/PreloaderWrapper.js';
// import OrderTab from 'Bot/components/Common/OrderTab';
// import BotLeaderBoard from '../BotLeaderBoard';
import StrategyLists from './StrategyLists';
import { jump } from 'Bot/helper';
import ErrorBoundary from 'src/components/CmsComs/ErrorBoundary';
import { useResponsive } from '@kux/mui';
import SymbolMatchCheckInCreate from './SymbolMatchCheckInCreate';


const Wrapper = styled.div`
  padding: 4px 12px 12px;
  height: 100%;
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${({ isMiddle }) => {
    if (isMiddle) {
      return 'padding-bottom: 95px;';
    }
  }}
  ${({ isFloat }) => {
    if (isFloat) {
      return 'overflow-x: hidden';
    }
  }}
`;

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`;
const CreateContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  ${({ isMin }) => {
    if (isMin) {
      return `.KuxForm-item div.KuxForm-itemHelp {
                min-height: unset;
              }`;
    }
  }}
`;
const CreateNav = ({ strategy, currentSymbol }) => {
  const dispatch = useDispatch();
  const routeToLists = () => {
    dispatch({
      type: 'BotStatus/backList',
    });
    // dispatch(routeToBotById(null, currentSymbol));
  };
  const config = useGetPart({ currentBot: strategy.id, part: 'config' });
  const jumpToturial = () => {
    let url = config?.toturial?.en_US;
    if (typeof url === 'object') {
      url = url.custom;
    }
    url && jump(url);
  };
  return (
    <Flex vc sb mt={8} mb={12}>
      <Flex vc onClick={routeToLists} cursor fs={12}>
        <MIcons.ArrowLeft color="icon" size="12" />
        <Text pl={4} color="text">
          {_t(strategy.lang)}
        </Text>
      </Flex>
      <SvgIcon
        color="icon"
        type="guide"
        fileName="botsvg"
        size={16}
        keepOrigin
        onClick={jumpToturial}
      />
    </Flex>
  );
};
const useSetHeight = (isMin) => {
  const wrapperRef = React.useRef();
  React.useEffect(() => {
    if (isMin && wrapperRef.current) {
      const parentBox = wrapperRef.current.closest('.KuxDrawer-content');
      if (parentBox) {
        wrapperRef.current.style.height = `${parentBox.clientHeight}px`;
      }
    }
  }, [isMin]);
  return wrapperRef;
};

/**
 * @description: 创建模块主入口
 * @param {*} React
 * @return {*}
 */
const CreateRouter = React.memo((props) => {
  const strategy = useSelector((state) => state.BotStatus.strategy);
  const currentSymbol = useGetCurrentSymbol();
  const [tab, setTab] = useState(0);
  const { sm, xs, lg } = useResponsive();
  const isMiddle = sm && !lg; // 中屏幕
  const isMin = !sm && xs; // 最小
  const wrapperRef = useSetHeight(isMin);

  // 列表和排行榜
  const ListAndLeaderBoard = (
    <>
      {/* <OrderTab
        label={_t('createstra')}
        label2={_t('tabpage4')}
        value={tab}
        onChange={setTab}
        mb={12}
      /> */}
      <Container className="bot-rank-container" >
        <StrategyLists currentSymbol={currentSymbol} moduleProps={props} />
      </Container>
      {/* <Container>
        {tab === 0 ? <StrategyLists currentSymbol={currentSymbol} /> : <BotLeaderBoard />}
      </Container> */}
    </>
  );
  // 创建区域
  const CreateArea = (
    <CreateContainer className="bot-create-container" isMin={isMin}>
      <CreateNav strategy={strategy} currentSymbol={currentSymbol} />
      <ErrorBoundary>
        <SymbolMatchCheckInCreate>
          <StrategyPart currentBot={strategy?.id} part="Create" />
        </SymbolMatchCheckInCreate>
      </ErrorBoundary>
    </CreateContainer>
  );

  return (
    <Wrapper
      className={`bot-create bot-create-wrapper ${props.isFloat ? 'bot-create-float-wrapper' : ''}`}
      isMiddle={isMiddle}
      ref={wrapperRef}
      isFloat={props.isFloat}
    >
      {strategy ? CreateArea : ListAndLeaderBoard}
    </Wrapper>
  );
});

export default (props) => {
  return (
    <PreloaderWrapper>
      <CreateRouter {...props} />
    </PreloaderWrapper>
  );
};
