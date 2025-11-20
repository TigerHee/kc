/**
 * Owner: jessie@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import { useCallback } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import Modal from '../../ActivityCommon/Modal';
import TaskContent from './TaskContent';

const ContentWrapper = styled.div`
  padding: 20px 0 0px;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 12px 0 32px;
  }
`;

const ButtonWrapper = styled.div`
  padding: 24px 0 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 20px 0 32px;
  }
`;

const TaskModal = () => {
  const dispatch = useDispatch();
  const bonusTaskList = useSelector((state) => state.gempool.bonusTaskList, shallowEqual);
  const inviteBonusLevel = useSelector((state) => state.gempool.inviteBonusLevel, shallowEqual);
  const taskModal = useSelector((state) => state.gempool.taskModal);

  const handleClose = useCallback(() => {
    dispatch({
      type: 'gempool/update',
      payload: {
        taskModal: false,
      },
    });
  }, [dispatch]);

  return (
    <Modal
      restrictHeight
      open={taskModal}
      onClose={handleClose}
      title={_t('9bc253c668bb4000a118')}
    >
      <ContentWrapper className="modal-task-content">
        <TaskContent list={bonusTaskList} onClose={handleClose} inviteBonusLevel={inviteBonusLevel} />
      </ContentWrapper>
      <ButtonWrapper>
        <Button fullWidth size="large" type="default" onClick={handleClose}>
          {_t('87135cebc25e4000aaab')}
        </Button>
      </ButtonWrapper>
    </Modal>
  );
};

export default TaskModal;
