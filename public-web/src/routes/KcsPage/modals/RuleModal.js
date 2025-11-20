/**
 * Owner: chris@kupotech.com
 */

import { Dialog, MDialog, styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import LevelTable from '../components/LevelTable';

const Content = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  .levelContent {
    position: relative;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 16px 0px;
  }
`;

const Dialogs = styled(Dialog)`
  button {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background: ${({ theme }) => theme.colors.text};
  }
  button:hover {
    background: ${({ theme }) => theme.colors.text};
  }
`;

function RuleModal({ ruleHandle, ruleVisible, currentScreen }) {
  const isSm = currentScreen === 'xs';
  const Component = isSm ? MDialog : Dialogs;
  const props = isSm
    ? { show: ruleVisible, back: false, onClose: ruleHandle, maskClosable: true }
    : {
        open: ruleVisible,
        onOk: ruleHandle,
        onCancel: ruleHandle,
        okText: _t('confirm'),
        okButtonProps: { type: 'default' },
        maskClosable: true,
      };
  return (
    <Component
      title={_t('0354e85414eb4000a8de')}
      size="medium"
      cancelText={null}
      okText={null}
      {...props}
    >
      <Content>
        <div className="mb-24">
          <div>{_t('01d1dc6890d64000a00a')}</div>
          <div>{_t('8f544654a8be4000a732')}</div>
        </div>
        <div className="levelContent">
          <LevelTable source="modal" />
        </div>
      </Content>
    </Component>
  );
}
export default RuleModal;
