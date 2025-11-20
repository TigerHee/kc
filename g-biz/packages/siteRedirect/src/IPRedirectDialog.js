/**
 * Owner: brick.fan@kupotech.com
 */

import { Dialog, ThemeProvider, styled } from '@kux/mui';
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
  span {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export default ({ theme, onOpen }) => {
  const [show, setShow] = useState(false);
  const [site, setSite] = useState('');

  const { t } = useLang();

  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    window.onIPSiteChange?.((s) => {
      setSite(s);
      setShow(true);
      onOpenRef.current?.();
    });
  }, []);

  const siteName = getSiteName(site, t);

  return (
    <ThemeProvider theme={theme || 'light'}>
      <ExtendDialog
        open={show}
        onCancel={() => {
          setShow(false);
        }}
        onOk={() => {
          window._SWITCH_SITE_(site);
        }}
        centeredFooterButton
        okText={t('f8f20fdb54ed4800a803')}
        cancelText={t('1282a9de05204000a42e')}
      >
        <Wrapper>
          <img src={theme === 'dark' ? logoDark : logo} alt="logo" />
          <Title>{t('a4d911c5beb74000aa50')}</Title>
          <Content>
            <Trans i18nKey="50184c5b65814800ab6a" ns="siteRedirect" values={{ site: siteName }} />
          </Content>
        </Wrapper>
      </ExtendDialog>
    </ThemeProvider>
  );
};
