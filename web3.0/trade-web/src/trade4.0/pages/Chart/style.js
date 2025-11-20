/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-07-19 10:23:44
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-09-28 18:33:56
 * @FilePath: /trade-web/src/trade4.0/pages/Chart/style.js
 * @Description:
 */
/**
 * Owner: borden@kupotech.com
 */
import { styled, fx, withMedia } from '@/style/emotion';
import { FlexColumm } from '@/style/base';
import { name } from './config';

const Hoc = (FC) => withMedia(name, FC);

export const Content = styled(FlexColumm)`
  height: 100%;
  ${fx.flex(1)}
  ${(props) => {
    if (props.isDragging) {
      return `
      pointer-events: none;
      `;
    } else {
      return `
      pointer-events: auto;
      `;
    }
  }}
`;

export const ContentWrapper = styled.div`
  height: 100%;
  &.all {
    height: calc(100% - 68px);
  }

  &.only-header {
    height: calc(100% - 33px);
  }
`;
