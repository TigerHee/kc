/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import InfiniteLoadingList from '../../components/Virtualized/InfiniteLoadingList';
import { useTranslation } from 'tools/i18n';
import { ModalFooter, Spin } from '@kux/mui-next';
import styles from './styles.module.scss';

const ContentBox = (props) => {
  const { t: _t } = useTranslation('notice-center');
  const {
    hasMore,
    loading,
    dataArr,
    queryMore,
    renderMsgList,
    shouldUpdateMeasurer,
    renderNoRows,
    openConfirm,
    markAllRead,
  } = props;

  console.log('==== trunkLoaded notice content');

  return (
    <div className={styles.Content}>
      <div className={styles.Body}>
        <InfiniteLoadingList
          hasNextPage={hasMore}
          isNextPageLoading={loading}
          data={dataArr}
          loadNextPage={queryMore}
          renderRow={renderMsgList}
          shouldUpdateMeasurer={shouldUpdateMeasurer}
          loadingPlaceHolder={
            <div className={styles.LoadingWrapper}>
              <Spin spinning type="normal" />
            </div>
          }
          noRowsRender={renderNoRows}
        />
      </div>
      <div>
        <ModalFooter
          okText={_t('all.read')}
          cancelText={_t('all.clear')}
          onCancel={openConfirm}
          onOk={markAllRead}
          okButtonProps={{ size: 'basic', disabled: !dataArr.length }}
          cancelButtonProps={{ variant: 'text', size: 'basic', disabled: !dataArr.length }}
          className={styles.CusModalFooter}
        />
      </div>
    </div>
  );
};

export default ContentBox;
