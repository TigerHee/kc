/**
 * Owner: garuda@kupotech.com
 */

import React, { memo } from 'react';


import { map } from 'lodash';


import loadable from '@loadable/component';

import Button from '@mui/Button';
import AdaptiveModal from '@mui/Dialog';

import SymbolText from '@/components/SymbolText';

import { _t, styled } from '@/pages/Futures/import';

import { useResultPromptProps, useOperatorResultPrompt } from './hooks';

const SuccessImg = loadable(() =>
  import(/* webpackChunkName: 'result-success-content' */ './SuccessImg'),
);
const WarningImgImg = loadable(() =>
  import(/* webpackChunkName: 'result-success-content' */ './WarningImg'),
);
const ErrorImg = loadable(() =>
  import(/* webpackChunkName: 'result-success-content' */ './ErrorImg'),
);

const ContentMap = {
  success: <SuccessImg />,
  warning: <WarningImgImg />,
  error: <ErrorImg />,
};

const Dialog = styled(AdaptiveModal)`
  &.KuxDialog-basic {
    .KuxDialog-body {
      max-width: 400px;
    }
  }
  .KuxDialog-content {
    padding: 24px 32px 32px;
    border: 0;
  }
`;

const Content = styled.div`
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  .title {
    margin: 8px 0;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%;
    color: ${(props) => props.theme.colors.text};
  }
  .info-box {
    display: flex;
    flex-direction: column;
  }
  .info {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    color: ${(props) => props.theme.colors.text60};
  }
`;

const FooterWrapper = styled.div`
  margin: 24px 0 0;
`;

const DialogInfoSettingItem = memo(({ info }) => {
  return (
    <>
      {Array.isArray(info) ? (
        <div className="info-box">
          {map(info, (item, index) => (
            <div className="info" key={index}>
              <SymbolText symbol={item?.symbol} />
              <span>{item?.msg}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="info">
          <SymbolText symbol={info?.symbol} />
          <span>{info?.msg}</span>
        </div>
      )}
    </>
  );
});

// 增加需要提示的信息
const InfoMap = {
  setting: (props) => <DialogInfoSettingItem info={props} />,
};

const ResultPromptDialog = () => {
  const { resultPromptInfo } = useResultPromptProps();
  const { onCloseDialog } = useOperatorResultPrompt();

  return (
    <Dialog
      open={!!resultPromptInfo}
      disableBackdropClick
      onClose={onCloseDialog}
      okText={null}
      cancelText={null}
      footer={resultPromptInfo?.footer || null}
      title={null}
      header={null}
      showClose={false}
      showCloseX={false}
      destroyOnClose
    >
      <Content>
        {resultPromptInfo?.type ? ContentMap[resultPromptInfo?.type] : null}
        {resultPromptInfo?.title ? <h3 className="title">{resultPromptInfo?.title}</h3> : null}
        {resultPromptInfo?.info
          ? InfoMap[resultPromptInfo.infoType || 'setting'] &&
            InfoMap[resultPromptInfo.infoType || 'setting'](resultPromptInfo.info)
          : null}
        {resultPromptInfo?.content}
      </Content>
      {resultPromptInfo?.slot}
      {!resultPromptInfo?.footer ? (
        <FooterWrapper>
          <Button type="primary" variant="contained" onClick={onCloseDialog} fullWidth>
            {_t('i.understand')}
          </Button>
        </FooterWrapper>
      ) : null}
    </Dialog>
  );
};

export default memo(ResultPromptDialog);
