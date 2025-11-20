/**
 * Owner: willen@kupotech.com
 */
import { CloseOutlined } from '@kufox/icons';
import { Button, Portal, px2rem, styled } from '@kufox/mui';
import { _t } from 'tools/i18n';

const ModalMask = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
`;

const ModalWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  box-shadow: 0 3px 4px rgba(0, 10, 30, 0.16), 0 1px 16px rgba(0, 10, 30, 0.2);
  border-radius: 4px;
  margin: auto;
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 90%;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${px2rem(600)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: ${px2rem(600)};
  }
`;

const ModalHeader = styled.div`
  position: relative;
  color: #263241;
  font-weight: 500;
  ${(props) => props.theme.breakpoints.up('sm')} {
    height: ${px2rem(30)};
    margin-bottom: ${px2rem(20)};
    padding: ${px2rem(16)} ${px2rem(16)} ${px2rem(0)};
    font-size: ${px2rem(16)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    height: ${px2rem(56)};
    margin-bottom: ${px2rem(24)};
    padding: ${px2rem(28)} ${px2rem(32)} ${px2rem(0)};
    font-size: ${px2rem(20)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    height: ${px2rem(56)};
    margin-bottom: ${px2rem(24)};
    padding: ${px2rem(28)} ${px2rem(32)} ${px2rem(0)};
    font-size: ${px2rem(20)};
  }
`;

const CloseX = styled(CloseOutlined)`
  position: absolute;
  cursor: pointer;
  ${(props) => props.theme.breakpoints.up('sm')} {
    top: ${px2rem(20)};
    right: ${px2rem(20)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    top: ${px2rem(32)};
    right: ${px2rem(32)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    top: ${px2rem(32)};
    right: ${px2rem(32)};
  }
`;

const ModalBody = styled.div`
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 ${px2rem(16)} ${px2rem(25)} ${px2rem(16)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0 ${px2rem(24)} ${px2rem(35)} ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0 ${px2rem(24)} ${px2rem(35)} ${px2rem(24)};
  }
`;

const ModalAction = styled.div`
  align-items: center;
  justify-content: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    display: none;
    padding: 0;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
    padding: 0 ${px2rem(24)} ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    display: flex;
    padding: 0 ${px2rem(24)} ${px2rem(24)};
  }
`;

export default (props) => {
  const { children, onClose } = props;
  return (
    <Portal>
      <ModalMask>
        <ModalWrapper>
          <ModalHeader>
            {_t('kcs.burn.record')}
            <CloseX onClick={onClose} size={24} />
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalAction>
            <Button onClick={onClose} fullWidth size="large">
              {_t('kcs.burn.close')}
            </Button>
          </ModalAction>
        </ModalWrapper>
      </ModalMask>
    </Portal>
  );
};
