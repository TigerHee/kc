/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-10 15:27:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-01 17:00:04
 * @FilePath: /trade-web/src/trade4.0/components/AbsoluteLoading/index.js
 * @Description:
 */
import React from 'react';
import { Spin } from '@kux/mui';
import styled from '@emotion/styled';

const SpinLoading = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`;

const AbsoluteLoading = (props) => {
  return (
    <SpinLoading
      size="basic"
      {...props}
    />
  );
};

export default AbsoluteLoading;
