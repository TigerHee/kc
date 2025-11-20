/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-10-05 22:20:26
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-12-25 19:36:45
 * @FilePath: /trade-web/src/trade4.0/components/mui/Empty.js
 * @Description:
 */
/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { Empty } from '@kux/mui';
import styled from '@emotion/styled';
import { _t } from 'utils/lang';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const StyledEmpty = styled(Empty)`
 ${(props) => {
    if (props.size === 'xsmall') {
      return `
        .KuxEmpty-img {
          width: 80px;
          height: 80px;
        }
      `;
    }
    return '';
  }}
`;
const EmptyBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  overflow: auto;
  align-items: center;
  justify-content: center;
`;

const MuiEmpty = React.memo((props) => {
  return (
    <Container>
      <EmptyBox>
        <StyledEmpty
          size="small"
          description={props.getDescription ? props.getDescription() : _t('table.empty')}
          {...props}
        />
      </EmptyBox>
    </Container>
  );
});

export default MuiEmpty;
