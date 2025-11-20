/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { CloseOutlined } from '@kufox/icons';
import { Portal } from '@kufox/mui';
import { Button } from '@kufox/mui';
import { _t } from 'tools/i18n';
import SpanForA from 'src/components/common/SpanForA';

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
  width: ${px2rem(480)};
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 90%;
  }
`;

const ModalHeader = styled.div`
  position: relative;
  height: ${px2rem(30)};
`;

const CloseX = styled(CloseOutlined)`
  position: absolute;
  right: ${px2rem(20)};
  top: ${px2rem(20)};
  cursor: pointer;
  display: block;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`;

const ModalBody = styled.div`
  padding: 0 ${px2rem(40)} ${px2rem(40)} ${px2rem(40)};
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 ${px2rem(20)} ${px2rem(40)} ${px2rem(20)};
  }
  h3 {
    margin-bottom: ${px2rem(10)};
    font-size: ${px2rem(24)};
    line-height: ${px2rem(36)};
    ${(props) => props.theme.breakpoints.down('md')} {
      font-size: ${px2rem(20)};
      line-height: ${px2rem(36)};
    }
  }
  p {
    margin: 0;
    color: rgba(0, 20, 42, 0.87);
    font-size: ${px2rem(14)};
    line-height: ${px2rem(22)};
    a {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const ModalAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${px2rem(24)} ${px2rem(40)};
  border-top: 1px solid ${(props) => props.theme.colors.divider};
  ${(props) => props.theme.breakpoints.down('md')} {
    justify-content: center;
    padding-bottom: ${px2rem(30)};
    border: none;
  }
`;

export default (props) => {
  return (
    <Portal>
      <ModalMask>
        <ModalWrapper>
          <ModalHeader>
            <CloseX onClick={props.onClose} size={20} />
          </ModalHeader>
          <ModalBody>
            <h3>{_t('application.joinus.sua')}</h3>
            <p>
              {_t('application.joinus.16.7.1')}：<SpanForA>Recruitment@kucoin.com</SpanForA>
            </p>
            <p>{_t('application.joinus.em')}</p>
          </ModalBody>
          <ModalAction>
            <Button onClick={props.onClose}>{_t('application.joinus.16.9')}</Button>
          </ModalAction>
        </ModalWrapper>
      </ModalMask>
    </Portal>
  );
};
