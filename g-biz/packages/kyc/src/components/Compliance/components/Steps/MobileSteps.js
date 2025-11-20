/**
 * Owner: tiger@kupotech.com
 * h5步骤条
 */
import { useState, useMemo } from 'react';
import { isFunction } from 'lodash';
import { styled } from '@kux/mui';
import { ICArrowRight2Outlined, ICCloseOutlined } from '@kux/icons';
import JsBridge from '@tools/bridge';
import { tenantConfig } from '@packages/kyc/src/config/tenant';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { searchToJson, NDIDPendingPageCode } from '@kycCompliance/config';
import ExitModal from '../ExitModal';

const Wrapper = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
`;
const Left = styled.div``;
const LeftIcon = styled(ICArrowRight2Outlined)`
  cursor: pointer;
  font-size: 20px;
  transform: scaleX(-1);
  color: ${({ theme }) => theme.colors.text};
`;
const Center = styled.div`
  display: flex;
  align-items: center;
  .pageTitle {
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    color: ${({ theme }) => theme.colors.text};
  }
`;
const StepItem = styled.div`
  width: 48px;
  height: 3px;
  border-radius: 8px;
  position: relative;
  background-color: ${({ theme }) => theme.colors.cover4};
  &:not(:last-child) {
    margin-right: 6px;
  }
  &::before {
    content: '';
    display: ${({ active, completed }) => (active || completed ? 'block' : 'none')};
    position: absolute;
    left: 0;
    top: 0;
    height: 3px;
    border-radius: 8px;
    width: ${({ active }) => (active ? '50%' : '100%')};
    background-color: ${({ theme }) => theme.colors.text};
  }
`;
const Right = styled.div`
  width: 20px;
`;
const CloseIcon = styled(ICCloseOutlined)`
  cursor: pointer;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

const computeStepData = (v) => Math.ceil(v / 2);
const query = searchToJson();
const EXIT_TYPE_1 = 'left';
const EXIT_TYPE_2 = 'right';

export default ({ onPrePage, pageElements, pageCode, isLastPage, isFirstPage }) => {
  const { inApp, stepData, innerPageElements } = useCommonData();
  const { show, current: currentData, total: totalData } = stepData;
  const current = computeStepData(currentData);
  const total = computeStepData(totalData);
  const [isExitOpen, setExitOpen] = useState(false);
  const [exitType, setExitType] = useState(EXIT_TYPE_2);

  const onLeft = () => {
    if (isFunction(innerPageElements?.onHeaderLeft)) {
      innerPageElements.onHeaderLeft();
      return;
    }
    onPrePage();
  };

  const onExit = () => {
    if (exitType === EXIT_TYPE_1) {
      onLeft();
      return;
    }
    if (inApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    } else {
      window.history.go(-1);
    }
  };

  const onRight = () => {
    if (isFunction(innerPageElements?.onHeaderRight)) {
      innerPageElements.onHeaderRight();
      return;
    }
    if (isLastPage || query?.isIgnoreExitModal || innerPageElements?.ignoreExitModal) {
      onExit();
      return;
    }
    setExitType(EXIT_TYPE_2);
    setExitOpen(true);
  };

  const isShowBtn = useMemo(
    () => pageElements?.pagePreButtonTxt || innerPageElements?.pagePreButtonTxt,
    [pageElements?.pagePreButtonTxt, innerPageElements?.pagePreButtonTxt],
  );

  // 点击左侧返回也要出挽留弹窗
  const isLeftShowExitModal = useMemo(() => {
    if (query.isKybProxy && isFirstPage) {
      return true;
    }
    if ([NDIDPendingPageCode].includes(pageCode)) {
      return true;
    }
    return false;
  }, [pageCode, isFirstPage]);

  return show || isShowBtn ? (
    <Wrapper>
      <Left>
        {(isShowBtn || ['page_0'].includes(pageCode)) && !innerPageElements?.headerHidePre ? (
          <LeftIcon
            onClick={() => {
              if (isLeftShowExitModal) {
                setExitType(EXIT_TYPE_1);
                setExitOpen(true);
                return;
              }
              onLeft();
            }}
          />
        ) : null}
      </Left>

      {show && tenantConfig.compliance.isShowStepBar ? (
        <Center>
          {Array.from({ length: total }, (v, i) => i).map((item, index) => {
            const active = index === current - 1;
            const completed = index < current - 1;
            const key = index;

            return <StepItem active={active} completed={completed} key={key} />;
          })}
        </Center>
      ) : null}
      {innerPageElements?.isHeaderShowTitle ? (
        <Center>
          <span className="pageTitle">{innerPageElements?.pageTitle}</span>
        </Center>
      ) : null}

      <Right>
        <CloseIcon onClick={onRight} />
      </Right>

      {/* 退出弹窗 */}
      {isExitOpen ? (
        <ExitModal
          open={isExitOpen}
          onCancel={() => setExitOpen(false)}
          onOk={() => {
            setExitOpen(false);
            onExit();
          }}
          pageCode={pageCode}
        />
      ) : null}
    </Wrapper>
  ) : null;
};
