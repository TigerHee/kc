/**
 * Owner: john.zhang@kupotech.com
 */

import { Button, Dialog, styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import icon from 'static/account/transfer/net-error.svg';

export default function NetErrorDialog({
  open,
  onCancel,
  onRetry,
  title = _t('0bffde552ae54800a666'),
  content = _t('792684254c054800a2a0'),
  description = _t('7a26e0f41c554800ab32'),
  btnHoverContent = _t('763e6358279f4000a5eb'),
}) {
  return (
    <Dialog title={title} footer={null} open={open} onCancel={onCancel} size="large">
      <Content>
        <Icon src={icon} alt={content} />
        <Title>{content}</Title>
        <SubTitle>{description}</SubTitle>
        <Btn onClick={onRetry}>{btnHoverContent}</Btn>
      </Content>
    </Dialog>
  );
}

const Content = styled.div`
  margin: 80px 24px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: 40px 0 80px;
  }
`;

const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SubTitle = styled.p`
  margin: 0 0 32px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text60};
`;

const Icon = styled.img`
  width: 138px;
  height: 112px;
`;

const Btn = styled(Button)`
  width: 200px;
  padding: 10px 24px;
`;
