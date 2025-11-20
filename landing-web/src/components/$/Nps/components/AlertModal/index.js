/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo, useState } from 'react';
import Dialog from '@kufox/mui/Dialog';
import { css, Global } from '@kufox/mui/emotion';
import { styled } from '@kufox/mui/emotion';
import useResponsive from '@kufox/mui/hooks/useResponsive';
import useTheme from '@kufox/mui/hooks/useTheme';
// import { ReactComponent as Close } from 'src/assets/nps/close.svg';
import classnames from 'classnames';
import { Button } from '@kufox/mui';

const BannerImgWrap = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  margin: -24px 0 18px 0;

  ${(props) => props.theme.breakpoints.down('md')} {
    margin: -32px 0 24px 0;
  }
`;

const BannerImg = styled.img`
  width: 100%;
`;

// const TypedClose = styled(Close)`
//   width: 100%;
//   cursor: pointer;
//   color: red;
//   position: absolute;
//   bottom: -45px;
//   z-index: 33;
//   left: 50%;
//   margin-left: -50%;
//   color: red;
// `;

const TruthyContent = styled.div`
  padding: 0 24px 0;
`;

const HeaderTitle = styled.div`
  padding: 0;
  ${(props) => {
    if (props.isDark) {
      return `color: #fff;`;
    }
    return `color: #000d1d;`;
  }}
  font-weight: 500;
  font-size: 16px;
  width: 100%;
  position: relative;
  line-height: 30px;
  margin-bottom: 4px;

  ${(props) => props.theme.breakpoints.down('md')} {
    margin-bottom: 0;
    padding: 0;
    font-weight: 600;
    font-size: 16px;
    .hasChildren & {
      margin-bottom: 12px;
      font-size: 20px;
    }
  }
`;

const TruthyChildren = styled.div`
  ${(props) => {
    if (props.theme.currentTheme === 'dark') {
      return `color: rgba(225, 232, 245, 0.4);`;
    }
    return `color: rgba(0, 13, 29, 0.4);`;
  }}
  ${(props) => props.theme.breakpoints.down('md')} {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    .hasTitle & {
      font-weight: 400;
    }
  }
`;

const AlertModal = (props) => {
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';

  const {
    children,
    className,
    title,
    okWords,
    cancelWords,
    bannerImg,
    onCancel,
    onOk,
    transparentBg,
    renderBannerImgExtra,
    // 开启超长文本时的滚动条
    overflowScroll = true,
    // showBottomClose = false,
    ...restProps
  } = props;
  const { md, lg } = useResponsive();
  const classNamePro = classnames('GbizKit-Dialog', className, {
    ['transparentBg']: transparentBg,
    ['hasBannerImg']: !!bannerImg,
    ['hasCancelWords']: !!cancelWords,
    ['hasChildren']: !!children,
    ['hasTitle']: !!title,
  });
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    if (!onOk) return;

    setLoading(true);
    try {
      await onOk();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const renderFooter = () => {
    let cancelBtnProps = {
      variant: 'text',
    };
    // pad/pc变为左右布局且样式变化
    if (md || lg) {
      cancelBtnProps = {
        variant: 'contained',
        type: 'default',
      };
    }

    return (
      <div className={'dialog__btns'}>
        <>
          {okWords && (
            <Button className={'dialog__btns_ok'} onClick={handleOk} loading={loading}>
              {okWords}
            </Button>
          )}
          <>
            {cancelWords && (
              <Button
                {...cancelBtnProps}
                className={'dialog__btns_cancel'}
                onClick={() => {
                  onCancel && onCancel();
                }}
              >
                {cancelWords}
              </Button>
            )}
          </>
        </>
      </div>
    );
  };

  return (
    <>
      <Dialog
        data-testid="AlertModal-Dialog"
        className={classNamePro}
        footer={renderFooter()}
        renderBannerImgExtra
        showCloseX={false}
        {...restProps}
      >
        {bannerImg && (
          <BannerImgWrap>
            {renderBannerImgExtra && renderBannerImgExtra()}
            {typeof bannerImg === 'string' ? (
              <BannerImg src={bannerImg} alt="BannerImg" />
            ) : (
              bannerImg
            )}
          </BannerImgWrap>
        )}
        <TruthyContent overflowScroll={overflowScroll} className="GbizKit-Dialog-TruthyContent">
          {title && (
            <HeaderTitle
              className="GbizKit-Dialog-HeaderTitle"
              data-testid="HeaderTitle"
              isDark={isDark}
            >
              {title}
            </HeaderTitle>
          )}
          {children && (
            <TruthyChildren className="GbizKit-Dialog-TruthyChildren">{children}</TruthyChildren>
          )}
        </TruthyContent>
      </Dialog>
      <Global
        styles={css`
          .GbizKit-Dialog-TruthyContent {
            @media screen and (max-width: 768px) {
              &::-webkit-scrollbar {
                width: 4px;
                background: transparent;
              }
              &::-webkit-scrollbar-track {
                background: transparent;
              }
              &::-webkit-scrollbar-thumb {
                width: 4px;
                height: 80px;
                background: rgba(0, 13, 29, 0.12);
                border-radius: 10px;
              }
            }
          }

          /* 无背景图 */
          .KuxDialog-body.GbizKit-Dialog {
            .GbizKit-Dialog-TruthyContent {
              @media screen and (max-width: 768px) {
                /* max-height: 284px; */
                /* max-height: 400px; */
                /* overflow-y: auto; */
              }
            }
          }

          .KuxDialog-body.GbizKit-Dialog.hasCancelWords {
            .GbizKit-Dialog-TruthyContent {
              @media screen and (max-width: 768px) {
                max-height: 255px;
              }
            }
          }

          /* 有背景图 */
          .KuxDialog-body.GbizKit-Dialog.hasBannerImg {
            .GbizKit-Dialog-TruthyContent {
              @media screen and (max-width: 768px) {
                /* max-height: 160px; */
                /* overflow-y: auto; */
              }
            }
          }

          .KuxDialog-body.GbizKit-Dialog.hasBannerImg.hasCancelWords {
            .GbizKit-Dialog-TruthyContent {
              @media screen and (max-width: 768px) {
                max-height: 131px;
              }
            }
          }

          .KuxDialog-body.GbizKit-Dialog {
            &.transparentBg {
              background-color: transparent;
            }

            @media screen and (max-width: 768px) {
              width: 300px;
              max-width: 300px;
              /* max-height: 412px; */
              border-radius: 8px;
            }
          }
          .GbizKit-Dialog .KuxDialog-header {
            display: none;
          }

          .GbizKit-Dialog .KuxDialog-content {
            padding: 24px 0;
            color: ${isDark ? 'rgba(225, 232, 245, 0.4)' : 'rgba(0, 13, 29, 0.4)'};
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;

            @media screen and (max-width: 768px) {
              padding: 32px 0 24px;
            }
          }
          .GbizKit-Dialog {
            .dialog__btns {
              display: flex;
              flex-direction: row-reverse;
              .dialog__btns_ok,
              .dialog__btns_cancel {
                flex: 1;
                font-weight: 600;
                line-height: 14px;
              }
              .dialog__btns_cancel {
                margin-right: 12px;
              }

              @media screen and (max-width: 768px) {
                display: flex;
                flex-direction: column;

                .dialog__btns_ok {
                  line-height: 17px;
                }

                .dialog__btns_ok,
                .dialog__btns_cancel {
                  flex: unset;
                  width: 100%;
                  margin: 0;
                  font-weight: 600;
                }

                .dialog__btns_cancel {
                  height: auto;
                  margin: 16px 0 0 0;
                  font-weight: 500;
                  line-height: 16px;
                }
              }
            }
          }
        `}
      />
    </>
  );
};

export default memo(AlertModal);
