/**
 * Owner: tiger@kupotech.com
 * h5步骤条
 */
import { useMemo } from 'react';
import { styled } from '@kux/mui';
import { ICCloseOutlined } from '@kux/icons';
import { VIEW_PAN_NUMBER, VIEW_PAN_PHOTO, VIEW_PAN_RESULT } from '../../config';

const Wrapper = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
`;
const Left = styled.div``;
const Center = styled.div`
  display: flex;
  align-items: center;
`;
const StepItem = styled.div`
  width: 48px;
  height: 3px;
  border-radius: 8px;
  position: relative;
  background-color: ${({ theme }) => theme.colors.cover4};
  &:not(:last-child) {
    margin-right: 6px;
  }
  &::before {
    content: '';
    display: ${({ active, completed }) => (active || completed ? 'block' : 'none')};
    position: absolute;
    left: 0;
    top: 0;
    height: 3px;
    border-radius: 8px;
    width: ${({ active }) => (active ? '50%' : '100%')};
    background-color: ${({ theme }) => theme.colors.text};
  }
`;
const Right = styled.div`
  width: 20px;
`;
const CloseIcon = styled(ICCloseOutlined)`
  cursor: pointer;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

export default ({ onExit, total = 2, curView }) => {
  const current = useMemo(() => {
    if (curView === VIEW_PAN_NUMBER) {
      return 0;
    }
    if (curView === VIEW_PAN_PHOTO) {
      return 1;
    }
    if (curView === VIEW_PAN_RESULT) {
      return 2;
    }
    return 0;
  }, [curView]);

  return [VIEW_PAN_NUMBER, VIEW_PAN_PHOTO].includes(curView) ? (
    <Wrapper>
      <Left>
        <CloseIcon onClick={onExit} />
      </Left>

      <Center>
        {Array.from({ length: total }, (v, i) => i).map((item, index) => {
          const active = index === current;
          const completed = index < current;
          const key = index;

          return <StepItem active={active} completed={completed} key={key} />;
        })}
      </Center>

      <Right />
    </Wrapper>
  ) : null;
};
