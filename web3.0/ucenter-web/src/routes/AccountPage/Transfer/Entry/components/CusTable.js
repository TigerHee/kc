/**
 * Owner: john.zhang@kupotech.com
 */

import styled from '@emotion/styled';

export const Container = styled.div`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  line-height: 1.4;
`;

const Title = styled.div`
  padding: 10px 12px 0 12px;
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-left: 0;
  }
`;

export const ListBox = styled.div`
  display: flex;
  flex-direction: column;
`;
export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: 12px;
  color: ${({ theme }) => theme.colors.text};
  :last-child {
    border-bottom: none;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 10px 0;
    font-size: 14px;
  }
`;

const renderContent = (data, column, index) => {
  const value = data?.[column?.dataIndex] || '';
  if (typeof column.render === 'function') {
    return column.render(value, data, index);
  }
  return value;
};

const CusTable = ({ columns = {}, dataSource = [] }) => {
  const { title = '', columnList = [] } = columns;
  return (
    <Container>
      <Title>{title}</Title>
      <ListBox>
        {dataSource.map((itemData) => (
          <ListItem>
            {columnList.map((column, index) => renderContent(itemData, column, index))}
          </ListItem>
        ))}
      </ListBox>
    </Container>
  );
};

export default CusTable;
