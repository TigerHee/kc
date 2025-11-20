/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { styled } from '@kux/mui/emotion';
import { map } from 'lodash';

import { _t } from 'utils/lang';

import AdaptiveModal from '@mui/Dialog';

import SymbolText from '@/components/SymbolText';

import { useMarginModeError } from './hooks';

const Modal = styled(AdaptiveModal)``;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .item-error {
    display: flex;
    flex-direction: column;
    .message {
      font-size: 16px;
      font-weight: 400;
      line-height: 1.3;
      margin-bottom: 16px;
      color: ${(props) => props.theme.colors.text60};
    }
    .symbols {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .symbol-text {
        margin-right: 8px;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.3;
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
  .divider {
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.colors.divider8};
    margin: 24px 0;
  }
`;

const MarginModeErrorDialog = () => {
  const { open, onCloseModal, errorInfo, errorInfoKeys, symbolKeys } = useMarginModeError();

  return (
    <Modal
      open={open}
      disableBackdropClick
      onClose={onCloseModal}
      onOk={onCloseModal}
      okText={_t('security.form.btn')}
      cancelText={null}
      title={_t('futures.marginMode.error', { amount: symbolKeys?.length })}
      destroyOnClose
    >
      <ContentWrapper>
        {map(errorInfoKeys, (key, idx) => {
          return (
            <>
              {idx > 0 && idx !== errorInfoKeys?.length ? <div className="divider" /> : null}
              <div className="item-error" key={idx}>
                <div className="message">{errorInfo[key]?.msg}</div>
                <div className="symbols">
                  {map(errorInfo[key]?.symbols, (symbol) => (
                    <SymbolText className="symbol-text" symbol={symbol} key={symbol} />
                  ))}
                </div>
              </div>
            </>
          );
        })}
      </ContentWrapper>
    </Modal>
  );
};

export default React.memo(MarginModeErrorDialog);
