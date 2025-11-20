import {useQuery} from '@tanstack/react-query';

import {queryMaxChangeInvestment} from 'services/copy-trade';

export const useQueryMaxChangeInvestment = ({copyConfigId}) => {
  return useQuery({
    queryKey: ['useQueryMaxChangeInvestment', {copyConfigId}],
    queryFn: async () => await queryMaxChangeInvestment({copyConfigId}),
    cacheTime: 0,
    staleTime: 0,
    enabled: !!copyConfigId,
  });
};
