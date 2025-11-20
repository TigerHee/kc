/**
 * Owner: Ray.Lee@kupotech.com
 */
import {Header} from '@krn/ui';
import React, {memo} from 'react';
import {exitRN} from '@krn/bridge';
import {useNavigation} from '@react-navigation/native';

/**
 * HeaderPro
 */
const HeaderPro = memo(props => {
  const {onPressBack, ...restProps} = props;
  const navigation = useNavigation();

  const handleDefaultPressBack = () => {
    navigation.canGoBack() ? navigation.goBack() : exitRN();
  };

  return (
    <Header
      onPressBack={onPressBack || handleDefaultPressBack}
      {...restProps}
    />
  );
});

export default HeaderPro;
