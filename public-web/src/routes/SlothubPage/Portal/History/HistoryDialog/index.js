/**
 * owner: larvide.peng@kupotech.com
 */
import { Tab, Tabs, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import { useMemoizedFn } from 'ahooks';
import { find } from 'lodash';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MuiButton from 'routes/SlothubPage/components/mui/Button';
import { SENSORS } from 'routes/SlothubPage/constant';
import ScrollList from 'routes/SlothubPage/Portal/History/component/ScrollList';
import {
  BannerWrapper,
  HistoryRecordWrapper,
  MuiDialogStyleWrapper,
  NumberArea,
  NumberDesc,
} from 'routes/SlothubPage/Portal/History/HistoryDialog/styled';
import usePullHistory from 'routes/SlothubPage/Portal/History/utils';
import { useSelector } from 'src/hooks/useSelector';
import {
  getScoreExchangeRecord,
  getScoreExpiredRecord,
  getScoreGrantRecord,
} from 'src/services/slothub';
import { _t } from 'tools/i18n';
import { ItemType } from '../constants';
const Tooltip = loadable(() => import('routes/SlothubPage/Portal/History/component/Tooltip'));

const INIT_PAGINATION = {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  totalPage: 1,
};
const HistoryDialog = ({ show, onClose, onOpen }) => {
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const {
    runAsync: run1,
    loading: loading1,
    cancel: cancel1,
  } = usePullHistory(getScoreGrantRecord);
  const {
    runAsync: run2,
    loading: loading2,
    cancel: cancel2,
  } = usePullHistory(getScoreExchangeRecord);
  const {
    runAsync: run3,
    loading: loading3,
    cancel: cancel3,
  } = usePullHistory(getScoreExpiredRecord);
  const userSummary = useSelector((state) => state.slothub.userSummary);
  const [tab, setTab] = useState(ItemType.income);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState(INIT_PAGINATION);
  const { remainingPoints, expiringPoints, effectiveDays, availableProjects } = userSummary || {};

  const fetch = useMemoizedFn((newValue, _pagination, isConcat) => {
    const handleRequest = (run) => {
      run({ page: _pagination.currentPage, pageSize: _pagination.pageSize }).then((res) => {
        setList(isConcat ? list.concat(res.items) : res.items);
        setPagination({
          pageSize: res.pageSize,
          total: res.totalNum,
          currentPage: res.currentPage,
          totalPage: res.totalPage,
        });
      });
    };
    switch (newValue) {
      case ItemType.income:
        handleRequest(run1);
        break;
      case ItemType.expenditure:
        handleRequest(run2);
        break;
      case ItemType.expried:
        handleRequest(run3);
        break;
    }
  });

  const handleTabChange = (e, newValue) => {
    switch (tab) {
      case ItemType.income:
        cancel1();
        break;
      case ItemType.expenditure:
        cancel2();
        break;
      case ItemType.expried:
        cancel3();
        break;
    }
    setList([]);
    setTab(newValue);
    fetch(newValue, INIT_PAGINATION, false);
  };

  const loadMoreItems = useCallback(() => {
    fetch(tab, { currentPage: pagination.currentPage + 1, pageSize: pagination.pageSize }, true);
  }, [fetch, pagination, tab]);

  const handleOpenConvertDialog = useCallback(() => {
    SENSORS.historyExchange();
    onClose();
    dispatch({
      type: 'slothub/updateConvertDialogConfig',
      payload: {
        open: true,
        onCancel: () => {
          onOpen();
        },
      },
    });
  }, [dispatch, onClose, onOpen]);

  const handleCloseHistoryDialog = () => {
    onClose();
  };

  const initialing = list.length === 0 && (loading1 || loading2 || loading3);

  useEffect(() => {
    if (!show) {
      setTab(0);
      setList([]);
      setPagination(INIT_PAGINATION);
    } else {
      fetch(tab, INIT_PAGINATION, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <MuiDialogStyleWrapper
      title={_t('c7f60f211adb4000af77')}
      size="large"
      show={show}
      onOk={handleCloseHistoryDialog}
      onClose={handleCloseHistoryDialog}
      footer={null}
    >
      <BannerWrapper>
        <div>
          <NumberArea>
            <span className="number">{remainingPoints}</span>
            {remainingPoints > 0 && (
              <Tooltip expiringPoints={expiringPoints} effectiveDays={effectiveDays} />
            )}
          </NumberArea>
          <NumberDesc>{_t('76683051dae04000a97e')}</NumberDesc>
        </div>
        <MuiButton
          size={sm ? 'basic' : 'small'}
          disabled={remainingPoints === 0 || !find(availableProjects, (v) => v.listStatus === 0)}
          onClick={handleOpenConvertDialog}
          className="convertBtn"
        >
          {_t('664e8047fd874000aa9b')}
        </MuiButton>
      </BannerWrapper>
      <HistoryRecordWrapper>
        <Tabs
          className="historyrecordtabs"
          size={sm ? 'medium' : 'small'}
          value={tab}
          onChange={handleTabChange}
          variant="line"
        >
          <Tab label={_t('6d0107c304e44000abf4')} />
          <Tab label={_t('5e5baed989c44000af85')} />
          <Tab label={_t('64a85dd80c554000a22c')} />
        </Tabs>
        <ScrollList
          loadMoreItems={loadMoreItems}
          pagination={pagination}
          listType={tab}
          list={list}
          loading={loading1 || loading2 || loading3}
          initialing={initialing}
          closeDialog={onClose}
        />
      </HistoryRecordWrapper>
    </MuiDialogStyleWrapper>
  );
};

export default memo(HistoryDialog);
