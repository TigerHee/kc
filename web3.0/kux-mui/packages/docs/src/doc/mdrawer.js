/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { styled, useTheme, Box, MDrawer, Button, Typography, ModalFooter } from '@kux/mui';
import Wrapper from './wrapper';

const Footer = styled(ModalFooter)`
  padding: 20px 32px;
`;

const Doc = () => {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(true)}>Click to Show MDrawer</Button>
      <MDrawer
        onBack={() => console.log('back')}
        back
        headerBorder
        title="MDrawer Title"
        anchor="right"
        show={show}
        onClose={() => setShow(false)}
        width="480px"
      >
        <Box display="flex" flexDirection="column" height="100%">
          <Box padding="0 16px" flex={1}>
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
          <Footer
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
      </MDrawer>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
