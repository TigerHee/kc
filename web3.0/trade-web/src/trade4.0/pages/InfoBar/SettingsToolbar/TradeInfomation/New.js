/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { map } from 'lodash';

import { addLangToPath, _t } from 'utils/lang';

import styled from '@emotion/styled';
import { useResponsive } from '@kux/mui';

import Divider from '@mui/Divider';
import Drawer from '@mui/Drawer';

import CompliantRule from '@/components/CompliantRule';
import SvgComponent from '@/components/SvgComponent';
import { getCurrentSymbol, getSymbolInfo } from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import { FUTURES } from '@/meta/const';

import { isDisplayFutures, isDisplayMargin } from '@/meta/multiTenantSetting';

import { FUTURES_LIST, LIST, TYPES_ENUM } from './config';
import { useItemClick } from './useInformationProps';

import IconLabel from '../IconLabel';

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  height: 32px;
  font-size: 12px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
`;

const GroupItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 0;
  height: 46px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;

  .icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    color: ${(props) => props.theme.colors.icon};
    > svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const TradeDrawer = styled(Drawer)`
  width: ${(props) => (props.isMobile ? '100%' : '480px')};
  .KuxDrawer-content {
    padding: 24px 32px;

    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 8px 16px;
    }
  }
  .KuxDivider-root {
    margin: 16px 0;
  }
`;

const TradeInformationNew = () => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const [visible, setVisible] = useState(false);
  const { xs, sm } = useResponsive();
  const onItemClick = useItemClick();
  const infoBarMediaFlag = useSelector((state) => state.setting.infoBarMediaFlag);

  const isMobile = useMemo(() => xs && !sm, [sm, xs]);
  const tradeType = useTradeType();

  const SpotAndMarginList = useMemo(() => {
    if (tradeType === FUTURES) {
      return LIST.filter((item) => item.type !== TYPES_ENUM.BASIC);
    }
    // 多租户需求，未登录条件下，泰国站/土耳其不展示交易费率说明
    if (!isLogin && window._BRAND_SITE_ !== 'KC') {
      return LIST.filter((item) => item.type !== TYPES_ENUM.RATE);
    }
    return LIST;
  }, [tradeType, isLogin]);

  const handleOpen = useCallback(() => {
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleGoPage = useCallback((path) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = addLangToPath(path);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  return (
    <>
      <IconLabel
        disabledOnMobile
        onClick={handleOpen}
        icon="trade-infomation"
        text={_t('rL31Z8FGrairjgBjjv4gbm')}
        showText={infoBarMediaFlag < 0}
      />
      <TradeDrawer
        anchor="right"
        title={_t('rL31Z8FGrairjgBjjv4gbm')}
        show={visible}
        back={false}
        onClose={handleClose}
        onOk={handleClose}
        isMobile={isMobile}
      >
        <GroupBox>
          <GroupTitle>
            {isDisplayMargin() ? _t('spot.margin') : _t('r1pExPBTKXiYz571cu5Lw5')}
          </GroupTitle>
          {map(SpotAndMarginList, ({ fileName, icon, text, type, color }) => (
            <GroupItem key={text} onClick={() => onItemClick(type)}>
              <div className="icon">
                <SvgComponent fileName={fileName} type={icon} color={color} />
              </div>
              <span>{text}</span>
            </GroupItem>
          ))}
        </GroupBox>
        {isDisplayFutures() ? (
          <>
            <Divider />
            <GroupBox>
              <GroupTitle>{_t('tradeType.kumex')}</GroupTitle>
              {map(FUTURES_LIST, ({ fileName, icon, text, path, color, spm, pathKey }) => {
                const symbol = getCurrentSymbol();
                const hrefUrl =
                  typeof path === 'string'
                    ? path
                    : path(getSymbolInfo({ symbol, tradeType: FUTURES })?.[pathKey]);

                return (
                  <CompliantRule key={text} spm={spm}>
                    <GroupItem onClick={() => handleGoPage(hrefUrl)}>
                      <div className="icon">
                        <SvgComponent fileName={fileName} type={icon} color={color} />
                      </div>
                      <span>{text}</span>
                    </GroupItem>
                  </CompliantRule>
                );
              })}
            </GroupBox>
          </>
        ) : null}
      </TradeDrawer>
    </>
  );
};

export default React.memo(TradeInformationNew);
