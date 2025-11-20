/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { Button, Dialog } from '@kufox/mui';
import { _t } from 'utils/lang';
import { px2rem } from '@kufox/mui/utils';

const Modal = styled(Dialog)`
  background: transparent;
`;

const Content = styled.div`
  width: ${px2rem(300)};
  background: ${({ theme }) => theme.colors.base};
  margin: 0 auto;
  padding: ${px2rem(24)};
  border-radius: ${px2rem(6)};
`;

const Title = styled.h3`
  font-weight: 500;
  font-size: ${px2rem(16)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
`;
const SubTitle = styled.p`
  font-weight: 400;
  font-size: ${px2rem(14)};
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: ${px2rem(16)};
`;

const TipsModal = ({ show, onClose, title, subTitle }) => {
  return (
    <Modal
      footer={null}
      header={null}
      open={show}
      onCancel={onClose}
      rootProps={{ style: { zIndex: 1071 } }}
    >
      <Content>
        <Title>{title}</Title>
        <SubTitle>{subTitle}</SubTitle>
        <Button fullWidth onClick={onClose}>
          {_t('dwvVjscGtVqf7QYVi5Wrrm')}
        </Button>
      </Content>
    </Modal>
  );
};

export default TipsModal;
