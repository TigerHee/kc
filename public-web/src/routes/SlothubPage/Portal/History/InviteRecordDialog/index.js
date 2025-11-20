/**
 * owner: larvide.peng@kupotech.com
 */
import { Spin } from '@kux/mui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { useStore } from 'src/routes/SlothubPage/DetailPage/store';
import { fetchInvitePointByProjectId, getInviteRecord } from 'src/services/slothub';
import { _t } from 'tools/i18n';
import ScrollList from '../component/ScrollList';
import { ItemType } from '../constants';
import usePullHistory from '../utils';
import { BannerTitle, BannerValue, BannerWrapper, DescText, MuiDialogStyleWrapper } from './styled';

const INIT_PAGINATION = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  totalPage: 1,
};
const InviteRecordDialog = ({ visible, onClose }) => {
  const { state } = useStore();
  const { projectDetail } = state;
  const { id: projectId, currency = '' } = projectDetail || {};
  const { runAsync, loading } = usePullHistory(getInviteRecord);
  const { runAsync: run, loading: loading1 } = usePullHistory(fetchInvitePointByProjectId);
  const userSummary = useSelector((state) => state.slothub.userSummary);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState(INIT_PAGINATION);
  const { effectiveDays } = userSummary || {};

  const initialing = useMemo(() => {
    return list.length === 0 && loading;
  }, [list.length, loading]);

  const fetchInviteList = useCallback(
    (pagination, isConcat) => {
      runAsync({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        projectId: projectId,
      }).then((res) => {
        setList(isConcat ? list.concat(res.items) : res.items);
        setPagination({
          pageSize: res.pageSize,
          total: res.totalNum,
          currentPage: res.currentPage,
          totalPage: res.totalPage,
        });
      });
    },
    [list, projectId, runAsync],
  );

  const fetchInviteTotal = useCallback(() => {
    run({ projectId: projectId }).then((res) => {
      setTotal(res.data);
    });
  }, [run, projectId]);

  const loadMoreItems = useCallback(
    (currentPage) => {
      fetchInviteList({ currentPage: currentPage, pageSize: INIT_PAGINATION.pageSize }, true);
    },
    [fetchInviteList],
  );

  useEffect(() => {
    if (!visible) {
      setList([]);
      setPagination(INIT_PAGINATION);
    } else {
      fetchInviteList(pagination, true);
      fetchInviteTotal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <MuiDialogStyleWrapper
      title={_t('823aee8bad0b4000ab86')}
      size="large"
      show={visible}
      onClose={onClose}
      footer={null}
    >
      <DescText>{_t('44ac83e5d8154000ae57', { a: effectiveDays })}</DescText>
      <BannerWrapper>
        <BannerTitle>{_t('84ca18bb82c84000af72', { token: currency })}</BannerTitle>
        <BannerValue>{loading1 ? <Spin spinning type="normal" /> : total}</BannerValue>
      </BannerWrapper>
      <ScrollList
        loadMoreItems={loadMoreItems}
        pagination={pagination}
        listType={ItemType.inviteRecord}
        list={list}
        loading={loading}
        initialing={initialing}
        closeDialog={onClose}
      />
    </MuiDialogStyleWrapper>
  );
};

export default InviteRecordDialog;
