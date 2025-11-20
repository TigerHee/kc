/*
 * owner: borden@kupotech.com
 */
import React, { useContext, Fragment } from 'react';
import { useDispatch, useSelector } from 'dva';
import { useTheme } from '@emotion/react';
import { useResponsive, ThemeProvider } from '@kux/mui';
import { ICDepositOutlined, ICTransferOutlined } from '@kux/icons';
import { siteCfg } from 'config';
import { readableNumber } from '@/utils/format';
import { _t } from 'src/utils/lang';
import withAuth from '@/hocs/withAuth';
import useMarginModel from '@/hooks/useMarginModel';
import useAvailableBalance from '@/hooks/useAvailableBalance';
import useIsMargin from '@/hooks/useIsMargin';
import SvgComponent from '@/components/SvgComponent';
import LeverageSetting from '@/components/Margin/LeverageSetting';
import useSensorFunc from '@/hooks/useSensorFunc';
import useOrderCurrency from '../../../../hooks/useOrderCurrency';
import useSide from '../../../../hooks/useSide';
import { openPage, list2map } from '../../../../utils';
import { WrapperContext } from '../../../../config';
import { isDisplayFeeInfo } from '@/meta/multiTenantSetting';
import {
  Label,
  CenterBox,
  Avaliable,
  Container,
  TooltipBody,
  OverlayLabel,
  TooltipTitle,
  TooltipContent,
  TooltipBodyLabel,
  TooltipBodyValue,
  DropdownExtend,
  DropdownLabelIcon,
  StyledTooltipWrapper,
  StyledDropdownSelect,
} from './style';

const { KUCOIN_HOST } = siteCfg;

const configs = [
  {
    value: 'transfer',
    label: () => (
      <Fragment>
        <ICTransferOutlined />
        <OverlayLabel>{_t('transfer.s')}</OverlayLabel>
      </Fragment>
    ),
    handle: ({ dispatch, currency }) => {
      dispatch({
        type: 'transfer/updateTransferConfig',
        payload: {
          visible: true,
          initCurrency: currency,
        },
      });
    },
  },
  {
    value: 'deposit',
    label: () => (
      <Fragment>
        <ICDepositOutlined size={16} />
        <OverlayLabel>{_t('deposit')}</OverlayLabel>
      </Fragment>
    ),
    handle: ({ currency }) => {
      openPage(`${KUCOIN_HOST}/assets/coin/${currency}`);
    },
  },
  ...(isDisplayFeeInfo()
    ? [
        {
          value: 'buy_crypto',
          label: () => (
            <Fragment>
              <SvgComponent fileName="orderForm" type="buy_crypto" size={16} />
              <OverlayLabel>{_t('drop.one.button')}</OverlayLabel>
            </Fragment>
          ),
          handle: () => {
            openPage(`${KUCOIN_HOST}/express`);
          },
        },
      ]
    : []),
];
const configsMap = list2map(configs);

const DropdownLabel = withAuth((props) => (
  <DropdownLabelIcon size={14} type="plus" fileName="orderForm" {...props} />
));

const AvaliableBar = React.memo(() => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { side } = useSide();
  const { sm } = useResponsive();
  const screen = useContext(WrapperContext);
  const { userLeverage } = useMarginModel(['userLeverage']);
  const orderCurrency = useOrderCurrency({ side });
  const { currency, currencyName } = orderCurrency;
  const isLogin = useSelector((state) => state.user.isLogin);
  const { isCanBorrow, borrowSize, availableBalance, maxAvailableBalance } = useAvailableBalance({
    currency,
  });
  const isMargin = useIsMargin();
  const sensorFunc = useSensorFunc();

  const isMd = screen === 'md';

  const handleChange = (v) => {
    sensorFunc(['spotTrading', 'transferDeposit']);
    configsMap[v].handle({ currency, dispatch });
  };

  return (
    <Container>
      <Label>
        <CenterBox>
          {isMargin ? (
            <StyledTooltipWrapper
              isTip
              size="small"
              useUnderline
              title={
                <ThemeProvider theme="dark">
                  <TooltipContent>
                    <TooltipTitle>
                      {isCanBorrow ? _t('eaa6b7e6848c4000a441') : _t('15f37bd8021b4000acd3')}
                    </TooltipTitle>
                    <TooltipBody className={!sm ? 'mt-20' : 'mt-8'}>
                      <TooltipBodyLabel>{_t('0a2a6d2297fa4000a573')}</TooltipBodyLabel>
                      <TooltipBodyValue>
                        {readableNumber(availableBalance)} {currencyName}
                      </TooltipBodyValue>
                    </TooltipBody>
                    {isCanBorrow && (
                      <TooltipBody className={!sm ? 'mt-10' : 'mt-4'}>
                        <TooltipBodyLabel>
                          {_t('a2219bac01584000a645', { userLeverage })}
                        </TooltipBodyLabel>
                        <TooltipBodyValue>
                          {readableNumber(borrowSize)} {currencyName}
                        </TooltipBodyValue>
                      </TooltipBody>
                    )}
                  </TooltipContent>
                </ThemeProvider>
              }
            >
              {_t('bv4u5WW4GNncSY7BfkJmus')}
            </StyledTooltipWrapper>
          ) : (
            _t('bv4u5WW4GNncSY7BfkJmus')
          )}
        </CenterBox>
        {!isMd && isMargin && <LeverageSetting className="ml-4" />}
      </Label>
      <CenterBox>
        <Avaliable>
          {readableNumber(maxAvailableBalance)} {currencyName}
        </Avaliable>
        {isMargin ? (
          <DropdownLabel
            color={colors.primary}
            type="transfer"
            className="pointer"
            onClick={() => {
              dispatch({
                type: 'transfer/updateTransferConfig',
                payload: {
                  visible: true,
                  initCurrency: currency,
                },
              });
            }}
          />
        ) : (
          <StyledDropdownSelect
            configs={configs}
            isShowArrow={false}
            extendStyle={DropdownExtend}
            onChange={handleChange}
            renderLabel={() => <DropdownLabel color={colors.primary} />}
            {...(!isLogin ? { visible: false } : null)}
          />
        )}
      </CenterBox>
    </Container>
  );
});

export default AvaliableBar;
