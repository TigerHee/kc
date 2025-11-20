/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import ActiveProcess from './ActiveProcess';
import { SUB_RESULT } from './constants';
const Wrapper = styled.section`
  width: 100%;
`;
const ProjectInfo = () => {
  const dispatch = useDispatch();
  const campaignId = useSelector((state) => state.spotlight7.detailInfo?.campaignId);
  const tabData = useSelector((state) => state.spotlight7.tabData, shallowEqual);
  const { userSubResultWindowShow } = tabData;

  useEffect(() => {
    // 出认购结果就不订阅了
    if (campaignId && userSubResultWindowShow !== SUB_RESULT.SUCCESS) {
      dispatch({ type: 'spotlight7/getTabData@polling', payload: { id: campaignId } });
      return () => {
        dispatch({ type: 'spotlight7/getTabData@polling:cancel', payload: { id: campaignId } });
      };
    }
  }, [dispatch, campaignId, userSubResultWindowShow]);


  if (!tabData) {
    return null;
  }
  return (
    <NoSSG>
      <Wrapper>
        <ActiveProcess {...tabData} />
      </Wrapper>
    </NoSSG>
  );
};

export default ProjectInfo;
