/**
 * Owner: Jennifer.y.liu@kupotech.com
 */
import React, { useCallback, memo } from 'react';
import { Button, styled, Dialog } from '@kux/mui';
import { useDispatch } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import { useSelector } from 'src/hooks/useSelector';
import { BASE_CURRENCY } from 'config/base';

const DialogWrapper = styled(Dialog)`
  .KuxDialog-body {
    max-width: 400px;
  }
  .KuxDialog-content {
    height: 100%;
    padding: 0 32px;
    overflow: hidden;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    height: 90%;
  }
`;
const BottomButton = styled(Button)`
  margin: 16px 0px 32px 0;
  border-radius: 24px;
  background: ${(props) => props.theme.colors.text};
  
  font-family: "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  color: var(--0-Button-Text-Primary-Button-Text, #1D1D1D);
  &:hover {
    background: ${(props) => props.theme.colors.text};

  }
 `;
 const Desc = styled.div`
    &:first-child{
      margin-bottom: 16px;
    }
    color: var(--2-text-60, rgba(243, 243, 243, 0.60));
    font-family: "PingFang SC";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    p .hightLight {
      color: var(--text, #F3F3F3);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
    }
 `;

const MODAL_CONFIG = {
  Earnings: {
    title: _t('25f58714999e4000a686'),
    content: _tHTML('1afb387ae8924800a845'),
  },
  Rule: {
    title: _t('f19fc2f5f8dd4000a62e'),
    content: _tHTML('a708de89c5404000a515', { currency: BASE_CURRENCY }),
  },
  Tips: {
    title: _t('f19fc2f5f8dd4000a62e'),
    content: _tHTML('de7171c8e37f4800aea4'),
  },
};

const ExplainModal = memo(() => {
  const showExplainModal = useSelector((state) => state.spotlight7.showExplainModal);
  const explainModalType = useSelector((state) => state.spotlight7.explainModalType);
  
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch({ type: 'spotlight7/closeExplainModal' });
  }, [dispatch]);

  const { title, content } = MODAL_CONFIG[explainModalType] || {};

  return (
    <DialogWrapper
      open={showExplainModal}
      title={title}
      onCancel={handleClose}
      footer={null}
      onOk={handleClose}
      showCloseX
    >
      <Desc>{content}</Desc>
      <BottomButton fullWidth onClick={handleClose}>
        {_t("6d0dbad46c024000a3c9")}
      </BottomButton>
    </DialogWrapper>
  );
});

export default ExplainModal;