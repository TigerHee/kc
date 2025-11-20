/**
 * Owner: iron@kupotech.com
 */
import React from 'react';

// import { Kc404 } from '@kc/404/lib/componentsBundle';

import { makeStyles } from '@kc/mui/lib/styles';

const useStyle = makeStyles({
  root: {
    width: '100%',
    height: '100vh',
    background: '#fff',
    paddingTop: '200px',
  },
  content: {
    width: '1000px',
    margin: 'auto',
  },
});

function Page404() {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.content}>{/* <Kc404 /> */}</div>
    </div>
  );
}

export default Page404;
