/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState } from 'react';
import { styled, Global, css } from '@kufox/mui/emotion';
import Dialog from '@kufox/mui/Dialog';
import modalBottomBgImg from 'src/assets/referFriend/modal-bottom.png';
import closeImg from 'src/assets/referFriend/close-icon.svg';
import circleImg from 'src/assets/referFriend/circle.png';
import bg from 'src/assets/referFriend/modal-bg.png';
import face from 'src/assets/referFriend/prize-face.svg';

const Out = styled.div`
  position: relative;
  .circleImgWrap {
    position: absolute;
    top: -98px;
    left: 37.02px;
    height: 98px;
    overflow: hidden;
  }
  .circleImg {
    width: 225.96px;
    height: 239.06px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .bg {
    position: absolute;
    right: 0;
    left: 0;
    z-index: -21;
    width: 100%;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }
  .awardImg {
    position: absolute;
    top: -43px;
    left: 97px;
    width: 110px;
    height: 110px;
    &.awardImg88 {
      position: absolute;
      top: -32px;
      left: 108px;
      width: 88px;
      height: 88px;
    }

    &.awardImg91 {
      position: absolute;
      top: -42px;
      left: 103px;
      width: 91px;
    }
  }

  .modalBottomBgImg {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 46.95px;
    height: 52.17px;
  }

  .closeImg {
    position: absolute;
    bottom: -60px;
    left: 50%;
    width: 36px;
    margin-left: -18px;
    cursor: pointer;
  }

  .title {
    margin: 72px 24px 12px;
    color: #e1e8f5;
    font-weight: 700;
    font-size: 22px;
    line-height: 29px;
    text-align: center;

    ${(props) => {
      if (props.topTitle) {
        return `margin: 0 24px 12px;`;
      }
    }}
  }

  .topTitle {
    margin: 72px 24px 4px;
    color: #ffbb58;
    font-weight: 700;
    font-size: 14px;
    line-height: 130%;
    text-align: center;
  }

  .center {
    width: calc(100% - 48px) !important;
    /* margin: 0 24px; */
  }

  .content {
    max-height: 192px;
    overflow: auto;

    ${(props) => {
      if (props.hasCancelText) {
        return `max-height: 150px;`;
      }
    }}

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(243, 243, 243, 0.12);
      border-radius: 2px;
    }
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
  }

  .okBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 40px;
    margin: 24px 0;
    padding: 0 24px;
    color: #ffffff;
    font-weight: 700;
    font-size: 16px;
    font-style: normal;
    line-height: 21px;
    text-align: center;
    background: #01bc8d;
    border-radius: 20px;

    &.diabledOkButton {
      cursor: not-allowed;
      opacity: 0.4;
      pointer-events: none;
    }
  }
  .cancelText {
    width: 100%;
    margin-bottom: 32px;
    color: #ffffff;
    font-weight: 700;
    font-size: 16px;
    font-style: normal;
    line-height: 21px;
    text-align: center;
    background: none;
  }
`;

const ModalBase = ({
  showClose = false,
  awardImg88 = false,
  awardImg91 = false,
  cancelText = '',
  okText = '',
  awardImgUrl,
  topTitle = '',
  onOk,
  onCancel,
  children,
  title,
  onCloseIconClick,
  diabledOkButton,
}) => {
  return (
    <>
      <Global
        styles={css`
          .ReferFriends-Dialog.KuxDialog-body {
            width: 300px;
            max-width: 300px;
            min-height: 219px;
            background: #212631;
            border-radius: 14px;

            .KuxDialog-content {
              padding: 0;
              overflow-y: unset;
              color: unset;
              color: #fff;
              line-height: unset;
            }
          }
        `}
      />
      <Dialog
        className={'ReferFriends-Dialog'}
        open
        showCloseX={false}
        okText={null}
        cancelText={null}
        footer={null}
        header={null}
        showBanner={true}
      >
        <Out>
          <div className="circleImgWrap">
            <img src={circleImg} alt="circleImg" className="circleImg" />
          </div>
          <Wrapper className="Wrapper" hasCancelText={!!cancelText} topTitle={topTitle}>
            <img src={modalBottomBgImg} alt="modalBottomBgImg" className="modalBottomBgImg" />
            <img src={bg} alt="bg" className="bg" />
            {/* 奖品 */}
            <img
              src={awardImgUrl || face}
              alt="awardImg"
              className={`awardImg ${awardImg88 ? 'awardImg88' : ''} ${
                awardImg91 ? 'awardImg91' : ''
              }`}
            />

            {topTitle && <div className="topTitle">{topTitle}</div>}
            <div className="title">{title}</div>
            <div className="center">
              <div className="content">{children}</div>
            </div>
            <div className="center">
              <button
                className={`okBtn ${diabledOkButton ? 'diabledOkButton' : ''}`}
                onClick={onOk}
              >
                {okText}
              </button>
              {cancelText && (
                <button onClick={onCancel} className="cancelText">
                  {cancelText}
                </button>
              )}
            </div>
            {showClose && (
              <img onClick={onCloseIconClick} src={closeImg} alt="closeImg" className="closeImg" />
            )}
          </Wrapper>
        </Out>
      </Dialog>
    </>
  );
};

export default ModalBase;
