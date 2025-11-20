/**
 * Owner: tiger@kupotech.com
 * 税收信息收集
 */
import { useMemo, useEffect, useCallback, useState } from 'react';
import clsx from 'clsx';
import { debounce, noop } from 'lodash-es';
import { Dialog, styled, useTheme, Spin } from '@kux/mui';
import JsBridge from 'tools/jsBridge';
import RootContainer from 'packages/kyc/src/common/components/RootContainer';
import { searchToJson, kcsensorsManualTrack } from 'packages/kyc/src/common/tools';
import MobileSteps from './components/Steps/MobileSteps';
import DialogSteps from './components/Steps/DialogSteps';
import PanNumber from './components/PanNumber';
import PanPhoto from './components/PanPhoto';
import PanResult from './components/PanResult';
import { VIEW_PAN_NUMBER, VIEW_PAN_PHOTO, VIEW_PAN_RESULT } from './config';
import checkBackUrlIsSafe from './checkBackUrlIsSafe';
import { getPanStatus } from './service';
import PanConfirmDialog from './PanConfirmDialog';

const getPageHeight = () => {
  return window?.visualViewport?.height || window.innerHeight;
};
const StyledDialog = styled(Dialog)`
  z-index: 3000;
  & .KuxDialog-body {
    margin: 16px;
    overflow: hidden;
  }
  & .KuxModalHeader-root {
  }
  & .KuxDialog-content {
    padding: 0;
  }
`;
const Wrapper = styled.section`
  width: 100%;
  height: 582px;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  padding-top: 0;
  position: relative;
  background-color: var(--color-layer);
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 60vh;
  }
  &.isH5Style {
    height: ${({ pageHeight }) => `${pageHeight}px`};
    min-height: ${`${getPageHeight() * 0.7}px`};
    padding-top: 44px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    position: fixed;
    top: 0;
  }
  &.isShowBorderTop {
    border-top: 1px solid var(--color-divider8);
  }
`;
const StyledSpin = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const TaxInfoCollect = ({
  isInDialog,
  onOkCallback = () => {},
  setDialogCurView,
  ...otherProps
}) => {
  const inApp = JsBridge.isApp();
  const { setTheme } = useTheme();
  const query = searchToJson();
  const { backUrl } = query;
  const source = otherProps?.source || query?.source || 'none';
  const [pageHeight, setPageHeight] = useState(() => getPageHeight());
  const [curView, setCurView] = useState(null);
  const [isPageLoading, setPageLoading] = useState(true);
  const [panStatusData, setPanStatusData] = useState({});
  const [formData, setFormData] = useState({});

  // 获取pan status
  const getPanStatusData = debounce(
    (isNeedSetView = true) => {
      getPanStatus({})
        .then((res) => {
          setPanStatusData(res.data || {});
          if (res?.data?.panStatus) {
            isNeedSetView && setCurView(VIEW_PAN_RESULT);
          } else {
            isNeedSetView && setCurView(VIEW_PAN_NUMBER);
          }
        })
        .catch(() => {
          isNeedSetView && setCurView(VIEW_PAN_NUMBER);
        })
        .finally(() => {
          setPageLoading(false);
        });
    },
    500,
    { 'leading': true, 'trailing': false },
  );

  useEffect(() => {
    getPanStatusData();
  }, []);

  // 设置弹窗step
  useEffect(() => {
    if (isInDialog) {
      setDialogCurView(curView);
    }
  }, [curView, isInDialog]);

  const onViewToPanNumber = () => {
    setCurView(VIEW_PAN_NUMBER);
  };
  const onViewToPanPhoto = () => {
    setCurView(VIEW_PAN_PHOTO);
  };
  const onViewToPanResult = () => {
    setCurView(VIEW_PAN_RESULT);
  };

  const isShowBorderTop = useMemo(
    () => [VIEW_PAN_NUMBER, VIEW_PAN_PHOTO].includes(curView) && isInDialog,
    [curView, isInDialog],
  );

  // android键盘弹起检测
  const resizeChange = debounce(() => {
    const innerHeightNow = getPageHeight();
    setPageHeight(innerHeightNow);
  }, 10);

  useEffect(() => {
    // 监听
    window.addEventListener('resize', resizeChange);
    // 销毁
    return () => window.removeEventListener('resize', resizeChange);
  }, []);

  useEffect(() => {
    kcsensorsManualTrack('expose', ['pan', '1'], { source });
  }, []);

  // 隐藏app的头，主题适配
  useEffect(() => {
    if (inApp) {
      const onUpdateHeader = (statusBarIsLightMode) => {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'updateHeader',
            visible: false,
            statusBarTransparent: true,
            statusBarIsLightMode,
          },
        });
      };

      onUpdateHeader(false);
      // 获取native主题
      JsBridge.open({ type: 'func', params: { name: 'getAppInfo' } }, (params) => {
        // 同步主题
        setTheme(params?.data?.darkMode ? 'dark' : 'light');
        onUpdateHeader(!params?.data?.darkMode);
      });
    }
  }, [inApp, setTheme]);

  // 关闭 Webview
  const onExitWebview = useCallback(() => {
    if (inApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
      return;
    }
    if (checkBackUrlIsSafe(backUrl)) {
      window.location.href = backUrl;
      return;
    }
    window?.history?.go(-1);
  }, [inApp, backUrl]);

  // 是否使用h5样式
  const isH5Style = useMemo(() => !isInDialog, [isInDialog]);

  const commonProps = {
    isH5Style,
    inApp,
    onOkCallback,
    onExitWebview,
    isInDialog,
    source,
    onViewToPanNumber,
    onViewToPanPhoto,
    onViewToPanResult,
    formData,
    setFormData,
  };

  return (
    <Wrapper
      className={clsx({
        isH5Style,
        isShowBorderTop,
      })}
      pageHeight={pageHeight}
    >
      {isPageLoading && <StyledSpin spinning={isPageLoading} size="small" />}
      {/* h5 步骤条 */}
      {isH5Style && <MobileSteps onExit={onExitWebview} curView={curView} />}
      {/* 填写pan码 */}
      {curView === VIEW_PAN_NUMBER && <PanNumber {...commonProps} />}
      {/* 上传pan card图片 */}
      {curView === VIEW_PAN_PHOTO && (
        <PanPhoto {...commonProps} setPanStatusData={setPanStatusData} />
      )}
      {/* 结果页 */}
      {curView === VIEW_PAN_RESULT && (
        <PanResult
          {...commonProps}
          panStatusData={panStatusData}
          getPanStatusData={getPanStatusData}
        />
      )}
    </Wrapper>
  );
};

// 税收信息收集弹窗
export const TaxInfoCollectDialog = (props) => {
  const { open, onCancel = noop, onOk = noop, ...otherProps } = props;
  const [curView, setCurView] = useState(VIEW_PAN_NUMBER);
  const [isPanDialogOpen, setPanDialogOpen] = useState(false);

  const onOkCallback = (isSuccess = true) => {
    onCancel();
    setPanDialogOpen(false);
    if (isSuccess) {
      onOk();
    }
  };

  return (
    <>
      <PanConfirmDialog
        {...props}
        open={open}
        onCancel={() => {
          onCancel();
        }}
        onOk={() => {
          setPanDialogOpen(true);
        }}
      />
      {isPanDialogOpen ? (
        <RootContainer {...props}>
          <StyledDialog
            {...props}
            open={isPanDialogOpen}
            onCancel={() => {
              onCancel();
              setPanDialogOpen(false);
            }}
            footer={null}
            title={<DialogSteps activeIndex={0} curView={curView} />}
            size="large"
          >
            <TaxInfoCollect
              onOkCallback={onOkCallback}
              {...otherProps}
              isInDialog
              setDialogCurView={setCurView}
            />
          </StyledDialog>
        </RootContainer>
      ) : null}
    </>
  );
};

// 税收信息收集主体
export default (props) => {
  return (
    <RootContainer {...props}>
      <TaxInfoCollect {...props} />
    </RootContainer>
  );
};
