/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import useLang from 'hooks/useLang';
import {FallbackPage} from '@krn/ui';
import {exitRN, openNative} from '@krn/bridge';
import {getGooglePlayLink} from 'site/constant';
import {useSelector} from 'react-redux';

const UpdateVersion = () => {
  const {_t} = useLang();
  const siteType = useSelector(state => state.app.siteType);
  const link = getGooglePlayLink(siteType);

  // 跳转到 google 应用商店
  const handlePress = () => {
    openNative(link);
  };

  return (
    <FallbackPage
      description={_t('guHqVdUrEkSvYtpiSxvm4e')}
      buttonText={_t('nRy3bJKEWfGo8we77AzQ6a')}
      onPressBack={() => exitRN()}
      onPressButton={handlePress}
    />
  );
};
export default UpdateVersion;
