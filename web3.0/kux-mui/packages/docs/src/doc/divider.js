/**
 * Owner: victor.ren@kupotech.com
 */
import { Divider, Box, useTheme } from '@kux/mui';
import Wrapper from './wrapper';

const DividerDoc = () => {
  const theme = useTheme();
  return (
    <>
      <Box style={{ width: '100px' }}>
        <h1 style={{ color: theme.colors.text }}>212112</h1>
        <Divider margin="24px 0" />
        <h1 style={{ color: theme.colors.text }}>212112</h1>
      </Box>
      <Box style={{ width: '200px' }}>
        <span style={{ color: theme.colors.text }}>212112</span>
        <Divider type="vertical" />
        <span style={{ color: theme.colors.text }}>212112</span>
      </Box>
      <Box style={{ width: '300px' }}>
        <Divider orientation="left">哈哈哈</Divider>
      </Box>
      <Box style={{ width: '300px' }}>
        <Divider orientation="center">哈哈哈</Divider>
      </Box>
      <Box style={{ width: '300px' }}>
        <Divider orientation="right" margin="24px 0">哈哈哈</Divider>
      </Box>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <DividerDoc />
    </Wrapper>
  );
};
