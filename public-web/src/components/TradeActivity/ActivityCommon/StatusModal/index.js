/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-03 15:41:45
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2025-02-24 19:33:28
 * @FilePath: /public-web/src/components/TradeActivity/ActivityCommon/StatusModal/index.js
 * @Description:
 */
import styled from '@emotion/styled';
import { Dialog, Status, useResponsive } from '@kux/mui';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
//import { _t, _tHTML } from 'tools/i18n';

export const EnumStatus = {
  Error: 'error',
  Loading: 'loading',
  Success: 'success',
  Warning: 'warning',
};

export const DialogContentWrapper = styled.div`
  a,
  button {
    color: ${(props) => props.theme.colors.textPrimary};
    text-decoration: none;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    color: ${(props) => props.theme.colors.text60};
  }
  .KuxButton-root {
    text-align: left;
  }

  .KuxDivider-horizontal {
    margin: 24px 0;
  }
`;

const IconWarningBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 32px 0 12px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 32px 0;
  }
`;

const ContentBox = styled.div`
  margin-top: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentTitle = styled.div`
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  text-align: center;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-weight: 700;
    font-size: 24px;
  }
`;

const ContentText = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
  text-align: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
  .rateWrapper {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
  }
`;

const ContentExtra = styled.div`
  width: 100%;
`;

const WrapperDialog = styled(Dialog)`
  .KuxDialog-body {
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: calc(100% - 32px);
      margin: auto 16px;
    }

    .KuxModalFooter-root {
      padding: 16px 24px 32px;
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      .KuxModalFooter-root {
        padding: 16px 32px 32px;
      }
    }
  }

  .KuxModalFooter-buttonWrapper {
    display: flex;
    justify-content: space-around;
    .KuxButton-root {
      width: 162px;
    }
    button {
      flex: 1;
    }
  }
  .KuxButton-outlinedDefault {
    ${(props) => {
      if (props.resultStatus === 'success') {
        return `display: none;`;
      }
    }}
  }

  &.restrict-height {
    .KuxDialog-body {
      max-height: 720px;
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      .KuxDialog-body {
        max-height: calc(100vh - 40px);
      }
    }

    .KuxDialog-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
`;

/**
 * result 结果弹框
 */
const ResultDialog = ({
  visible,
  resultStatus, // EnumStatus.Error | EnumStatus.Success | EnumStatus.Warning | EnumStatus.Loading
  contentTitle,
  contentText,
  setDialogVisible,
  handleSubmit,
  submitCallback,
  okText,
  restrictHeight,
  cancelText,
  contentExtra, // node | string
  size,
  okLoading,
}) => {
  const { lg } = useResponsive();
  const handleOk = useCallback(() => {
    if (handleSubmit) {
      handleSubmit();
    }
    if (submitCallback) {
      submitCallback();
    } else {
      setDialogVisible(false);
    }
  }, [handleSubmit, submitCallback, setDialogVisible]);

  const handleCancel = useCallback(() => {
    setDialogVisible(false);
  }, [setDialogVisible]);

  return (
    <>
      <WrapperDialog
        resultStatus={resultStatus}
        header={null}
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={okText}
        cancelText={cancelText}
        back={false}
        className={restrictHeight ? 'restrict-height' : ''}
        destroyOnClose
        showCloseX
        size={size}
        okButtonProps={{ size: lg ? 'large' : 'basic', loading: okLoading }}
        cancelButtonProps={{ size: lg ? 'large' : 'basic' }}
      >
        <DialogContentWrapper>
          <IconWarningBox>
            <Status name={resultStatus} />
            <ContentBox>
              <ContentTitle>{contentTitle}</ContentTitle>
              <ContentText>{contentText}</ContentText>
              {!!contentExtra && <ContentExtra>{contentExtra}</ContentExtra>}
            </ContentBox>
          </IconWarningBox>
        </DialogContentWrapper>
      </WrapperDialog>
    </>
  );
};

export default memo(ResultDialog);

ResultDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  resultStatus: PropTypes.oneOf(Object.values(EnumStatus)).isRequired,
  contentTitle: PropTypes.string.isRequired,
  contentText: PropTypes.string.isRequired,
  setDialogVisible: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
};
