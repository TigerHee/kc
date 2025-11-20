import {useContext} from 'react';
import {NavigationRouteContext} from '@react-navigation/native';

import {RouterNameMap} from 'constants/router-name-map';

export const useRoute = () => {
  const route = useContext(NavigationRouteContext);

  if (route === undefined) {
    return {
      name: RouterNameMap.CopyTradeMain,
    };
  }
  return route;
};
