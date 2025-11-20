/**
 * Owner: mike@kupotech.com
 */
import { createContext } from 'react';
// wrapper context
export const WrapperContext = createContext('');

export const name = 'botOrderAndProfit';
//                      sm   =>md  =>lg =>lg1 =>lg2 ==> lg3
export const breakPoints = [280, 580, 768, 1024, 1440];
