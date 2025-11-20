/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICCheckboxArrowOutlined } from '@kux/icons';
import { styled, useResponsive, useTheme } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.cover2};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 12px 16px;
  }
`;
const Header = styled.div`
  display: flex;
  gap: 10px;
  color: ${({ theme }) => theme.colors.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    font-size: 12px;
  }
`;
const Label = styled.div`
  white-space: nowrap;
  padding: 2px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;
const List = styled.div`
  display: flex;
  gap: 0 8px;
  flex-wrap: wrap;
`;
const Item = styled.div`
  display: flex;
  padding: 2px 6px 2px 0;
  gap: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 6px;
    font-size: 16px;
  }
`;

const Unlock = ({ locking, list, className, children }) => {
  const theme = useTheme();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  return (
    <Container className={className}>
      <Header className="UnlockHeader">
        <Label>
          {locking ? (
            <span>{_t('9524c661b3304000ab4c')}</span>
          ) : (
            <span>{_t('2c0fc90c02114000a11a')}</span>
          )}
        </Label>
        <List>
          {list.map((item) => (
            <Item key={item}>
              <ICCheckboxArrowOutlined size={isH5 ? 10 : 14} color={theme.colors.primary} />
              {item}
            </Item>
          ))}
        </List>
      </Header>
      {children}
    </Container>
  );
};

export default Unlock;
