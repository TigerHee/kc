/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useMemo } from 'react';
import { Button, styled } from '@kux/mui';
import classnames from 'classnames';
import { debounce } from 'lodash';
import useLang from '@packages/kyc/src/hookTool/useLang';
import { Main, Footer } from '../style';
import successIcon from './img/success.svg';
import pendingIcon from './img/pending.svg';
import failIcon from './img/fail.svg';
import { STATUS_PASSED, STATUS_VERIFYING, STATUS_REJECTED } from '../../config';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 200px;
    height: 200px;
    margin-bottom: 8px;
  }
  .title {
    font-size: 28px;
    font-weight: 600;
    line-height: 130%;
    text-align: center;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.text};
  }
  .desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 130%;
    text-align: center;
    max-width: 400px;
    color: ${({ theme }) => theme.colors.text40};
  }
  .descMt {
    margin-top: 4px;
  }
  .descError {
    color: ${({ theme }) => theme.colors.secondary};
  }

  &.isH5Style {
    padding: 80px 16px 0;
    img {
      width: 148px;
      height: 148px;
    }
    .title {
      font-size: 24px;
      margin-bottom: 8px;
    }
    .KuxButton-contained {
      margin-top: 24px;
      min-width: 240px;
    }
  }
`;

export default ({
  isH5Style,
  isInDialog,
  onOkCallback,
  onExitWebview,
  panStatusData,
  getPanStatusData,
  onViewToPanNumber,
}) => {
  const { _t } = useLang();
  const { panNumber, panStatus, failReason } = panStatusData;

  // 获取status数据
  useEffect(() => {
    if (!panStatus) {
      getPanStatusData(false);
    }
    const timer =
      panStatus === STATUS_VERIFYING
        ? setInterval(() => {
            getPanStatusData(false);
          }, 30 * 1000)
        : null;

    return () => {
      timer && clearInterval(timer);
    };
  }, [panStatus]);

  const statusConfig = {
    [STATUS_PASSED]: {
      icon: successIcon,
      title: _t('88021ea4fb8c4000a115'),
      descList: [_t('cc647b3804084000a157', { pan: panNumber || '' }), _t('d25a8a6727734000a3a0')],
    },
    [STATUS_VERIFYING]: {
      icon: pendingIcon,
      title: _t('3501e99b7c1f4000a9a2'),
      descList: [_t('d3c09017680d4000a8a4')],
    },
    [STATUS_REJECTED]: {
      icon: failIcon,
      title: _t('277ff739479d4000a0b1'),
      descList: [failReason || _t('33b719de15d04000a090')],
    },
  };

  // 页面渲染的文案相关
  const statusRenderData = statusConfig[panStatus] || {};
  const isStatusFail = useMemo(() => panStatus === STATUS_REJECTED, [panStatus]);
  // 确认按钮文案
  const confirmBtnText = useMemo(() => {
    if (isStatusFail) {
      return _t('6cfc39e9a7df4000ab2e');
    }
    return _t('a054bf4a35074000ad73');
  }, [_t, isStatusFail]);

  // 取消按钮文案
  const cancelBtnTest = useMemo(() => {
    if (isStatusFail) {
      return _t('0cb2c3e437f04000a47a');
    }
    return null;
  }, [_t, isStatusFail]);

  // 提交
  const onConfirm = debounce(() => {
    if (isStatusFail) {
      onViewToPanNumber();
      return;
    }
    if (isInDialog) {
      onOkCallback();
    } else {
      onExitWebview();
    }
  }, 300);

  // 取消
  const onCancel = debounce(() => {
    if (isInDialog) {
      onOkCallback(false);
    } else {
      onExitWebview();
    }
  }, 300);

  return (
    <>
      <Main
        className={classnames({
          isH5Style,
          isNoPt: true,
        })}
      >
        <Content
          className={classnames({
            isH5Style,
          })}
        >
          <img src={statusRenderData.icon} alt={panStatus} />
          <div className="title">{statusRenderData.title}</div>
          {statusRenderData?.descList?.map((item, index) => (
            <div
              className={classnames({
                desc: true,
                descMt: index !== 0,
                descError: isStatusFail,
              })}
              key={String(item)}
            >
              {item}
            </div>
          ))}

          {isH5Style && (
            <>
              <Button disabled={false} size="large" onClick={onConfirm}>
                {confirmBtnText}
              </Button>
              {cancelBtnTest && (
                <Button onClick={onCancel} variant="text" size="large">
                  {cancelBtnTest}
                </Button>
              )}
            </>
          )}
        </Content>
      </Main>
      {!isH5Style && (
        <Footer
          className={classnames({
            isShowBorderTop: isInDialog,
          })}
        >
          {cancelBtnTest && (
            <Button onClick={onCancel} variant="text">
              {cancelBtnTest}
            </Button>
          )}
          <Button disabled={false} onClick={onConfirm}>
            {confirmBtnText}
          </Button>
        </Footer>
      )}
    </>
  );
};
