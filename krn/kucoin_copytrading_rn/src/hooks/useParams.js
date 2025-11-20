import {useRoute} from 'hooks/hybridNavigation';

export const useParams = () => {
  const route = useRoute();
  // if (__DEV__) {
  //   return {
  //     leadConfigId: 350,
  //   };
  // }

  return route?.params || {};
};
