/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const Container = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: 24px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 12px;
    padding-top: 24px;
  }
`;
const Header = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const Item = styled.div``;
const ItemContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  .infoIcon {
    width: 16px;
    height: 16px;
    transform: translateY(2px);
    ${({ theme }) => theme.breakpoints.down('sm')} {
      transform: translateY(1px);
    }
  }
  .infoIconHidden {
    visibility: hidden;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

const InfoList = ({ list, tipMsg }) => {
  return (
    <Container>
      <Header>{tipMsg || _t('e1d2b801e2ea4000ad01')}</Header>
      {list.map(({ title, icon, desc }) => (
        <Item key={title}>
          <ItemContent>
            {icon ? icon : null}
            <div>{title}</div>
          </ItemContent>
          {desc ? desc : null}
        </Item>
      ))}
    </Container>
  );
};

export default InfoList;
