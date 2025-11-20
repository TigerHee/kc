/**
 * Owner: iron@kupotech.com
 */
/* eslint-disable prettier/prettier */
/* eslint-disable */
import React, { useState } from 'react';
import { Guide } from '@kc/entrance/lib/componentsBundle';
import { Button, SnackbarContent, ThemeProvider, message } from '@kc/mui';
import { makeStyles } from '@kc/mui/lib/styles';

const useLarge = makeStyles(() => {
  return {
    closeBox: () => ({
      position: 'absolute',
      top: 24,
      right: 24,
    }),
    closeIcon: ({ colors }) => {
      return {
        width: '48px',
        height: '48px',
        backgroundColor: '',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%',
        cursor: 'pointer',
      };
    },
  };
});
const useRes = makeStyles(() => {
  return {};
});
export default () => {
  const [open, setOpen] = useState(false);
  const [isLarge, setLarge] = useState(true);
  let classes;
  if (isLarge) {
    classes = useLarge();
  } else {
    classes = useRes();
  }
  const smMatches = true;
  return (
    <ThemeProvider theme="light">
      <div>
        <Button style={{ marginRight: '10px' }} onClick={() => setLarge(true)}>
          Large
        </Button>
        <Button onClick={() => setLarge(false)}>responsible</Button>
        <br />
        <br />
        <Button onClick={() => setOpen(!open)}>Toggle</Button>
      </div>
      <Guide
        anchor="right"
        open={open}
        classes={classes}
        onClose={() => {
          setOpen(false);
        }}
        BoxProps={{
          width: smMatches ? '100vw' : '472px',
          p: smMatches ? 3 : 6,
        }}
      />
    </ThemeProvider>
  );
};
