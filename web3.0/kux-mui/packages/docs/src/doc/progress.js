/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Box, LineProgress, CircleProgress } from '@kux/mui';
import Wrapper from './wrapper';

const ProgressDoc = () => {
  return (
    <Box>
      <div style={{ display: 'flex' }}>
        <div style={{ width: 260 }}>
          <p>waiting: </p>
          <LineProgress percent={0} />
          <p>basic: </p>
          <LineProgress percent={50} />
          <p>error: </p>
          <LineProgress percent={50} error />
          <p>finish: </p>
          <LineProgress percent={100} />
          <p>no info</p>
          <LineProgress percent={50} showInfo={false} />
        </div>

        <div style={{ width: 260, marginLeft: 40 }}>
          <p>waiting: </p>
          <LineProgress percent={0} size="small" />
          <p>basic: </p>
          <LineProgress percent={50} size="small" />
          <p>error: </p>
          <LineProgress percent={50} error size="small" />
          <p>finish: </p>
          <LineProgress percent={100} size="small" />
          <p>no info</p>
          <LineProgress percent={50} size="small" showInfo={false} />
        </div>
      </div>
      <div style={{ marginTop: 40, display: 'flex' }}>
        <div>
          <CircleProgress variant="circle" percent={0} />
        </div>
        <div style={{ marginLeft: 20 }}>
          <CircleProgress variant="circle" percent={50} />
        </div>
        <div style={{ marginLeft: 20 }}>
          <CircleProgress variant="circle" error percent={50} />
        </div>
        <div style={{ marginLeft: 20 }}>
          <CircleProgress variant="circle" percent={100} />
        </div>
        <div style={{ marginLeft: 20 }}>
          <CircleProgress variant="circle" percent={50} showInfo={false} />
        </div>
      </div>

      <div style={{ marginTop: 40, display: 'flex' }}>
        <div>
          <CircleProgress variant="circle" percent={0} size="small" />
        </div>
        <div style={{ marginLeft: 20 }}>
          <CircleProgress variant="circle" percent={50} size="small" />
        </div>
        <div style={{ marginLeft: 20 }}>
          <CircleProgress variant="circle" error percent={50} size="small" />
        </div>
        <div style={{ marginLeft: 20 }}>
          <CircleProgress variant="circle" percent={100} size="small" />
        </div>
        <div style={{ marginLeft: 20 }}>
          <CircleProgress variant="circle" percent={50} showInfo={false} size="small" />
        </div>
      </div>
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <ProgressDoc />
    </Wrapper>
  );
};
