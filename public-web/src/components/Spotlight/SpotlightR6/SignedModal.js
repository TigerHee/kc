/**
 * Owner: jessie@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import Html from 'components/common/Html';
import debounce from 'lodash/debounce';
import { memo, useEffect, useRef, useState } from 'react';
import { _t } from 'tools/i18n';
import Modal from 'TradeActivityCommon/Modal';

const ButtonContent = styled.div`
  padding: 0 0 8px;
`;

const DialogWrapper = styled(Modal)`
  .KuxDialog-body {
    height: 550px;
  }
  .KuxDialog-content {
    height: 100%;
    padding: 4px;
    overflow: hidden;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    height: 90%;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 20px;
  color: ${(props) => props.theme.colors.text60};

  .content {
    height: calc(100% - 106px);
    padding: 20px 0;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.colors.text20};
      border-radius: 2px;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

const DescContent = styled.div`
  width: 100%;
  height: 42px;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text60};
`;

const SignedModal = (props) => {
  const {
    children,
    className,
    footer,
    okText,
    showCancelText,
    open,
    status,
    onCancel,
    ...restProps
  } = props;
  const [loading, setLoading] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const ref = useRef(null);

  const handleScroll = debounce(
    () => {
      if (isDown) return;
      if (ref.current) {
        if (ref.current.clientHeight >= ref.current.scrollHeight) {
          setIsDown(true);
        } else if (
          ref.current.clientHeight + ref.current.scrollTop >=
          ref.current.scrollHeight - 50
        ) {
          setIsDown(true);
        }
      }
    },
    120,
    {
      leading: false,
      trailing: true,
    },
  );

  useEffect(() => {
    return () => setIsDown(false);
  }, [open]);

  useEffect(() => {
    if (open) {
      handleScroll();
    }
  }, [open]);

  useEffect(() => {
    let dom = null;
    let interv = null;
    if (open && !interv) {
      // 防止拿不到dom
      interv = setTimeout(() => {
        dom = ref.current;
        if (dom) {
          dom.addEventListener('scroll', handleScroll);
        }
      }, 120);
    }

    return () => {
      if (interv) {
        clearTimeout(interv);
        interv = null;
      }
      if (dom) {
        dom.removeEventListener('scroll', handleScroll);
        dom = null;
      }
    };
  }, [open]);

  const handleOk = async () => {
    if (!restProps.onOk) return;

    setLoading(true);
    try {
      await restProps.onOk();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const renderFooter = () => {
    if (footer) return footer;

    const disabled = status ? false : !isDown;
    return (
      <ButtonContent>
        <DescContent>{!status ? _t('whQxLVXdijErzJsZRiHL7V') : ''}</DescContent>
        <Button fullWidth onClick={handleOk} loading={loading} disabled={disabled}>
          {okText}
        </Button>
      </ButtonContent>
    );
  };

  return (
    <DialogWrapper
      open={open}
      size="large"
      onClose={onCancel}
      onCancel={onCancel}
      {...restProps}
      footer={null}
    >
      <Content>
        <div className="content" id="content" ref={ref}>
          {children ? <Html>{children}</Html> : ''}
        </div>
        <div className="footer">{renderFooter()}</div>
      </Content>
    </DialogWrapper>
  );
};

export default memo(SignedModal);
