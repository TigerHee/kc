import {useSelector} from 'react-redux';

import {useQuery} from 'hooks/react-query';
import {queryHasCopyConfig} from 'services/copy-trade';

export const useHasCopyConfig = () => {
  const {uid} = useSelector(state => state.app.userInfo) || {};
  return (
    useQuery({
      queryKey: ['queryHasCopyConfig', uid],
      queryFn: async () => {
        return (await queryHasCopyConfig()) || {};
      },
    }) || {}
  );
};
