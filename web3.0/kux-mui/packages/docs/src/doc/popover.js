/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Popover, Button, Divider, Box, styled } from '@kux/mui';
import Wrapper from './wrapper';

const CusPopover = styled(Popover)`
  .KuxPopover-root {
    background: red;
  }
`;

const Doc = () => {
  return (
    <div>
      <Divider>top</Divider>
      <Box pl={200}>
        <Popover
          offset={10}
          placement="top"
          trigger="hover"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>
      <Divider>top-start</Divider>
      <Box pl={200}>
        <CusPopover
          offset={10}
          placement="top-start"
          trigger="click"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </CusPopover>
      </Box>
      <Divider>top-end</Divider>
      <Box pl={200}>
        <Popover
          placement="top-end"
          trigger="click"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>
      <Divider>Bottom</Divider>
      <Box pl={200}>
        <Popover
          placement="bottom"
          trigger="click"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>
      <Divider>Bottom-left</Divider>
      <Box pl={200}>
        <Popover
          placement="bottom-start"
          trigger="click"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>
      <Divider>Bottom-right</Divider>
      <Box pl={200}>
        <Popover
          placement="bottom-end"
          trigger="click"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>

      <Divider>right</Divider>
      <Box pl={200}>
        <Popover
          trigger="click"
          placement="right"
          title="2121212122"
          content={<div>212121221212122121212212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>

      <Divider>right-start</Divider>
      <Box pl={200}>
        <Popover
          trigger="click"
          placement="right-start"
          title="2121212122"
          content={<div>21212122121212212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>

      <Divider>right-start</Divider>
      <Box pl={200}>
        <Popover
          trigger="click"
          placement="right-end"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>
      <Divider>left</Divider>
      <Box pl="200px">
        <Popover
          trigger="click"
          placement="left"
          title="2121212122"
          content={<div>232323232323</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>
      <Divider>left-start</Divider>
      <Box pl="200px">
        <Popover
          trigger="click"
          placement="left-start"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>
      <Divider>left-end</Divider>
      <Box pl="200px">
        <Popover
          trigger="click"
          placement="left-end"
          title="2121212122"
          content={<div>212121221212122121212</div>}
        >
          <Button>2323</Button>
        </Popover>
      </Box>
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
