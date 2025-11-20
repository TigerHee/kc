/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import noop from 'lodash/noop';

import { Dialog } from '@kufox/mui';
import { css } from '@emotion/react';
import DownloadApp from '../DownloadApp';

const useStyles = () => {
  return {
    root: css`
      & .MuiDialogActions-spacing {
        border: 0;
      }
      & .MuiDialogContent-root {
        overflow: hidden;
      }
    `,
  };
};

export default function DownloadAppModal(props = {}) {
  const { visible, onClose = noop } = props;

  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      css={classes.root}
      showCloseX
      cancelText={null}
      open={visible}
      onCancel={handleClose}
      disableBackdropClick={false}
    >
      <DownloadApp />
    </Dialog>
  );
}
