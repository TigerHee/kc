/**
 * Owner: victor.ren@kupotech.com
 */
import { Layout, Box } from '@kux/mui';
import Wrapper from './wrapper';

const { Header, Content, Footer, Sider } = Layout;

const headerStyle = {
  background: '#7dbcea',
  textAlign: 'center',
};

const siderStyle = {
  background: '#3ba0e9',
  textAlign: 'center',
};

const contentStyle = {
  textAlign: 'center',
  minHeight: '120px',
  background: 'rgba(16, 142, 233, 1)',
};

const LayoutDoc = () => {
  return (
    <Box>
      <Box>
        <Layout>
          <Header style={headerStyle}>header</Header>
          <Content style={contentStyle}>content</Content>
          <Footer style={headerStyle}>footer</Footer>
        </Layout>
      </Box>
      <Box mt={24}>
        <Layout>
          <Header style={headerStyle}>header</Header>
          <Layout>
            <Sider style={siderStyle}>sider</Sider>
            <Content style={contentStyle}>content</Content>
          </Layout>
          <Footer style={headerStyle}>footer</Footer>
        </Layout>
      </Box>
      <Box mt={24}>
        <Layout>
          <Sider style={siderStyle}>sider</Sider>
          <Layout>
            <Header style={headerStyle}>header</Header>
            <Content style={contentStyle}>content</Content>
            <Footer style={headerStyle}>footer</Footer>
          </Layout>
        </Layout>
      </Box>
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <LayoutDoc />
    </Wrapper>
  );
};
