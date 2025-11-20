/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.ol`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 0px;
  margin-top: 24px;
  list-style: none;
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 16px;
    padding: 20px 0px;
  }
`;

export const StepItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 12px;
  width: 33.33%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: row;
    width: 100%;
    padding: 0px;
    &:not(:last-child) {
      margin-bottom: 32px;
    }
  }
`;

export const Content = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    align-items: flex-start;
    margin-left: 24px;
  }
`;

export const Image = styled.img`
  width: 80px;
  height: 80px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 60px;
    height: 60px;
  }
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0px;
  }
`;

export const Num = styled.span`
  color: #01bc8d;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  border: 1px solid #01bc8d;
  padding: 8px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 24px;
    height: 24px;
  }
`;

export const Title = styled.h3`
  color: #f3f3f3;
  font-size: 20px;
  font-weight: 700;
  line-height: 130%;
  margin: 0px 0px 0px 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 600;
    font-size: 16px;
  }
`;

export const Des = styled.p`
  color: rgba(243, 243, 243, 0.6);
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  text-align: center;
  margin: 24px 0px 0px 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 12px 0px 0px 0px;
    font-size: 12px;
    text-align: left;
  }
`;
