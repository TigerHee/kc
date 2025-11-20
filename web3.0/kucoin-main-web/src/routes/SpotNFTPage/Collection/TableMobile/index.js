/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import clxs from 'classnames';
import CustomLoading from 'components/SpotNFT/CustomLoading';
import NotFound from 'components/SpotNFT/NotFound';
import { _t } from 'tools/i18n';
import { transData } from '../../util';
import style from './style.less';

const TableMobile = (props) => {
  const { data, columns = [], page, colNum = 3, loading = false, total } = props;
  const cLen = columns.length;
  if (!cLen) {
    return null;
  }
  if (loading && page === 1 && data.length === 0) {
    return (
      <div className={style.container}>
        <CustomLoading containerHeight={'250px'} size={'large'} />
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className={style.container}>
        <NotFound />
      </div>
    );
  }
  const renderTitleData = transData(columns, colNum);
  return (
    <div className={style.container}>
      {map(data, (_data, _Index) => {
        return (
          <div key={_Index} className={style.item}>
            {map(renderTitleData, (item1, idx1) => {
              return (
                <div key={'r_' + idx1} className={style.itemRow}>
                  {map(item1, (item2, idx2) => {
                    const target = columns[idx1 * colNum + idx2];
                    const { title, key, render = null, className = '' } = target;
                    const value = _data[key] || '';
                    return (
                      <div key={'c_' + idx2} className={clxs(style.itemCol, className)}>
                        <div className={style.title}>{title ? title : ''}</div>
                        <div className={style.val}>
                          {render ? render(_data, value, key) : value || ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
      {loading && <CustomLoading containerHeight={'130px'} size={'large'} />}
      {page === Math.ceil(total / 10) && (
        <div className={style.noMore}>{_t('spot.nft.list.noMore')}</div>
      )}
    </div>
  );
};

export default TableMobile;
