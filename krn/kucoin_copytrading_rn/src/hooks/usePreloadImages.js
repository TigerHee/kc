import {useEffect} from 'react';
import {Image} from 'react-native';

export const usePreloadImages = images => {
  useEffect(() => {
    const tasks = Array.isArray(images) ? images : [images];

    const prefetchImages = tasks
      .filter(i => i?.indexOf?.('//') > -1)
      .map(image => Image.prefetch(image));

    Promise.all(prefetchImages).catch(error => {
      console.error('Error preloading images:', error);
    });
  }, [images]);
};
