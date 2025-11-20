/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-09-28 14:58:48
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-01-22 14:51:35
 * @FilePath: /public-web/src/components/common/CoinIcon/index.js
 * @Description:
 */
/**
 * Owner: willen@kupotech.com
 */
import LazyImg from 'components/common/LazyImg';
import { useMemo } from 'react';
import { connect } from 'react-redux';
import storage from 'utils/storage';
const CoinIcon = (props) => {
  // 2022.07.08 新增
  // 添加persist参数用于提升币种图标展示体验，默认为false。老组件不受影响。
  // 当设为true时，会将此币种的iconUrl缓存到本地，页面二次刷新会先使用缓存到本地的图标进行展示
  // categories接口有更新时，会自动更新展示图标和更新本地缓存。
  const {
    coin,
    categories,
    dispatch,
    maskConfig,
    persist,
    lazyImg = false,
    logoUrl = '',
    hiddenLoading = false,
    ...rest
  } = props;

  const iconUrl = useMemo(() => {
    const defaultSource =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    if (logoUrl) {
      return logoUrl;
    }
    const gainUrl = categories[coin]?.iconUrl || '';
    if (persist) {
      const allIconMap = storage.getItem('coinIconUrlMap') || {};
      if (!gainUrl) {
        // 未获取url使用本地缓存
        return allIconMap[coin] || defaultSource;
      } else {
        // 获取到url更新到本地
        storage.setItem('coinIconUrlMap', { ...allIconMap, [coin]: gainUrl });
      }
    }
    return gainUrl || defaultSource;
  }, [categories, coin, persist, logoUrl]);

  if (typeof maskConfig === 'object') {
    const { size, maskStyle = {}, ...other } = maskConfig;
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          // display: 'inline-block',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#E9EDEF',
          textAlign: 'center',
          verticalAlign: 'middle',
          marginRight: '8px',
          ...maskStyle,
        }}
        {...rest}
      >
        {lazyImg ? (
          <LazyImg
            src={iconUrl}
            style={{
              width: size - 4,
              height: size - 4,
            }}
            {...other}
          />
        ) : (
          <img
            src={iconUrl}
            alt="Coin Icon"
            style={{
              visibility: !iconUrl && hiddenLoading ? 'hidden' : 'visible',
              width: size - 4,
              height: size - 4,
            }}
            {...other}
          />
        )}
      </div>
    );
  }
  return lazyImg ? (
    <LazyImg src={iconUrl} alt="Coin Icon" {...rest} />
  ) : (
    <img
      src={iconUrl}
      alt="Coin Icon"
      style={{
        visibility: !iconUrl && hiddenLoading ? 'hidden' : 'visible',
      }}
      {...rest}
    />
  );
};

export default connect((state) => {
  return {
    categories: state.categories,
  };
})(CoinIcon);
