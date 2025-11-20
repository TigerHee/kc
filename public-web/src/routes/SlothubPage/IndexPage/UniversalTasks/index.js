/*
 * owner: borden@kupotech.com
 */
import { useDocumentVisibility } from 'ahooks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import InviteBar from './InviteTask';
import { Container } from './style';
import PanelContent from './UniversalTask';

const UniversalTasks = (props) => {
  const dispatch = useDispatch();
  const documentVisibility = useDocumentVisibility();

  // kyc任务 & 交易任务都是跳页面执行，在页面可见性从新变为可见时，重刷下接口
  useEffect(() => {
    if (documentVisibility === 'visible') {
      dispatch({ type: 'slothub/pullBasicTasksInfo' });
    }
  }, [documentVisibility]);

  // useEffect(() => {
  //   if (isInApp) {
  //     window.onListenEvent('onLogin', () => {
  //       dispatch({ type: 'slothub/pullBasicTasksInfo' });
  //     });
  //   }
  // }, [isInApp]);

  return (
    <Container>
      <PanelContent />
      <InviteBar />
    </Container>
  );
};

export default UniversalTasks;
