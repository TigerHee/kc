import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import FAQ from '../common/components/FAQ';
import {
  Body,
  Container,
  ExSpin,
  Header,
  Layout,
  LayoutLeft,
  LayoutRight,
  MethodBox,
  Title,
} from './styled';

export default function KycKybHome({ loading, children }) {
  return (
    <Container>
      <Header>{_t('identity.verify')}</Header>
      <Body>
        <Title>{_t('cf1d84514e354800a772')}</Title>
        <Layout>
          <LayoutLeft>
            <ExSpin spinning={loading} size="xsmall">
              <MethodBox>{children}</MethodBox>
            </ExSpin>
          </LayoutLeft>
          <LayoutRight>
            <FAQ>
              <FAQ.Item
                title={_t('83ef577033794000a487')}
                description={_t('43ad7668dc0f4000a769')}
                defaultOpen
              />
              <FAQ.Item
                title={_t('86e28cd335a84000abc8')}
                description={_t('784bac090e394000addd')}
                defaultOpen
              />
              <FAQ.Item
                title={_t('7bba1021cacb4000afb8')}
                description={_tHTML('ad6a0b5be8434000aca9', {
                  url: addLangToPath('/support/47497300093892'),
                })}
              />
            </FAQ>
          </LayoutRight>
        </Layout>
      </Body>
    </Container>
  );
}
