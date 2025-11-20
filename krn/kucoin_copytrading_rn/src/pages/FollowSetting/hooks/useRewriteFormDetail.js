import {useQuery} from 'hooks/react-query';
import {useParams} from 'hooks/useParams';
import {getCopyConfigInfo} from 'services/copy-trade';
import {convertInfoData2FormValue} from '../presenter/helper';
import {useGetFormSceneStatus} from './useGetFormSceneStatus';
export const useRewriteFormDetail = () => {
  const {leadConfigId, copyConfigId} = useParams();
  const {isReadonly} = useGetFormSceneStatus();
  return useQuery({
    queryKey: ['getCopyConfigInfo', leadConfigId],
    queryFn: async () => {
      const {data} =
        (await getCopyConfigInfo({leadConfigId, copyConfigId})) || {};
      return convertInfoData2FormValue(data);
    },
    enabled: !!(isReadonly && leadConfigId),
  });
};
