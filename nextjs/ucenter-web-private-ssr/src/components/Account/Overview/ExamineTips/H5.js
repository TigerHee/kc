/**
 * Owner: willen@kupotech.com
 */
import {
  ICArrowRight2Outlined,
  ICArrowRightOutlined,
  ICCloseOutlined,
  ICWarningOutlined,
} from '@kux/icons';
import { Button, Drawer, keyframes, styled } from '@kux/mui';
import { showDateTimeByZone } from 'helper';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { _t, _tHTML } from 'tools/i18n';
import { getPageId, kcsensorsManualExpose } from 'utils/ga';
import { push } from '@/utils/router';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

export const HEIGHT = 40;

const wordsLoop = keyframes`
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(calc(-100% - 10px));
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${HEIGHT}px;
  text-align: center;
  background: ${({ theme }) => theme.colors.secondary8};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${HEIGHT}px;
  padding-right: 40px;
  padding-left: 40px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-right: 12px;
    padding-left: 12px;
  }
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
`;

const ExtendWarnIcon = styled(ICWarningOutlined)`
  font-size: 16px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 8px;
`;

const Content = styled.span`
  overflow: hidden;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 8px;
  white-space: nowrap;
`;

const CloseIcon = styled(ICCloseOutlined)`
  width: 14px;
  height: 14px;
  cursor: pointer;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.icon60};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    box-sizing: content-box;
    padding-left: 8px;
    border-left: 1px solid ${({ theme }) => theme.colors.divider8};
  }
`;

const AnimateDom = styled.span`
  display: inline-block;
  animation: ${wordsLoop} 20s linear infinite;
  &:hover {
    animation-play-state: paused;
  }
`;

const Link = styled.span`
  display: inline-block;
  padding: 2px 8px 2px 12px;
  border: 1px solid;
  text-align: center;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  word-break: keep-all;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.secondary};
  & > a {
    display: flex;
    align-items: center;
    svg {
      margin-left: 2px;
    }
  }
  & a,
  a:hover,
  a:visited,
  a:active {
    color: inherit;
    text-decoration: none;
  }
`;

const SmallPageArrowRight = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  svg {
    color: ${({ theme }) => theme.colors.icon60};
  }
`;

const ExtendDrawer = styled(Drawer)`
  min-height: 33.3vh;
  max-height: 66.7vh;
  border-radius: 12px 12px 0px 0px;
  .KuxModalHeader-root {
    flex-shrink: 0;
    height: auto;
    padding: 16px;
    .KuxModalHeader-close {
      top: 14px;
      right: 16px;
      width: 28px;
      height: 28px;
    }
    .KuxModalHeader-title {
      width: 100%;
      padding-right: 58px;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 700;
      font-size: 18px;
      line-height: 130%;
      ${(props) => props.theme.breakpoints.down('sm')} {
        padding-right: 40px;
      }
    }
  }
  .KuxDrawer-content {
    display: flex;
  }
`;

const DrawerMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 76px 16px;
  position: relative;
`;
const DrawerButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
`;
const DrawerContent = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  overflow: auto;
`;

const DrawerButton = styled(Button)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 12px;
    margin-bottom: 16px;
    font-size: 12px;
  }
`;
const _Content = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
`;
const ScrollWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-color: transparent transparent;
  scrollbar-track-color: transparent;
  -ms-scrollbar-track-color: transparent;
`;
const Tips = styled.p`
  font-size: 14px;
  line-height: 21px;
  margin: 0;
  color: ${(props) => props.theme.colors.text60};
`;
const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.cover8};
  margin: 16px 0;
`;
const KycLevel = styled.div`
  & > h3 {
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 14px;
    line-height: 130%;
  }
  & > div {
    margin-bottom: 4px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    line-height: 150%;
    strong {
      font-weight: 500;
    }
    &:last-of-type {
      margin-bottom: 0px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const UserAgreement = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  line-height: 130%;
  strong {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 400;
    cursor: pointer;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 24px;
    font-size: 14px;
  }
`;
export default ({ notice, closable, closeShow, url }) => {
  const { buttonAgree, buttonAgreeWebUrl, topMessage, title, kycClearStatus, adminTips } =
    notice || {};
  const titleRef = useRef(null);
  const titleParentRef = useRef(null);
  const [needScroll, setNeedScroll] = useState(false);
  const rv = useResponsiveSSR();
  const downSmall = !rv?.sm;
  const [showDrawer, setShowDrawer] = useState(false);

  const clickClose = useCallback(() => {
    if (typeof closeShow === 'function') {
      closeShow();
    }
  }, [closeShow]);

  useEffect(() => {
    // 如果通告内容区域超长，则进行滚动播放，添加animate class
    // 加上一定的延时，防止拿不到正确的dom size
    setTimeout(() => {
      const titleEl = titleRef.current;
      const parentEl = titleParentRef.current;
      if (titleEl && parentEl) {
        setNeedScroll(titleEl.clientWidth > parentEl.clientWidth + 12);
      }
    }, 500);
  }, [titleRef, titleParentRef]);

  //计算打回结束时间 - 当前时间 > 1年
  const isOverOneYear = moment.duration(moment(notice.kycClearAt).diff(moment())).asYears() >= 1;

  return (
    <Wrapper>
      <Main onClick={() => setShowDrawer(true)}>
        <ExtendWarnIcon />
        <Content ref={titleParentRef}>
          <span ref={titleRef} style={{ display: 'inline-block' }}>
            {needScroll ? (
              <>
                <AnimateDom>{topMessage}</AnimateDom>
              </>
            ) : (
              <span>{topMessage}</span>
            )}
          </span>
        </Content>
        {downSmall ? (
          <SmallPageArrowRight>
            <ICArrowRightOutlined />
          </SmallPageArrowRight>
        ) : buttonAgreeWebUrl && buttonAgree ? (
          <Link>
            <a href={buttonAgreeWebUrl} target="_blank" rel="noopener noreferrer">
              {buttonAgree}
              <ICArrowRight2Outlined />
            </a>
          </Link>
        ) : null}
      </Main>
      {closable ? <CloseIcon onClick={clickClose} /> : null}
      {downSmall ? (
        <ExtendDrawer
          title={title}
          show={showDrawer}
          onClose={() => setShowDrawer(false)}
          anchor="bottom"
          back={false}
        >
          <DrawerMain>
            <_Content>
              {kycClearStatus === 1 ? (
                <>
                  <ScrollWrapper>
                    <Tips>{adminTips}</Tips>
                    {adminTips ? <Line /> : null}
                    <KycLevel>
                      <h3>{_t('2vW7TMpb66typtNx1LDyNt')}</h3>
                      <div>{_t('hXuuxGgQZ3pYpPEhtXFepB')}</div>
                      <div>
                        {isOverOneYear
                          ? _t('262ee07aefe84000a800')
                          : _tHTML('ugX6gMQu3aTn5fgBnWUC2o', {
                            date: showDateTimeByZone(
                              notice?.kycClearAt,
                              'YYYY/MM/DD HH:mm:ss',
                              0,
                            ),
                          })}
                      </div>
                    </KycLevel>
                  </ScrollWrapper>
                  <UserAgreement
                    onClick={(e) => {
                      if (e?.target?.nodeName?.toLocaleUpperCase() === 'STRONG') {
                        const newWindow = window.open(url);
                        if (newWindow) {
                          newWindow.opener = null;
                        }
                      }
                    }}
                  >
                    {_tHTML('s7bVrYwynBGUQWmFfoTnsA')}
                  </UserAgreement>
                </>
              ) : (
                <Tips>{topMessage}</Tips>
              )}
            </_Content>

            <DrawerButtonWrapper>
              <DrawerButton
                size="large"
                fullWidth
                onClick={() => {
                  kcsensorsManualExpose(
                    ['topMessage', '1'],
                    {
                      guideType: 'EXAMINE_MESSAGE',
                      name: 'card',
                      reportType: 'click',
                      guideColor: notice?.displayType,
                      page_id: getPageId(),
                    },
                    'publicGuideEvent',
                  );

                  push('/account/kyc?app_line=UCENTER&source=DEFAULT');
                }}
              >
                {_t('3Dn54WPNF5VzE5PZNVQ42C')}
              </DrawerButton>
            </DrawerButtonWrapper>
          </DrawerMain>
        </ExtendDrawer>
      ) : null}
    </Wrapper>
  );
};
