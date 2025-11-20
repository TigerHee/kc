/**
 * Owner: eli@kupotech.com
 */
import styled from '@emotion/styled';
import { Pagination, Table, Tag } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 6;

const DEFAULT_ROW_KEY = (_, index) => index;

export default function CommonTable({
  columns,
  dataSource,
  pagination,
  curTab,
  onRow,
  rowKey = DEFAULT_ROW_KEY,
  emptyPlaceholder = null,
  ...rest
}) {
  const [current, setCurrent] = useState(1);

  const canPaginate = pagination?.total > PAGE_SIZE;

  const list = useMemo(() => {
    const start = (current - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return dataSource?.slice(start, end) || [];
  }, [current, dataSource]);

  useEffect(() => {
    setCurrent(1);
  }, [curTab?.value]);

  if (emptyPlaceholder) {
    return (
      <Wrapper clickable={!!onRow} canPaginate={canPaginate}>
        <Table
          bordered
          rowKey={rowKey}
          columns={columns}
          dataSource={list}
          locale={{
            emptyText: emptyPlaceholder,
          }}
          // locale={{}}
          onRow={(record) => {
            return {
              onClick: () => {
                onRow?.(record);
              },
            };
          }}
          {...rest}
        />
        {canPaginate ? (
          <StyledPagination
            total={pagination.total}
            pageSize={PAGE_SIZE}
            current={current}
            onChange={setCurrent}
          />
        ) : null}
      </Wrapper>
    );
  }

  return dataSource?.length ? (
    <Wrapper clickable={!!onRow} canPaginate={canPaginate}>
      <Table
        bordered
        rowKey={rowKey}
        columns={columns}
        dataSource={list}
        onRow={(record) => {
          return {
            onClick: () => {
              onRow?.(record);
            },
          };
        }}
        {...rest}
      />
      {canPaginate ? (
        <StyledPagination
          total={pagination.total}
          pageSize={PAGE_SIZE}
          current={current}
          onChange={setCurrent}
        />
      ) : null}
    </Wrapper>
  ) : null;
}

const Wrapper = styled.div`
  overflow-x: auto;
  padding-bottom: 4px;
  table {
    th {
      padding-right: 8px;
      padding-left: 8px;
      background-color: ${({ theme }) => theme.colors.cover2};
      border-radius: 12px;
      :first-of-type {
        padding-left: 16px !important;
      }
      :last-of-type {
        padding-right: 16px !important;
      }
    }
    td {
      padding: 20px 8px;
      cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
    }
    /* td:first-child { */
    td::first-of-type {
      padding-left: 16px;
    }
    tr:last-child td {
      border-bottom: ${({ canPaginate }) => (canPaginate ? '1px solid #e8e8e8' : 'none')};
    }
    tbody tr td {
      :first-of-type {
        padding-left: 16px !important;
      }
      :last-of-type {
        padding-right: 16px !important;
      }
    }
  }
`;

export const RedText = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
`;

export const GreenText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const Coin = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text40};
`;

export const StyledPagination = styled(Pagination)`
  margin: 20px 0 12px;
  display: flex;
  justify-content: flex-end;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 0;
  }
`;

export const TagWrapper = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 2px 4px;
    font-size: 12px;
  }
`;

export const TableRightColumn = styled.div`
  text-align: right;
  display: flex;
  justify-content: end;
`;
