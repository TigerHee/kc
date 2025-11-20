/**
 * Owner: tiger@kupotech.com
 */
import { Dialog, styled, ThemeProvider } from '@kux/mui';
import { useLang } from '../hookTool';

const CustomDialog = styled(Dialog)`
  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxDialog-body {
      margin: auto 4px;
    }
  }
`;
const Content = styled.section``;
const Desc = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  span {
    color: ${(props) => props.theme.colors.text};
    text-decoration: underline;
  }
`;
const List = styled.div`
  margin: 24px 0 0;
`;
const ListItem = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  display: flex;
`;

export default ({ open, onCancel, email, theme }) => {
  const { t } = useLang();

  return (
    <ThemeProvider theme={theme || 'light'}>
      <CustomDialog
        title={t('swWntcPgPhXSojdNkNG76f')}
        size="medium"
        cancelText={null}
        okText={t('a4CTBzVQA53tTRgpeu8hHs')}
        open={open}
        onCancel={onCancel}
        onOk={onCancel}
      >
        <Content>
          <Desc>{t('7jWK1Z7pJ8fSUr6QSiBV3k')}</Desc>
          <List>
            <ListItem>{t('x5eLFGVjrWpfHbAa7beEXw', { email })}</ListItem>
            <ListItem>{t('s9SHvdGVJWrSbpmvPUe943')}</ListItem>
            <ListItem>{t('7uCPXaMDDVbFWKpefFUaSQ')}</ListItem>
          </List>
        </Content>
      </CustomDialog>
    </ThemeProvider>
  );
};
