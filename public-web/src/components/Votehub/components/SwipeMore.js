/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-05 17:01:53
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-02-05 18:36:08
 * @FilePath: /public-web/src/components/Votehub/components/SwipeMore.js
 * @Description: 上滑加载文案
 */

import { styled } from '@kux/mui';
import { _t } from 'tools/i18n';

export const Loader = styled.div`
  width: 100%;
  margin: 4px 0;
  color: ${(props) => props.theme.colors.text40};
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 1.3;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Line = styled.div`
  width: 12px;
  height: 1px;
  background-color: ${(props) => props.theme.colors.text30};
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 1.3;
  margin: 0 8px;
`;

const SwipeMore = ({ isLoadiong, currentPage, infiniteScrollList, totalPage }) => {
  return (
    <Loader>
      {isLoadiong && currentPage > 1 ? (
        <>
          <Line />
          {_t('7tJ9ayy5vKeekrhct6Fofc')} <Line />
        </>
      ) : infiniteScrollList?.length > 0 && currentPage < totalPage ? (
        <>
          <Line />
          {_t('wCGhEHcLwTMEKjt9t8Lab6')} <Line />
        </>
      ) : (
        ''
      )}
    </Loader>
  );
};

export default SwipeMore;
