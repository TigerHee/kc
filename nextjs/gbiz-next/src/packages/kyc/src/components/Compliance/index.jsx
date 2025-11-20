/**
 * Owner: tiger@kupotech.com
 */
import { useState, useCallback } from 'react';
import loadable from '@loadable/component';
import { isFunction } from 'lodash-es';
import RootContainer from 'packages/kyc/src/common/components/RootContainer';
import backIcon from 'kycCompliance/assets/img/common/back.svg';
import ComplianceRender from './ComplianceRender';
import { StyledDialog, BackIcon } from './style';

const ExitModal = loadable(() => import('./components/ExitModal'));

// 合规弹窗
export const ComplianceDialog = props => {
  const { open, theme, onCancel = () => {}, isIgnoreExitModal = false, ...otherProps } = props;

  const [isExitOpen, setExitOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ dialogTitle: '', isLastPage: false });
  const { innerPageElements, pageElements, onPrePage, pageCode, pageConfigs, onPageToFixed } = dialogData;

  const onSetDialogData = useCallback(obj => {
    setDialogData(pre => {
      return { ...pre, ...obj };
    });
  }, []);

  // 是否展示返回按钮
  const isShowBackBtn = pageElements?.pagePreButtonTxt || innerPageElements?.pagePreButtonTxt;

  const onBack = () => {
    if (isFunction(innerPageElements?.onHeaderLeft)) {
      innerPageElements.onHeaderLeft();
      return;
    }
    if (isFunction(onPrePage)) {
      onPrePage();
    }
  };

  const onCloseDialog = () => {
    if (isFunction(innerPageElements?.onHeaderRight)) {
      innerPageElements.onHeaderRight();
      return;
    }
    if (pageConfigs?.exitPage) {
      onPageToFixed(pageConfigs.exitPage);
      return;
    }
    if (dialogData?.isLastPage || isIgnoreExitModal || innerPageElements?.ignoreExitModal) {
      onCancel();
      return;
    }
    setExitOpen(true);
  };

  return open ? (
    <RootContainer {...props}>
      <StyledDialog
        {...otherProps}
        title={
          <div className="titleWrapper">
            {isShowBackBtn && <BackIcon onClick={onBack} src={backIcon} alt="back" />}
            <span>{dialogData?.dialogTitle}</span>
          </div>
        }
        size="large"
        footer={null}
        open={open}
        onCancel={onCloseDialog}
        pageCode={pageCode}
      >
        <ComplianceRender
          {...otherProps}
          onCancel={onCancel}
          isInDialog
          onSetDialogData={onSetDialogData}
          extraContent={
            isExitOpen ? (
              <ExitModal
                open={isExitOpen}
                onCancel={() => setExitOpen(false)}
                onOk={() => {
                  setExitOpen(false);
                  onCancel();
                }}
                pageCode={pageCode}
              />
            ) : null
          }
        />
      </StyledDialog>
    </RootContainer>
  ) : null;
};

// 合规页面组件
export default props => {
  const { theme, ...otherProps } = props;
  return (
    <RootContainer {...props}>
      <ComplianceRender {...otherProps} />
    </RootContainer>
  );
};
