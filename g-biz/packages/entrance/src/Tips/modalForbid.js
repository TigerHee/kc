/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback } from 'react';
import { Dialog, styled, ThemeProvider } from '@kux/mui';

import { useLang } from '../hookTool';

const Desc = styled.p`
  padding-bottom: 32px;
`;

const ModalForbid = (props) => {
  const { t } = useLang();

  const {
    title = t('tips.sorry'),
    desc = t('tips.not.sub'),
    btn = t('tips.know.back'),
    visible = true,
    onCancel = () => {},
    currentLang = '',
    HOST: { KUCOIN_HOST = '', KUCOIN_HOST_CHINA = '' } = {},
  } = props || {};

  const btnClick = useCallback(() => {
    // kucoin域名下的地址，直接跳当前根地址
    const checkHost = '.kucoin.';
    let _host = '';
    const { protocol = 'https:', host = '' } = window.location || {};
    if (host.includes(checkHost)) {
      _host = [`${protocol}//`, 'www', host.substr(host.indexOf(checkHost))].join('');
    } else {
      const isZh = currentLang === 'zh_CN' || currentLang === 'zh_HK';
      _host = isZh ? KUCOIN_HOST_CHINA : KUCOIN_HOST;
    }
    // 容错
    if (!_host) _host = KUCOIN_HOST;
    window.location.href = _host;
  }, [currentLang, KUCOIN_HOST, KUCOIN_HOST_CHINA]);

  return (
    <Dialog
      open={visible}
      title={title}
      showCloseX={false}
      cancelText={null}
      okText={btn}
      onCancel={onCancel}
      onOk={btnClick}
    >
      <Desc>{desc}</Desc>
    </Dialog>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <ModalForbid {...props} />
    </ThemeProvider>
  );
};
