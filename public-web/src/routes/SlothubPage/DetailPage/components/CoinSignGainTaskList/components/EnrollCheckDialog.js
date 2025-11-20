/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-21 16:44:36
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-24 17:24:42
 */
import styled from '@emotion/styled';
import { useMemoizedFn } from 'ahooks';
import { memo } from 'react';
import TipDialog from 'src/routes/SlothubPage/components/TipDialog';
import { _t } from 'src/tools/i18n';
import { useReserveOrEnrollProject } from '../../../hooks/useClickEvent/useReserveOrEnrollProject';
import { useStore } from '../../../store';

const StyledTipDialog = styled(TipDialog)`
  .KuxModalHeader-root {
    min-height: auto !important;
    padding: 0 !important;
  }

  .KuxDialog-body {
    max-width: 319px;
    padding-top: 32px;
  }
  .KuxDialog-content {
    padding: 0px 24px;
  }

  .KuxModalFooter-root {
    padding: 24px 24px 32px;
  }

  .KuxButton-containedPrimary {
    color: #d3f475;
  }
  .KuxButton-sizeBasic {
    font-weight: 600;
  }

  .KuxButton-outlinedDefault {
    background: var(--0-Button-Color-Secondary-Button, rgba(29, 29, 29, 0.04));
    border: 0;
  }
`;

export const EnrollCheckDialog = memo(() => {
  const { dispatch: detailStoreDispatch, state } = useStore();
  const { enrollConfirmPromptVisible } = state;
  const { enroll, loadings } = useReserveOrEnrollProject();

  const toggleVisible = useMemoizedFn(() => {
    detailStoreDispatch({ type: 'toggleEnrollPromptDialog' });
  });

  const handleOk = useMemoizedFn(async () => {
    try {
      await enroll();
    } catch (error) {
    } finally {
      toggleVisible();
    }
  });

  return (
    <StyledTipDialog
      open={enrollConfirmPromptVisible}
      onOk={handleOk}
      okText={_t('b6df2b2024f44000ab2f')}
      onCancel={toggleVisible}
      cancelText={_t('cancel')}
      centeredFooterButton
      okLoading={loadings.enrollCurrencyProjectLoading}
      title={null}
      hiddenShowCloseX
      hiddenTitle
      closeNode={null}
      okButtonProps={{
        fullWidth: false,
      }}
    >
      {_t('24d2b004a6fa4000ac7c')}
    </StyledTipDialog>
  );
});
