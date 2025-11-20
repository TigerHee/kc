/**
 * Owner: willen@kupotech.com
 */
import {useEffect} from 'react';
import {BackHandler, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const useDisableSystemBack = () => {
  const navigation = useNavigation();

  // android禁用手势返回
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  // ios禁用手势返回
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    navigation.setOptions({gestureEnabled: false});
    return () => {
      navigation.setOptions({gestureEnabled: true});
    };
  }, [navigation]);

  return null;
};

export default useDisableSystemBack;
