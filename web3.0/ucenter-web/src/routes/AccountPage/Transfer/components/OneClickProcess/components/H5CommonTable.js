/**
 * Owner: eli@kupotech.com
 */
import styled from '@emotion/styled';
import { useEffect, useMemo, useState } from 'react';
import { StyledPagination } from './CommonTable';

const PAGE_SIZE = 6;

export default function H5Table({
  columns,
  dataSource,
  pagination,
  H5TableTitle,
  curTab,
  tab: { title, subTitle } = {},
}) {
  const [current, setCurrent] = useState(1);

  const list = useMemo(() => {
    const start = (current - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return dataSource?.slice(start, end) || [];
  }, [current, dataSource]);

  const total = dataSource?.length || 0;

  useEffect(() => {
    setCurrent(1);
  }, [curTab?.value]);

  return list.length ? (
    <H5Wrapper>
      {title || subTitle ? (
        <div>
          {title ? <TabTitle>{title}</TabTitle> : null}
          {subTitle ? <TabSubTitle>{subTitle}</TabSubTitle> : null}
        </div>
      ) : null}
      {list?.map((record, index) => {
        return (
          <H5Item key={index} columns={columns.length}>
            {H5TableTitle && <H5TableTitle record={record} columns={columns} />}
            {columns.length && dataSource.length ? (
              <H5TableBody>
                <H5StandardRow columns={columns} record={record} />
              </H5TableBody>
            ) : null}
          </H5Item>
        );
      })}
      {total > PAGE_SIZE ? (
        <StyledPagination
          total={pagination.total}
          pageSize={PAGE_SIZE}
          current={current}
          onChange={setCurrent}
        />
      ) : null}
    </H5Wrapper>
  ) : null;
}

export function getColumnByDataIndex(columns, dataIndex) {
  return columns.find((col) => col.dataIndex === dataIndex);
}

export function H5TableTitle({ title, subTitle }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <SpaceBetween>
        <span>{title}</span>
      </SpaceBetween>
      <RowTextTitle>{subTitle}</RowTextTitle>
    </div>
  );
}

export const RenderText = ({ column, record, children }) => {
  return (
    <>
      <RowTextTitle>{column.title}</RowTextTitle>
      {children ? children : <MainText>{record[column.dataIndex]}</MainText>}
    </>
  );
};

function H5StandardRow({ columns, record }) {
  return (
    <>
      {columns.map((col) => {
        return (
          <SpaceBetween key={col.dataIndex}>
            {col.render ? (
              col.render(record[col.dataIndex], record)
            ) : (
              <>
                <RowTextTitle>{col.title}</RowTextTitle>
                <MainText>{record[col.dataIndex]}</MainText>
              </>
            )}
          </SpaceBetween>
        );
      })}
    </>
  );
}

const H5Wrapper = styled.div`
  // display: flex;
  // flex-direction: column;
  // gap: 16px;
`;

const TabTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 140%; /* 19.6px */
  color: ${({ theme }) => theme.colors.text};
`;

const TabSubTitle = styled.div`
  font-size: 12px;
  line-height: 140%; /* 16.8px */
  color: ${({ theme }) => theme.colors.text40};
`;

const H5Item = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  padding: ${({ columns }) => (columns ? '16px 0' : '11.5px 0')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider4};
`;

export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  line-height: 140%; /* 21px */
  color: ${({ theme }) => theme.colors.text};
`;

const H5TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// const mainText = css`
const MainText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

export const RowTextTitle = styled.div`
  font-size: 14px;
  line-height: 140%; /* 19.6px */
  color: ${({ theme }) => theme.colors.text40};
  font-weight: 400;
`;

export const H5TableContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 10px;
`;
