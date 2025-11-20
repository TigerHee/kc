/**
 * Owner: willen@kupotech.com
 */
import { Pagination, Spin, styled, Table } from '@kux/mui';
import KcPaginationJumper from 'components/common/NewKcPaginationJumper';
import useObserver from 'hooks/useResizeObserver';
import { useRef, useState } from 'react';

const TableBox = styled.div`
  [dir='rtl'] & {
    table {
      thead tr th {
        :nth-of-type(1) {
          text-align: right !important;
        }
        :nth-last-of-type(1) {
          text-align: left !important;
        }
      }
      tbody tr td {
        :nth-of-type(1) {
          text-align: right !important;
        }
        :nth-last-of-type(1) {
          text-align: left !important;
        }
      }
    }
  }
`;

const TableTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 16px;
`;

const PaginationWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 24px;
  }
`;

export default (props) => {
  const {
    title,
    needPagination,
    pagination,
    locale,
    columns,
    scrollX,
    dataSource,
    loading,
    size,
    emptyText,
    ...restProps
  } = props;
  const [showScroll, setShowScroll] = useState(false);

  const measuredRef = useRef(null);
  useObserver({
    elementRef: measuredRef,
    callback: () => {
      const clientWidth = window.innerWidth;
      if (clientWidth <= 1024) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    },
  });

  return (
    <Spin spinning={!!loading} size="small">
      <TableBox ref={measuredRef}>
        {title ? <TableTitle>{title}</TableTitle> : null}
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          // scroll={showScroll ? { x: scrollX } : null}
          {...restProps}
        />
        <PaginationWrapper>
          {needPagination && pagination ? (
            pagination.jumperPage ? (
              pagination.total > pagination.pageSize ? (
                <KcPaginationJumper {...pagination} />
              ) : null
            ) : (
              <Pagination
                total={pagination?.total}
                current={pagination?.current}
                pageSize={pagination?.pageSize}
                onChange={(e, v) => {
                  if (pagination?.onChange) {
                    pagination.onChange(Number(v));
                  }
                }}
              />
            )
          ) : null}
        </PaginationWrapper>
      </TableBox>
    </Spin>
  );
};
