/*
 * @owner: borden@kupotech.com
 */
import { useContext } from 'react';
import { SideContext } from '../config';

export default function useSide() {
  return useContext(SideContext);
}
