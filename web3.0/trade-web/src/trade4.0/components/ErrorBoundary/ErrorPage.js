/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { noop } from 'lodash';
import { styled } from '@kux/mui/emotion';
import { _t } from 'utils/lang';
import ErrorComputer from 'assets/error_computer.svg';

/** 样式开始 */
const Container = styled.div`
  width: 100%;
  min-height: 500px;
  position: fixed;
  z-index: 9999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
`;
const Content = styled.div`
  width: 100%;
  position: absolute;
  top: 25%;
  left: 50%;
  margin-left: -500px;
  &::after {
    content: '';
    height: 0px;
    visibility: hidden;
    display: block;
    clear: both;
    zoom: 1;
  }
`;
const LeftBox = styled.div`
  float: left;
  max-width: 520px;
`;
const RightBox = styled.div`
  float: right;
  width: 460px;
  height: 313px;
  background-image: url('../../assets/404/compatibility_computer.svg');
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: contain;
`;
const Title = styled.div`
  font-size: 34px;
  font-weight: 500;
  color: #000a1e;
  margin-bottom: 20px;
  line-height: 1.5;
`;
const Describe = styled.div`
  font-size: 14px;
  color: #6c7988;
  line-height: 24px;
  margin-top: 4px;
`;

const BtnGroup = styled.div`
  padding-top: 16px;
`;
const Button = styled.button`
  display: block;
  padding: 0 12px;
  height: 48px;
  line-height: 48px;
  min-width: 166px;
  text-align: center;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
`;
const Reload = styled(Button)`
  color: #fff;
  background: #24ae8f;
  border: 1px solid #24ae8f;
`;
const Link = styled(Button)`
  color: #464e5b;
  background: #fff;
  border: 1px solid rgb(108, 121, 136);
`;
/** 样式结束 */

const ErrorPage = ({ currentLangReady = true }) => {
  // 待国际化完成初始化再显示文本
  const transitionLang = currentLangReady ? _t : noop;
  // 帮助中心地址
  const helpCenterUrl = '/support';
  // 刷新
  const reload = () => {
    window.location.reload();
  };
  // 跳转帮助中心
  const routeToHelpCenter = () => {
    const newWindow = window.open(helpCenterUrl);
    newWindow.opener = null;
  };
  return (
    <Container>
      <Content>
        <LeftBox>
          <Title>{transitionLang('error.page.title')}😴</Title>
          <Describe>{transitionLang('error.page.info1')}</Describe>
          <Describe>{transitionLang('error.page.info2')}</Describe>
          <BtnGroup>
            <Reload onClick={reload}>
              {transitionLang('error.page.reload')}
            </Reload>
            <Link onClick={routeToHelpCenter}>
              {transitionLang('error.page.help')}
            </Link>
          </BtnGroup>
        </LeftBox>
        <RightBox style={{ backgroundImage: `url(${ErrorComputer})` }} />
      </Content>
    </Container>
  );
};

export default ErrorPage;
