/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { useMemo } from 'react';
import { connect } from 'react-redux';
import storage from 'utils/storage';

const CoinIcon = (props) => {
  // 2022.07.08 新增
  // 添加persist参数用于提升币种图标展示体验，默认为false。老组件不受影响。
  // 当设为true时，会将此币种的iconUrl缓存到本地，页面二次刷新会先使用缓存到本地的图标进行展示
  // categories接口有更新时，会自动更新展示图标和更新本地缓存。
  const { coin, categories, dispatch, maskConfig, persist, lazyImg = false, ...rest } = props;
  const { isRTL } = useLocale();
  const iconUrl = useMemo(() => {
    const gainUrl = categories[coin]?.iconUrl || '';
    if (persist) {
      const allIconMap = storage.getItem('coinIconUrlMap') || {};
      if (!gainUrl) {
        // 未获取url使用本地缓存
        return allIconMap[coin] || '';
      } else {
        // 获取到url更新到本地
        storage.setItem('coinIconUrlMap', { ...allIconMap, [coin]: gainUrl });
      }
    }
    return gainUrl;
  }, [categories, coin, persist]);
  if (typeof maskConfig === 'object') {
    const { size, maskStyle = {}, ...other } = maskConfig;
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          verticalAlign: 'middle',
          marginRight: isRTL ? 'unset' : '8px',
          marginLeft: isRTL ? '8px' : 'unset',
          flexShrink: 0,
          ...maskStyle,
        }}
        {...rest}
      >
        <img
          src={iconUrl}
          alt="icon"
          style={{
            width: size,
            height: size,
          }}
          {...other}
        />
      </div>
    );
  }
  return <img src={iconUrl} alt="icon" {...rest} />;
};

export default connect((state) => {
  return {
    categories: state.categories,
  };
})(CoinIcon);
