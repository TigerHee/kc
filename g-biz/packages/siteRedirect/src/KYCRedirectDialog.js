/**
 * Owner: brick.fan@kupotech.com
 */

import { ICWaitOutlined } from '@kux/icons';
import { Button, Dialog, ThemeProvider, styled } from '@kux/mui';
import { Trans } from '@tools/i18n';
import { useEffect, useState, useRef } from 'react';
import logoDark from './asset/warning-dark.svg';
import logo from './asset/warning.svg';
import useLang from './hookTool/useLang';
import { getSiteName } from './utils';

const ExtendDialog = styled(Dialog)`
  .KuxModalHeader-close {
    [dir='rtl'] & {
      right: unset;
      left: 32px;
    }
  }
  .KuxDialog-body {
    .KuxModalHeader-root {
      position: absolute;
    }
  }
  .KuxModalFooter-buttonWrapper {
    [dir='rtl'] & > button:nth-of-type(1) {
      margin-right: 0;
      margin-left: 12px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 24px 24px;
    .KuxModalFooter-root {
      padding-top: 16px;
    }
    .KuxModalFooter-buttonWrapper {
      display: flex;
      flex-wrap: wrap-reverse;
      gap: 12px;
      & > button {
        flex: auto;
        width: 100%;
        margin-left: unset !important;
        margin-right: unset !important;
      }
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 32px;
  img {
    width: 136px;
    height: 136px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: 32px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const Content = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  text-align: center;
  margin-bottom: 24px;
  span {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TimerText = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 16px;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  svg {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.text60};
    opacity: 0.6;
    [dir='rtl'] & {
      margin-right: 0;
      margin-left: 8px;
    }
  }
  span {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primary};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 12px;
  }
`;

export default ({ theme, onOpen }) => {
  const [show, setShow] = useState(false);
  const [site, setSite] = useState('');
  const [timer, setTimer] = useState(5);

  const { t } = useLang();

  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    window.onKYCSiteChange?.((s) => {
      setSite(s);
      setShow(true);
      onOpenRef.current?.();
    });
  }, []);

  const siteName = getSiteName(site, t);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          window._SWITCH_SITE_(site);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [show, site]);

  return (
    <ThemeProvider theme={theme || 'light'}>
      <ExtendDialog open={show} showCloseX={false} footer={null}>
        <Wrapper>
          <img src={theme === 'dark' ? logoDark : logo} alt="logo" />
          <Title>{t('3705a22def0d4800a1b9')}</Title>
          <Content>
            <Trans i18nKey="5db2931fb7474800a935" ns="siteRedirect" values={{ site: siteName }} />
          </Content>
          <Button
            onClick={() => {
              window._SWITCH_SITE_(site);
            }}
            fullWidth
          >
            {t('0e69c213ac414800a71a')}
          </Button>
          <TimerText>
            <ICWaitOutlined />
            <Trans i18nKey="2441224b3dbb4000a184" ns="siteRedirect" values={{ time: timer }} />
          </TimerText>
        </Wrapper>
      </ExtendDialog>
    </ThemeProvider>
  );
};
