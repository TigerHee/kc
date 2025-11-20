/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ExclamationOutlined, ICArrowRightOutlined, ICCheckboxArrowOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { createContext, useContext, useEffect, useState } from 'react';

const Context = createContext({ current: 0 });

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
`;
const Circle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 24px;
  background: ${({ theme, active, error }) =>
    error ? theme.colors.secondary : active ? theme.colors.text : theme.colors.text20};
  color: ${({ theme }) => theme.colors.textEmphasis};
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 20px;
  }
`;
const CompletedIcon = styled(ICCheckboxArrowOutlined)`
  font-size: 16px;
`;
const StepName = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: ${({ show }) => (show ? 'block' : 'none')};
  }
`;
const ErrorIcon = styled(ExclamationOutlined)`
  font-size: 16px;
`;

function Step({ name, index, error }) {
  const { current } = useContext(Context);
  const isActive = current >= index;
  return (
    <StepContainer active={isActive}>
      <Circle active={isActive} error={error}>
        {error ? <ErrorIcon /> : current > index ? <CompletedIcon /> : index}
      </Circle>
      <StepName show={current === index}>{name}</StepName>
    </StepContainer>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 32px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`;

const ArrowRightIcon = styled(ICArrowRightOutlined)`
  font-size: 16px;
  margin: 0 12px;
  color: ${({ theme }) => theme.colors.text30};
`;

function Steps({ current, children }) {
  const [steps, setSteps] = useState([]);
  useEffect(() => {
    const _steps = [];
    children
      ?.filter((child) => child?.type === Step)
      .forEach((child, index) => {
        if (index) {
          _steps.push(<ArrowRightIcon />);
        }
        _steps.push(child);
      });
    setSteps(_steps);
  }, [children]);
  return (
    <Container>
      <Context.Provider value={{ current }}>{steps}</Context.Provider>
    </Container>
  );
}

Steps.Step = Step;

export default Steps;
