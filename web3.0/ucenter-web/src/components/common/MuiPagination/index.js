/**
 * Owner: willen@kupotech.com
 */
import { Pagination, styled } from '@kux/mui';

const PaginationWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
`;

export default (props) => {
  const { total, current, pageSize, onChange, ...otherProps } = props;

  return (
    <PaginationWrapper>
      <Pagination
        total={total}
        current={current}
        pageSize={pageSize}
        defaultPageSize={pageSize}
        onChange={(e, v) => {
          if (onChange) {
            onChange(Number(v));
          }
        }}
        {...otherProps}
      />
    </PaginationWrapper>
  );
};
