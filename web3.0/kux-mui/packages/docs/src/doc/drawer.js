/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { styled, Drawer, Button, Box, Typography, useTheme, ModalFooter } from '@kux/mui';
import Wrapper from './wrapper';

const Content = ({ theme, children }) => (
  <Box display="flex" flexDirection="column" height="100%">
    <Box padding="0 32px" flex={1} overflow="auto">
      {children}
      <Typography variant="h6" color={theme.colors.text} fontSize="16px" margin="12px 0">
        Id viverra in blandit
      </Typography>
      <Box fontSize="14px" color={theme.colors.text60} lineHeight="140%">
        Id viverra in blandit turpis ornare tortor facilisi porttitor consequat. Tortor justo quis enim viverra euismod. Mollis cras semper curabitur mauris. Amet id condimentum venenatis id molestie. Ullamcorper volutpat turpis est egestas amet dictum libero purus et. Feugiat amet facilisi etiam id iaculis sed aliquam donec. Euismod adipiscing id cursus odio varius fusce purus. In volutpat ullamcorper amet posuere. Tellus parturient egestas quis pretium habitasse et hendrerit dolor facilisi. Faucibus commodo faucibus netus mi pulvinar vel.
        Convallis sed malesuada tellus id. Lorem egestas massa tellus gravida libero dui blandit faucibus nunc. Ante sem id egestas lorem. Eget diam risus tellus pulvinar nunc ullamcorper aliquet ut blandit. Gravida pellentesque mattis vivamus a hac amet. Accumsan enim non gravida nunc. Purus pharetra sed odio urna ut netus porta nibh consectetur. Tortor vitae est turpis tristique pulvinar quisque.
      </Box>
      <Typography variant="h6" color={theme.colors.text} fontSize="16px" margin="12px 0">
        Id viverra in blandit
      </Typography>
      <Box fontSize="14px" color={theme.colors.text60} lineHeight="140%">
        Id viverra in blandit turpis ornare tortor facilisi porttitor consequat. Tortor justo quis enim viverra euismod. Mollis cras semper curabitur mauris. Amet id condimentum venenatis id molestie. Ullamcorper volutpat turpis est egestas amet dictum libero purus et. Feugiat amet facilisi etiam id iaculis sed aliquam donec. Euismod adipiscing id cursus odio varius fusce purus. In volutpat ullamcorper amet posuere. Tellus parturient egestas quis pretium habitasse et hendrerit dolor facilisi. Faucibus commodo faucibus netus mi pulvinar vel.
        Convallis sed malesuada tellus id. Lorem egestas massa tellus gravida libero dui blandit faucibus nunc. Ante sem id egestas lorem. Eget diam risus tellus pulvinar nunc ullamcorper aliquet ut blandit. Gravida pellentesque mattis vivamus a hac amet. Accumsan enim non gravida nunc. Purus pharetra sed odio urna ut netus porta nibh consectetur. Tortor vitae est turpis tristique pulvinar quisque.
      </Box>
    </Box>
    <ModalFooter
      cancelButtonProps={{
        size: 'basic'
      }}
      okButtonProps={{
        size: 'basic'
      }}
      onOk={() => console.log('onOk')}
      onCancel={() => console.log('onCancel')}
    />
  </Box>
);

const Doc = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Button onClick={() => setShow(true)}>Click to Show Drawer</Button>
      <Drawer style={{ width: 480 }} onBack={() => console.log('back')} title="Drawer Title" anchor="right" show={show} onClose={() => setShow(false)}>
        <Content theme={theme}>
          {/* <Button onClick={() => setShow2(true)}>Show 2</Button> */}
        </Content>
      </Drawer>
      <Drawer onBack={() => console.log('back')} title="Drawer Title2" anchor="right" show={show2} onClose={() => setShow2(false)} width="560px">
        <Content theme={theme} />
      </Drawer>
    </>
  );
};

const Content2 = ({ theme }) => (
  <Box display="flex" flexDirection="column" height="100%">
    <Box padding="0 16px" flex={1} overflow="auto">
      <Typography variant="h6" color={theme.colors.text} fontSize="16px" margin="12px 0">
        Id viverra in blandit
      </Typography>
      <Box fontSize="14px" color={theme.colors.text60} lineHeight="140%">
        Id viverra in blandit turpis ornare tortor facilisi porttitor consequat. Tortor justo quis enim viverra euismod. Mollis cras semper curabitur mauris. Amet id condimentum venenatis id molestie. Ullamcorper volutpat turpis est egestas amet dictum libero purus et. Feugiat amet facilisi etiam id iaculis sed aliquam donec. Euismod adipiscing id cursus odio varius fusce purus. In volutpat ullamcorper amet posuere. Tellus parturient egestas quis pretium habitasse et hendrerit dolor facilisi. Faucibus commodo faucibus netus mi pulvinar vel.
        Convallis sed malesuada tellus id. Lorem egestas massa tellus gravida libero dui blandit faucibus nunc. Ante sem id egestas lorem. Eget diam risus tellus pulvinar nunc ullamcorper aliquet ut blandit. Gravida pellentesque mattis vivamus a hac amet. Accumsan enim non gravida nunc. Purus pharetra sed odio urna ut netus porta nibh consectetur. Tortor vitae est turpis tristique pulvinar quisque.
      </Box>
    </Box>
    <ModalFooter
      cancelButtonProps={{
        size: 'basic'
      }}
      okButtonProps={{
        size: 'basic'
      }}
      onOk={() => console.log('onOk')}
      onCancel={() => console.log('onCancel')}
      border={false}
    />
  </Box>
);

const Doc2 = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Button onClick={() => setShow(true)}>Click to Show Dialog Drawer</Button>
      <Drawer onBack={() => console.log('back')} title="Title" anchor="bottom" show={show} onClose={() => setShow(false)}>
        <Content2 theme={theme} />
      </Drawer>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
      {/* <Doc2 /> */}
    </Wrapper>
  );
};
