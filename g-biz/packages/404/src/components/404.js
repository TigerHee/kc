/**
 * Owner: iron@kupotech.com
 */
import React, { useMemo } from 'react';
import { ThemeProvider } from '@kufox/mui';
import { css } from '@emotion/css';

import bg from '../../static/bg.svg';
import shield from '../../static/shield.svg';

import { useLang } from '../hookTool';

import Button from './Button';

const useStyle = () => {
  return useMemo(() => {
    return {
      root: css({
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }),
      left: css({
        '& h2': {
          color: '#000A1E',
          fontSize: '34px',
          lineHeight: '32px',
          fontWeight: 400,
          margin: 0,
        },
        '& p': {
          color: '#333333',
          fontSize: '14px',
          textAlign: 'left',
          lineHeight: '24px',
          margin: '24px 0 0 0',
        },
        '& ul': {
          padding: 0,
          margin: '4px 0 0 0',
          '& li': {
            fontSize: '14px',
            color: '#6C7988',
            lineHeight: '24px',
          },
        },
      }),
      right: css({
        width: '524px',
        height: '335px',
        background: `url(${bg}) no-repeat center`,
        padding: '46px 46px 0 46px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: '130px',
          height: '159px',
          background: `url(${shield}) no-repeat center`,
          right: '0',
          bottom: '0',
          transform: 'translate(50%, 50%)',
        },
        '& h1': {
          color: '#5A789F',
          fontSize: '32px',
          lineHeight: '36px',
          textAlign: 'center',
          margin: 0,
        },
        '& p': {
          fontSize: '24px',
          lineHeight: '36px',
          color: '#8CA1BC',
          textAlign: 'center',
          wordBreak: 'break-word',
          margin: '30px 0 0 0',
        },
      }),
    };
  }, []);
};

function Kc404() {
  const classes = useStyle();
  const {
    t,
    i18n: { language },
  } = useLang();

  const isCn = language === 'zh_CN';

  const contactUrl = 'https://www.kucoin.com/zendesk_chat.html';

  const supportUrl = isCn
    ? 'https://kucoin.zendesk.com/hc/zh-cn?lang=zh_CN'
    : 'https://kucoin.zendesk.com/hc/en-us?lang=en_US';

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <h2>{t('error_title')}</h2>
        <p>{t('error_sub_title')}</p>
        <ul>
          <li>{t('error_tips1')}</li>
          <li>{t('error_tips2')}</li>
          <li>{t('error_tips3')}</li>
        </ul>
        <div style={{ marginTop: '44px' }}>
          <Button target={contactUrl} color="primary">
            {t('error_contact')}
          </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button target={supportUrl} color="goast">
            {t('error_support')}
          </Button>
        </div>
      </div>
      <div className={classes.right}>
        <div>
          <h1>{t('error_security_title')}</h1>
          <p>{t('error_security_desc')}</p>
        </div>
      </div>
    </div>
  );
}

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'theme'}>
      <Kc404 {...props} />
    </ThemeProvider>
  );
};
