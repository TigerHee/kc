/**
 * Owner: willen@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import PropTypes from 'prop-types';
import React from 'react';
import NoticeIcon from '@/assets/notice/notice-warn.png';
import { _t } from 'utils/lang';

const CusDialog = styled(Dialog)`
   z-index: 1001;
   .KuxDialog-body {
     margin: auto 28px;
     .KuxModalFooter-root {
       display: flex;
       justify-content: center;
       .KuxModalFooter-buttonWrapper {
         width: 100%;
         max-width: 320px;
       }
     }
   }
 `;

const NoticeImg = styled.img`
   width: 136px;
   height: 136px;
 `;

const Content = styled.div`
   padding-top: 48px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
 `;

const Text = styled.div`
   margin-top: 16px;
   font-weight: 700;
   font-size: 28px;
   line-height: 130%;
   color: ${(props) => props.theme.colors.text};
   ${(props) => props.theme.breakpoints.down('sm')} {
     font-size: 20px;
   }
 `;

const Des = styled.div`
   margin-top: 16px;
   font-weight: 400;
   font-size: 16px;
   line-height: 150%;
   text-align: center;
   color: ${(props) => props.theme.colors.text60};
 `;

export default class ConfirmModal extends React.Component {
  render() {
    const { title, display, onClose, onConfirm, content } = this.props;

    return (
      <CusDialog
        header={null}
        open={display}
        maskClosable
        onCancel={onClose}
        cancelText={null}
        onOk={onConfirm}
        showCloseX={false}
        centeredFooterButton
        okText={_t('uidRcgr44yXM1jMLQmJWne')}
      >
        <Content>
          <NoticeImg src={NoticeIcon} />
          <Text>{title}</Text>
          <Des>{content}</Des>
        </Content>
      </CusDialog>
    );
  }
}

if (_DEV_) {
  ConfirmModal.propTypes = {
    title: PropTypes.string.isRequired,
    display: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    content: PropTypes.node.isRequired,
  };
}
