/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { futuresPositionNameSpace } from '../../config';
import { useSelector } from 'react-redux';
import _ from 'lodash';

export default () => {
  const fills = useSelector((state) => state[futuresPositionNameSpace].fills);
  return fills;
};
