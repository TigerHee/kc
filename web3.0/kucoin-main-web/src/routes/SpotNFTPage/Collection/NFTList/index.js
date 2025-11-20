/**
 * Owner: willen@kupotech.com
 */
import React, { memo, useCallback, useState, useRef, useEffect, Fragment } from 'react';
import cls from 'classnames';
import SafetyAddressTipsImgModal from 'components/common/SafetyAddressTipsImg';
import CustomLoading from 'components/SpotNFT/CustomLoading';
import CustomPagination from 'components/SpotNFT/CustomPagination';
import CustomSwipeContainer from 'components/SpotNFT/CustomSwipeContainer';
import NotFound from 'components/SpotNFT/NotFound';
import SecurityDialog from 'components/SpotNFT/SecurityDialog';
import { fill, map, forEach, throttle } from 'lodash';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import { Schedule, Task } from 'utils/schedule';
import SecurityNoticeDialog from '../SecurityNoticeDialog';
import WithDrawDialog from '../WithDrawDialog';
import Item from './Item';
import { PurchaseTypeEnum, useIsMobile } from '../../util';
import style from './style.less';

const schedule = new Schedule();

const NFTList = (props) => {
  const viewHeight = window.innerHeight;
  const viewWidth = window.innerWidth;
  const _loadedImg = useRef({});
  const [loadedImg, setLoadedImg] = useState({});
  const [withDrawDialogShow, setWithDrawDialogShow] = useState(false);
  const [confirmDialogShow, setConfirmDialogShow] = useState(false);
  const [securityNoticeDialogShow, setSecurityNoticeDialogShow] = useState(false);
  const [securityDialogShow, setSecurityDialogShow] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [safeImgData, setSafeImgData] = useState({});
  const [selected, setSelected] = useState(null);
  const { collectionsInfo, dispatch, isPassedVerify, loading } = props;
  const isMobile = useIsMobile();
  const { data, loadedData, page, total } = collectionsInfo;
  const needPlace = fill(new Array(10 - (data?.length || 0)), '');
  const needPlaceMobile = fill(new Array(loadedData?.length % 2), '');
  const onItemClick = useCallback(
    (val) => {
      if (!isPassedVerify) {
        setSecurityDialogShow(true);
        return;
      }
      setSelected({ ...val });
      setWithDrawDialogShow(true);
    },
    [isPassedVerify, setSecurityDialogShow],
  );

  const onPageChange = useCallback(
    (val) => {
      dispatch({
        type: 'spot_nft_collection/queryMyNFT',
        payload: { page: val },
      });
    },
    [dispatch],
  );

  const setDataToPageOne = useCallback(() => {
    dispatch({
      type: 'spot_nft_collection/setDataToPageOne',
      payload: { dataType: 'collectionsInfo' },
    });
  }, [dispatch]);

  const getSafeImgData = useCallback(
    async (address) => {
      const memo = '';
      const amount = 1;
      const { nftId, nftName } = selected;
      const safeImgDataRes = await dispatch({
        type: 'withdraw/getSafeImg',
        payload: {
          address,
          memo,
          amount,
          currency: `#${nftId}  ${nftName}`,
        },
      });
      setSafeImgData(safeImgDataRes);
    },
    [dispatch, setSafeImgData, selected],
  );

  const onWithDialogOk = useCallback(
    async (value) => {
      setFormValue(value);
      setWithDrawDialogShow(false);
      await getSafeImgData(value.address);
      setConfirmDialogShow(true);
    },
    [getSafeImgData],
  );
  const onWithDialogCancel = useCallback(() => {
    setWithDrawDialogShow(false);
  }, []);

  const onConfirmDialogOk = useCallback(() => {
    setConfirmDialogShow(false);
    setSecurityNoticeDialogShow(true);
  }, []);
  const onConfirmDialogCancel = useCallback(() => {
    setConfirmDialogShow(false);
  }, []);

  const onSecurityNoticeDialogOk = useCallback(() => {
    setSecurityNoticeDialogShow(false);
    dispatch({
      type: 'spot_nft_collection/queryMyNFT',
      payload: {
        page,
      },
    });
    dispatch({
      type: 'spot_nft_collection/queryWithDrawRecords',
    });
  }, [dispatch, page]);
  const onSecurityNoticeDialogCancel = useCallback(() => {
    setSecurityNoticeDialogShow(false);
  }, []);
  const onSecurityDialogOk = useCallback(() => {
    setSecurityDialogShow(false);
  }, []);
  const onSecurityDialogCancel = useCallback(() => {
    setSecurityDialogShow(false);
  }, []);
  const loadImg = () => {
    schedule.clear();
    forEach(data, (item) => {
      // 不需要处理非盲盒的，图片都是媒体库的
      if (item.purchaseType !== PurchaseTypeEnum.mystery) {
        return;
      }
      const key = item.nftLogoUrl;
      const task = new Task({
        key,
        func: async () => {
          const res = await fetch(key, {
            cache: 'reload',
          });
          const file = await res.blob();
          return window.URL.createObjectURL(file);
        },
        onSuccess: (key, url) => {
          _loadedImg.current = {
            ..._loadedImg.current,
            [key]: url,
          };
          setLoadedImg(_loadedImg.current);
        },
        onError: (key) => {
          _loadedImg.current = {
            ..._loadedImg.current,
            [key]: '',
          };
          setLoadedImg(_loadedImg.current);
        },
      });
      schedule.push(task);
    });
  };

  // 一行的高度，差不多是这么高
  const oneRowHeight = viewWidth / 2 + 100;
  const onScroll = throttle((currentDocument) => {
    const _scrollTop = document.documentElement.scrollTop;
    if (loading) {
      return;
    }
    if (!isMobile) {
      return;
    }
    if (currentDocument) {
      const refHeight = currentDocument.clientHeight;
      if (
        _scrollTop > refHeight - (viewHeight - 120 + oneRowHeight) &&
        page < Math.ceil(total / 10)
      ) {
        onPageChange(page + 1);
        return;
      }
      if (_scrollTop < oneRowHeight && page > 1) {
        setDataToPageOne();
      }
    }
  }, 50);

  useEffect(() => {
    loadImg();
  }, [data]);

  // 移动端是追加显示的，这里不适用
  if (loading && (!isMobile || (page === 1 && data.length === 0))) {
    return <CustomLoading containerHeight={'250px'} size={'large'} />;
  }
  if (data.length === 0) {
    return <NotFound />;
  }

  const SafetyAddressTipsImgModalProps = {
    visible: confirmDialogShow,
    onCancel: () => onConfirmDialogCancel(),
    confirmOk: () => onConfirmDialogOk(),
    imgData: safeImgData.imgData,
    chainName: formValue.network || '',
  };

  return (
    <div className={style.container}>
      <div className={style.listContainer}>
        {map(data, (item) => {
          return (
            <Item
              data={item}
              key={item.id}
              onItemClick={onItemClick}
              loadedImgUrl={loadedImg[item.nftLogoUrl]}
            />
          );
        })}
        {needPlace.map((_, index) => {
          return <div key={'p_' + index} className={cls(style.item, style.invisible)} />;
        })}
      </div>
      <CustomSwipeContainer onScroll={onScroll} className={style.listContainerMobile}>
        {map(loadedData, (item) => {
          return (
            <Item
              data={item}
              key={item.id}
              onItemClick={onItemClick}
              loadedImgUrl={loadedImg[item.nftLogoUrl]}
            />
          );
        })}
        {needPlaceMobile.map((_, index) => {
          return <div key={'p_' + index} className={cls(style.item, style.invisible)} />;
        })}
      </CustomSwipeContainer>
      {isMobile && page === Math.ceil(total / 10) && (
        <div className={style.noMore}>{_t('spot.nft.list.noMore')}</div>
      )}
      {isMobile && loading && <CustomLoading containerHeight={'100px'} />}
      {!isMobile && total > 0 && (
        <CustomPagination total={total} current={page} onChange={onPageChange} />
      )}
      <WithDrawDialog
        open={withDrawDialogShow}
        onOk={onWithDialogOk}
        info={selected}
        onCancel={onWithDialogCancel}
      />
      <SafetyAddressTipsImgModal {...SafetyAddressTipsImgModalProps} />
      <SecurityNoticeDialog
        open={securityNoticeDialogShow}
        onOk={onSecurityNoticeDialogOk}
        formValue={formValue}
        info={selected}
        safeImgData={safeImgData}
        onCancel={onSecurityNoticeDialogCancel}
      />
      <SecurityDialog
        needEmail={true}
        needTwiceProtect={true}
        title={_t('igo.nft.collection.securityWithDrawTip')}
        open={securityDialogShow}
        onOk={onSecurityDialogOk}
        onCancel={onSecurityDialogCancel}
      />
    </div>
  );
};

export default connect((state) => {
  const { spot_nft_collection, user, loading } = state;
  const { collectionsInfo } = spot_nft_collection;
  const { securtyStatus = {} } = user;
  const { WITHDRAW_PASSWORD, EMAIL, GOOGLE2FA, SMS } = securtyStatus;
  const isPassedVerify = WITHDRAW_PASSWORD && (GOOGLE2FA || SMS) && EMAIL;
  return {
    collectionsInfo,
    isPassedVerify,
    loading: loading.effects['spot_nft_collection/queryMyNFT'],
  };
})(memo(NFTList));
