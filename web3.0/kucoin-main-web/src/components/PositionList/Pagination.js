/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Box } from '@kufox/mui';
import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { TablePagination } from '@kc/mui';
import { LeftOutlined, RightOutlined } from '@kufox/icons';
import { useMediaQuery } from '@kufox/mui';
import { useResponsive } from '@kufox/mui';

const Arrow = styled.div`
  width: ${px2rem(32)};
  height: ${px2rem(32)};
  background: #ffffff;
  border: 1px solid rgba(38, 50, 65, 0.08);
  box-sizing: border-box;
  color: ${(props) => (props.disabled ? props.theme.colors.disabled : props.theme.colors.primary)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
const Text = styled.div`
  font-size: ${px2rem(12)};
  line-height: ${px2rem(18)};
  margin: 0 ${px2rem(16)};
`;

const PaginationH5 = (props) => {
  const { page, count, rowsPerPage, onChangePage } = props;
  const totalPage = Math.ceil(count / rowsPerPage);
  const leftDisAled = page < 1;
  const rightDisAble = page + 1 === totalPage;
  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" mt={px2rem(30)}>
      <Arrow
        disabled={leftDisAled}
        onClick={() => {
          if (!leftDisAled) {
            onChangePage(page - 1);
          }
        }}
      >
        <LeftOutlined />
      </Arrow>
      <Text>{page + 1}</Text>
      <Arrow
        disabled={rightDisAble}
        onClick={() => {
          if (!rightDisAble) {
            onChangePage(page + 1);
          }
        }}
      >
        <RightOutlined />
      </Arrow>
    </Box>
  );
};

const PaginationPc = (props) => {
  const { page, count, rowsPerPage, onChangePage } = props;
  console.log(props, 'propsprops');
  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" mt={px2rem(60)}>
      <TablePagination
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={(event, target) => {
          onChangePage(target);
        }}
      />
    </Box>
  );
};

const Pagination = (props) => {
  useResponsive();
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return <>{sm ? <PaginationH5 {...props} /> : <PaginationPc {...props} />}</>;
};

export default Pagination;
