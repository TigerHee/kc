/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { futuresPositionNameSpace } from '../../config';
import { useSelector } from 'react-redux';
import _ from 'lodash';

export default () => {
  const closedPositions = useSelector((state) => state[futuresPositionNameSpace].closedPositions);
  return closedPositions;
};
