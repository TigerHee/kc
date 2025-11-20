/**
 * Owner: vijay.zhou@kupotech.com
 */
import { forwardRef } from 'react';
import { styled } from '@kux/mui';
import CommonModal from './CommonModal';
import ErrorInfo from './ErrorInfo';

const Container = styled.div``;

const ErrorDialog = forwardRef((props, ref) => {
  const { code, open, supplement, errorRender, onCancel, ...restProps } = props;
  return (
    <CommonModal ref={ref} open={open} header={null} onCancel={onCancel} {...restProps}>
      <Container data-testid="error-dialog">
        {errorRender?.(code, { onCancel }) || (
          <ErrorInfo code={code} supplement={supplement} onCancel={onCancel} />
        )}
      </Container>
    </CommonModal>
  );
});

export default ErrorDialog;
