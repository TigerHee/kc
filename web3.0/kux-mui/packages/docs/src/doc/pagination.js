/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Pagination, Box } from '@kux/mui';
import Wrapper from './wrapper';

const PaginationDoc = () => {
  const { PaginationItem } = Pagination;
  return (
    <>
      <Box width={300}>
        <Pagination total={500} siblingCount={1} boundaryCount={0} 
        pageItem={{
          component:'a',
          getHref:(page)=>{return `https://www.kucoin.com/page/${page}`},
          domPreventDefault: true,
        }}
        onChange={(page)=>{
          console.log(page)
        }}
        />
      </Box>
      <Box mt={20}>
        <Pagination showTotal={(total) => `Total ${total} items`} total={500} 
           pageItem={{
            component:'a',
            getHref:(page)=>{return `https://www.kucoin.com/page/${page}`},
          }}
          onChange={(page)=>{
            console.log(page)
          }}
        />
      </Box>
      <Box mt={20}>
        <Pagination
          showTotal={(total) => `Total ${total} items`}
          total={500}
          renderItem={(item) => {
            return <PaginationItem {...item} component="a" />;
          }}
        />
      </Box>
      <Box mt={20}>
        <Pagination showJumpQuick total={50000} />
      </Box>
      <Box mt={20}>
        <Pagination
          showJumpQuick
          showTotal={(total) => `Total ${total} items`}
          onChange={(e, page) => {
            console.log(page);
          }}
          simple
          total={50000}
        />
      </Box>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <PaginationDoc />
    </Wrapper>
  );
};
