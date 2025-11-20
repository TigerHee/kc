/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import CustomLoading from 'components/SpotNFT/CustomLoading';
import CustomPagination from 'components/SpotNFT/CustomPagination';
import CustomSwipeContainer from 'components/SpotNFT/CustomSwipeContainer';
import NotFound from 'components/SpotNFT/NotFound';
import fetch from 'isomorphic-fetch';
import { fill, forEach, map, throttle, cloneDeep } from 'lodash';
import { connect } from 'react-redux';
import { Schedule, Task } from 'utils/schedule';
import { useIsMobile } from 'routes/SpotNFTPage/util';
import OpenMysteryBoxAnimation from '../OpenMysteryBoxAnimation';
import Item from './Item';
import style from '../NFTList/style.less';
import { _t } from 'tools/i18n';

const schedule = new Schedule();

const MysteryBoxRecords = (props) => {
  const viewHeight = window.innerHeight;
  const viewWidth = window.innerWidth;
  const _loadedImg = useRef({});
  const animationOriginDataJson = useRef(null);
  const openResRef = useRef({});
  const [openAnimationJson, setOpenAnimationJson] = useState({});
  const openingIndexRef = useRef(-1);
  const openingLoadedIndexRef = useRef(-1);
  const [currentOpening, setCurrentOpening] = useState(null);
  const [loadedImg, setLoadedImg] = useState({});
  const [animationCanShow, setAnimationCanShow] = useState(false);
  const [animationOpen, setAnimationOpen] = useState(false);
  const { recordsInfo, dispatch, loading } = props;
  const isMobile = useIsMobile();
  const { data, loadedData, total, page } = recordsInfo;
  const needPlace = fill(new Array(10 - (data?.length || 0)), '');
  const needPlaceMobile = fill(new Array(loadedData?.length % 2), '');
  const onPageChange = useCallback(
    (val) => {
      dispatch({
        type: 'spot_nft_collection/queryMysteryBox',
        payload: { page: val },
      });
    },
    [dispatch],
  );
  const onItemClick = async (item, index, loadedIndex) => {
    const { nftId, orderId } = item;
    setCurrentOpening(nftId);
    dispatch({
      type: 'spot_nft_collection/openMysteryBox',
      payload: { nftId, orderId },
    })
      .then(async (res) => {
        if (res && res.success) {
          openingIndexRef.current = index;
          openingLoadedIndexRef.current = loadedIndex;
          openResRef.current = res.data;
          const { pictureUrl } = res.data;
          // const pictureUrl =
          //   'https://asset-v2.kucoin.net/cms/media/3js2uT22TCspcddpcSb2X7pLiIhO8eyqFujrcModX.jpeg';
          const _canShowAnimation = await getAnimationDataJson(pictureUrl);
          if (_canShowAnimation) {
            setAnimationCanShow(true);
            Promise.resolve().then(() => {
              setAnimationOpen(true);
            });
          }
        }
      })
      .finally(() => {
        setCurrentOpening(null);
      });
  };
  const onOpenClose = async () => {
    const { pictureUrl, nftId } = openResRef.current;
    await dispatch({
      type: 'spot_nft_collection/updateMysteryBoxItem',
      payload: {
        index: openingIndexRef.current,
        loadedIndex: openingLoadedIndexRef.current,
        newItem: {
          open: true,
          pictureUrl,
          nftId,
        },
      },
    });
    setAnimationOpen(false);
    setAnimationCanShow(false);
    openingIndexRef.current = -1;
    openingLoadedIndexRef.current = -1;
    openResRef.current = {};
    setOpenAnimationJson(null);
  };
  const getAnimationDataJson = async (pictureUrl) => {
    let animationData = animationOriginDataJson.current
      ? cloneDeep(animationOriginDataJson.current)
      : null;
    let imgData = null;
    let canShowAnimation = true;
    try {
      const imgRes = await fetch(pictureUrl, {
        cache: 'reload',
      });
      const fileBuffer = await imgRes.arrayBuffer();
      imgData =
        'data:image/png;base64,' +
        btoa(
          new Uint8Array(fileBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
        );
    } catch (e) {
      canShowAnimation = false;
    }
    if (!animationData) {
      const res = await fetch(
        `${__webpack_public_path__}${DEPLOY_PATH}/static/spotNFT/mystery-animation.json`,
      );
      animationData = await res.json();
      animationOriginDataJson.current = cloneDeep(animationData);
    }
    if (imgData) {
      forEach(animationData.assets, (asset) => {
        if (asset.id === 'mystery-box-placeholder.png') {
          asset.p = imgData;
        }
      });
    }
    setOpenAnimationJson(animationData);
    return canShowAnimation;
  };
  const loadImg = () => {
    schedule.clear();
    forEach(data, (item) => {
      // 不需要处理没开的，图片都是媒体库的
      if (!item.open) {
        return;
      }
      const key = item.pictureUrl;
      if (!key) {
        return;
      }
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
  const setDataToPageOne = useCallback(() => {
    dispatch({
      type: 'spot_nft_collection/setDataToPageOne',
      payload: { dataType: 'collectionsInfo' },
    });
  }, [dispatch]);

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
  return (
    <div className={style.container}>
      {animationCanShow && (
        <OpenMysteryBoxAnimation
          open={animationOpen}
          onClose={onOpenClose}
          json={openAnimationJson}
        />
      )}
      <div className={style.listContainer}>
        {map(data, (item, idx) => {
          return (
            <Item
              data={item}
              key={idx}
              index={idx}
              loadedIndex={(page - 1) * 10 + idx}
              currentOpening={currentOpening}
              onItemClick={onItemClick}
              loadedImgUrl={item.pictureUrl ? loadedImg[item.pictureUrl] : ''}
            />
          );
        })}
        {needPlace.map((_, index) => {
          return (
            <div key={page + '_place_' + index} className={cls(style.item, style.invisible)} />
          );
        })}
      </div>
      <CustomSwipeContainer onScroll={onScroll} className={style.listContainerMobile}>
        {map(loadedData, (item, idx) => {
          return (
            <Item
              data={item}
              key={idx}
              index={idx % 10}
              loadedIndex={idx}
              currentOpening={currentOpening}
              onItemClick={onItemClick}
              loadedImgUrl={item.pictureUrl ? loadedImg[item.pictureUrl] : ''}
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
    </div>
  );
};

export default connect((state) => {
  const { spot_nft_collection, loading } = state;
  const { mysteryBoxRecords } = spot_nft_collection;
  return {
    recordsInfo: mysteryBoxRecords,
    loading: loading.effects['spot_nft_collection/queryMysteryBox'],
  };
})(MysteryBoxRecords);
