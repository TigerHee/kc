/**
 * Owner: solar@kupotech.com
 */
import React from 'react';
import { Dialog, styled } from '@kux/mui';
import { useTranslation } from '@tools/i18n';

const FailedDesc = styled.div`
  h3 {
    /* margin: -8px 0 4px 0; */
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  }
  p {
    display: flex;
    justify-content: space-between;
    margin: 0;
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    span {
      &:first-of-type {
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }
`;
const noop = () => null;
export default React.memo(({ failedCurrencies, onConfirm = noop, onCancel = noop }) => {
  const { t: _t } = useTranslation('transfer');
  return (
    <Dialog
      size="medium"
      showCloseX={false}
      title={_t('jZbvwffKKCTMauSygcATpF')}
      open={!!failedCurrencies}
      okText={_t('ss1u4HHoucbtitKWM5vsQk')}
      cancelText={_t('oUewJiWrkqSaAegqZJUkcW')}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <FailedDesc>
        <h3>{_t('mAraJ2gc2okKWYLEyzfcaD')}</h3>
        {failedCurrencies &&
          failedCurrencies.map((fail) => (
            <p key={fail.currency}>
              <span>{fail.currency}</span>
              <span>{fail.failMsg}</span>
            </p>
          ))}
      </FailedDesc>
    </Dialog>
  );
});
