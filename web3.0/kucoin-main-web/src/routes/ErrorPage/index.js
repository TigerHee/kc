/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { push as routerPush } from 'utils/router';
import { _t } from 'tools/i18n';
import { useTheme, Button } from '@kux/mui';
import { useStyles } from './styles';
import Img404Light from 'static/404/404-light.svg';
import Img404Dark from 'static/404/404-dark.svg';

const ErrorPage = ({ query = {}, statusCode }) => {
  const theme = useTheme();
  const styles = useStyles({ theme });

  if (typeof statusCode === 'undefined') {
    statusCode = query.statusCode;
  }
  statusCode = +statusCode;

  return (
    <div css={styles.error}>
      <div css={styles.box} data-code={`${statusCode}`}>
        <img
          src={theme.currentTheme === 'dark' ? Img404Dark : Img404Light}
          css={styles.img}
          alt="404"
        />
        <h1 css={styles.title}>{_t('abd1add770504000ab2e')}</h1>
        <h3 css={styles.description}>{_t('c8574a9825144000a98a')}</h3>
        <Button onClick={() => routerPush('/')} css={styles.button}>
          {_t('e7a7abdba9814000ad2d')}
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
