/**
 * Owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Dialog, styled } from '@kux/mui';
import { noop } from 'lodash';
import { useContext } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import { windowOpen } from '../config';
import { Context } from '../index';

// --- 样式 start ---

const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    max-width: 520px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxDialog-body {
      max-width: 100%;
    }
  }
`;

const Desc = styled.section`
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => props.theme.colors.text60};
`;

const Operate = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  button:not(:first-child) {
    margin-top: 12px;
  }
  button:last-child {
    margin-top: 0;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: centeer;
  align-items: center;
  column-gap: 12px;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 32px;
`;

const StyledButton = styled(Button)`
  width: calc((100% - 12px) / 2);
`;

// --- 样式 end ---

export default ({ onCancel, ...props }) => {
  useLocale();
  const { checkSecurity } = useContext(Context);

  const confirmLoading = useSelector(
    (state) =>
      state.loading.effects['security_new/cancellationAccount'] ||
      state.loading.effects['security_new/get_verify_type'],
  );

  return (
    <StyledDialog footer={null} onCancel={onCancel} {...props}>
      <Desc>{_t('sQV7FhDD8wZ7zEuNMdErDo')}</Desc>
      <Operate>
        <Button fullWidth onClick={() => push('/account/security')}>
          {_t('p94tQSdtNQeiaAC4LSP9RL')}
        </Button>
        <Flex>
          <StyledButton variant="outlined" loading={confirmLoading} onClick={checkSecurity || noop}>
            {_t('r3EsBGtarPaD5DPkepMm1Y')}
          </StyledButton>
          <StyledButton variant="outlined" onClick={() => windowOpen('/support')}>
            {_t('e2gTG6rHS35mvQuKFA3cHJ')}
          </StyledButton>
        </Flex>
      </Operate>
    </StyledDialog>
  );
};
