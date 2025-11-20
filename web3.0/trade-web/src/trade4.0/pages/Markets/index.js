/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-05 14:59:26
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-07-02 15:30:31
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/index.js
 * @Description:
 */
import React, { memo } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import MarketsWrapper from './components/Markets';
import { name } from './config';
import { Wrapper } from './style';

export default memo((props) => {
  return (
    <ComponentWrapper name={name} breakPoints={[400, 1000]} isCustomKey>
      <Wrapper className="markets">
        <MarketsWrapper {...props} />
      </Wrapper>
    </ComponentWrapper>
  );
});
