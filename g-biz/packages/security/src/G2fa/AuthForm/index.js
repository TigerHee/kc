/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { Box } from '@kufox/mui';
import { css } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';
import G2faQRCode from './G2faQRCode';
import BackupKey from './BackupKey';
import OpenG2fa from './OpenG2fa';
import UpdateG2fa from './UpdateG2fa';

import { namespace } from './model';

const useStyles = () => {
  return {
    root: css`
      position: relative;
      overflow: hidden;
    `,
    item: css`
      position: relative;
      width: 100%;
      transform: translateX(0px);
    `,
    show: css`
      position: relative;
      width: 100%;
      transform: translateX(0px);
    `,
  };
};

function AuthForm(props = {}) {
  const { userInfo = {}, activeStep, isUpdate, bizType } = props;

  const classes = useStyles();

  const dispatch = useDispatch();

  const { secretKey } = useSelector((state) => state[namespace]);

  useEffect(() => {
    dispatch({ type: `${namespace}/getG2faKey` });
  }, []);

  return (
    <Box css={classes.root}>
      <div css={classes.item} style={{ display: activeStep === 1 ? 'block' : 'none' }}>
        <G2faQRCode isUpdate={isUpdate} secretKey={secretKey} userInfo={userInfo} />
      </div>
      <div css={classes.item} style={{ display: activeStep === 2 ? 'block' : 'none' }}>
        <BackupKey secretKey={secretKey} />
      </div>
      <div css={classes.item} style={{ display: activeStep === 3 ? 'block' : 'none' }}>
        {isUpdate ? <UpdateG2fa /> : <OpenG2fa bizType={bizType} />}
      </div>
    </Box>
  );
}
export default React.memo(AuthForm);
