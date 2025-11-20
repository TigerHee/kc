/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';

// custom scrollbar css
// start a react component

export const Wrapper = styled.div`
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.overlay};
  padding-bottom: 100px;

  &::-webkit-scrollbar {
    width: 4px;
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.overlay};
    border-radius: 2px;
  }
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('md')} {
    margin-bottom: 120px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 120px;
  }
`;

export const StepsWrapper = styled.div`
  max-width: 860px;
  margin: 40px 0px 0px 0px;
  width: 100%;
`;

export const Block = styled.div`
  padding-top: 40px;
  ${({ theme }) => theme.breakpoints.down('md')} {
    padding-top: 24px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 24px;
  }
`;

export const StyledForm = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-top: 24px;
`;

export const Title = styled.div`
  padding-bottom: 24px;
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const AuthBlock = styled.div`
  padding-top: 20px;
  padding-bottom: 60px;
  width: 100%;
  height: auto;

  ${({ theme }) => theme.breakpoints.down('md')} {
    padding: 30px 0;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 30px 0;
  }
`;

export const WapperBody = styled.div`
  /* max-width: 860px; */
  max-width: ${({ isNarrowMode }) => (isNarrowMode ? '520px' : '860px')};
  margin: 0 auto;
  padding: 28px 0 0 0;

  ${({ theme }) => theme.breakpoints.down('md')} {
    max-width: 100%;
    padding: 36px 24px 24px 24px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-width: 100%;
    padding: 20px 12px 12px 12px;
  }
`;

export const AlertMessage = styled.div`
  & > div {
    text-align: left;
    &:nth-of-type(1) {
      margin-bottom: 4px;
    }
  }
`;

export const Security24h = styled.div`
  width: 100%;
  max-width: 350px;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.text60};
`;
