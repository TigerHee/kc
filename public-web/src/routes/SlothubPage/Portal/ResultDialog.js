/*
 * owner: borden@kupotech.com
 */
import { ICCloseOutlined } from '@kux/icons';
import { Dialog, styled, useResponsive } from '@kux/mui';
import React from 'react';
import resultBg from 'static/slothub/result-bg.svg';
import successIcon from 'static/slothub/success.svg';

const StyledDialog = styled(Dialog)`
  .KuxDialog-mask {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      background: rgba(0, 13, 29, 0.8);
      backdrop-filter: blur(8px);
    }
    ${(props) =>
      props.keepH5
        ? `
      backdrop-filter: blur(8px);
      background: rgba(0, 13, 29, 0.80);
    `
        : ''}
  }
  .KuxDialog-body {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      max-width: 300px;
    }
  }
  .KuxDialog-content {
    padding: 0;
    overflow: visible;
  }
  .KuxModalFooter-root {
    padding: 24px;
    ${({ theme }) => theme.breakpoints.up('sm')} {
      padding: 24px 32px 32px;
    }
  }
`;
const Container = styled.div`
  position: relative;
  text-align: center;
  padding: 62px 24px 0px;
  color: ${(props) => props.theme.colors.text};
  background: url(${(props) => props.bg || resultBg}) no-repeat 0 0;
  background-size: cover;
  border-radius: 20px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    ${(props) => (props.keepH5 ? '' : 'padding: 133px 32px 0px;')}
  }
`;
const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: 24px;
  }
`;
const SubTitle = styled.div`
  font-size: 16px;
  line-height: 130%;
  margin-top: 12px;
  color: ${(props) => props.theme.colors.text60};
  .highlight {
    color: #18ca51;
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 8px;
  }
`;
const Icon = styled.img`
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate3d(-50%, -50%, 0);
  ${({ theme }) => theme.breakpoints.up('sm')} {
    ${(props) =>
      props.keepH5
        ? ''
        : `
      top: 32px;
      transform: translate3d(-50%, 0, 0);
    `}
  }
`;

const CloseIcon = styled.div`
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  color: #fff;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.2);
`;

const ResultDialog = ({
  icon,
  title,
  bgSrc,
  keepH5,
  descripe,
  onCancel,
  okButtonProps,
  ...restProps
}) => {
  const { sm } = useResponsive();
  return (
    <StyledDialog
      header={null}
      keepH5={keepH5}
      /* destroyOnClose */
      cancelText={null}
      onCancel={onCancel}
      okButtonProps={{ fullWidth: true, ...okButtonProps }}
      {...restProps}
    >
      <Container bg={bgSrc} keepH5={keepH5 && onCancel}>
        {Boolean(title) && <Title>{title}</Title>}
        {Boolean(descripe) && <SubTitle>{descripe}</SubTitle>}
        <Icon
          keepH5={keepH5}
          alt="result icon"
          src={icon || successIcon}
          className="horizontal-flip-in-arabic"
        />
        {Boolean((!sm || keepH5) && onCancel) && (
          <CloseIcon onClick={onCancel}>
            <ICCloseOutlined />
          </CloseIcon>
        )}
      </Container>
    </StyledDialog>
  );
};

export default React.memo(ResultDialog);
