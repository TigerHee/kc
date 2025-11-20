/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

export const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #01bc8d;
  border-radius: 50%;
  margin-top: 8px;
  [dir='rtl'] & {
    margin-left: 12px;
  }
`;

export const Content = styled.div`
  flex: 1;
  padding-left: 20px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-left: 12px;
  }
`;

export const Description = styled.p`
  color: rgba(29, 29, 29, 0.6);
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin: 0px;
  & > span > span {
    color: #000d1d;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 12px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
