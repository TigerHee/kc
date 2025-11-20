/**
 * Owner: jessie@kupotech.com
 */

import React, { useEffect, useMemo, useCallback, memo } from 'react';
import { useSelector } from 'dva';
import { map } from 'lodash';
import { useTheme } from '@kux/mui';
import SvgComponent from '@/components/SvgComponent';
import { useMarginGuide } from '@/pages/Chart/hooks/useMarginGuide';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import useSensorFunc from '@/hooks/useSensorFunc';
import useIsMargin from '@/hooks/useIsMargin';
import { _t } from 'utils/lang';
import { GUIDE_CONFIG } from './config';
import {
  Wrapper,
  MaxTooltip,
  ActionWrapper,
  Left,
  Right,
  NodeDivider,
  TipItem,
  Operation,
  StyledTooltipWrapper,
} from './style';
import withAuth from '@/hocs/withAuth';
import withMarginAuth from '@/hocs/withMarginAuth';

const LoginAuthButton = withAuth(({ children, ...restProps }) => (
  <a {...restProps}>{children}</a>
));

const MarginAuthButton = withMarginAuth(({ children, ...restProps }) => (
  <LoginAuthButton {...restProps}>{children}</LoginAuthButton>
));
const MarginGuide = () => {
  const { colors } = useTheme();
  const isMargin = useIsMargin();
  const tradeType = useTradeType();
  const sensorFunc = useSensorFunc();
  const currentSymbol = useGetCurrentSymbol();
  const {
    openMarginModal,
    openTransferModal,
  } = useMarginGuide();

  const currentLang = useSelector((state) => state.app.currentLang);
  const isolatedSymbolsMap = useSelector(
    (state) => state.symbols.isolatedSymbolsMap,
  );
  const { symbolName, maxLeverage: isolatedMaxLeverage } =
    isolatedSymbolsMap[currentSymbol] || {};

  // 交易杠杆曝光埋点
  useEffect(() => {
    sensorFunc(['marginStepTutorial', 'guide', 'expose']);
  }, [sensorFunc]);

  // 交易杠杆点击埋点
  const handleClickGuide = useCallback(() => {
    sensorFunc(['marginStepTutorial', 'guide', 'click']);
  }, [sensorFunc]);

  const Guides = useMemo(
    () => [
      {
        title: () => _t('trans.title'),
        tip: () => {
          return (
            <React.Fragment>
              <TipItem>
                {GUIDE_CONFIG[tradeType].transfer.tip1(symbolName)}
              </TipItem>
              <TipItem>
                {GUIDE_CONFIG[tradeType].transfer.tip2 &&
                  GUIDE_CONFIG[tradeType].transfer.tip2()}
              </TipItem>
              <Operation>
                <LoginAuthButton
                  className="textBtn"
                  onClick={openTransferModal}
                >
                  {_t('marginGuide.transfer.go')}
                </LoginAuthButton>
              </Operation>
            </React.Fragment>
          );
        },
      },
      {
        title: () => _t('marginGuide.borrow'),
        tip: () => {
          return (
            <React.Fragment>
              <TipItem>
                {GUIDE_CONFIG[tradeType].borrow.tip1(
                  symbolName,
                  isolatedMaxLeverage,
                )}
              </TipItem>
              <TipItem>{GUIDE_CONFIG[tradeType].borrow.tip2()}</TipItem>
              <Operation>
                <MarginAuthButton
                  className="textBtn"
                  onClick={() => openMarginModal(0, 'borrow')}
                >
                  {_t('marginGuide.borrow.go')}
                </MarginAuthButton>

              </Operation>
            </React.Fragment>
          );
        },
      },
      {
        title: () => _t('marginGuide.order'),
        tip: () => GUIDE_CONFIG[tradeType].order.tip1(),
      },
      {
        title: () => _t('margin.repay'),
        tip: () => {
          return (
            <React.Fragment>
              <TipItem>{GUIDE_CONFIG[tradeType].repay.tip1()}</TipItem>
              <Operation>
                <MarginAuthButton
                  className="textBtn"
                  onClick={() => openMarginModal(1, 'repay')}
                >
                  {_t('marginGuide.repay.go')}
                </MarginAuthButton>

              </Operation>
            </React.Fragment>
          );
        },
      },
    ],
    [
      openTransferModal,
      openMarginModal,
      tradeType,
    ],
  );

  if (!isMargin) return null;

  return (
    <Wrapper className="margin-guide">
      <Left>
        <span className="title">{_t('marginGuide.title')}</span>
        <div className="guides">
          {map(Guides, ({ title, tip }, index) => {
            return (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <NodeDivider>
                    <div />
                  </NodeDivider>
                )}
                <StyledTooltipWrapper
                  useUnderline
                  placement="top-end"
                  popperStyle={{ zIndex: 1000 }}
                  title={<MaxTooltip>{tip()}</MaxTooltip>}
                >
                  {title()}
                </StyledTooltipWrapper>
              </React.Fragment>
            );
          })}
        </div>
      </Left>
      <Right>
        <ActionWrapper
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClickGuide}
          href={GUIDE_CONFIG[tradeType].getGuideHref(currentLang)}
        >
          <SvgComponent
            type="novice-guide"
            fileName="chart"
            size={14}
            color={colors.icon}
          />
          {_t('marginGuide.link')}
        </ActionWrapper>
      </Right>
    </Wrapper>
  );
};

export default memo(MarginGuide);
