/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Wrapper = styled(RowFlex)`
  justify-content: space-between;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid rgba(243, 243, 243, 0.08);
  background: rgba(18, 18, 18, 0.27);
  backdrop-filter: blur(11px);
  margin-top: ${({ langText }) => (langText ? '-10px' : '-30px')};
  position: absolute;
  width: 100%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: -18px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    position: relative;
    gap: 12px;
    margin-top: 0px;
    padding: 12px;
  }
`;

export const LineItem = styled.dl`
  width: 33.33%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0px;
  border-left: ${({ border }) => (border ? '1px solid rgba(243, 243, 243, 0.08)' : 'none')};
  padding: ${({ center }) => (center ? '0px 20px' : '0px')};
  ${(props) => props.theme.breakpoints.down('sm')} {
    align-items: center;
    padding: 0px;
    padding: 0px;
    text-align: center;
    border-left: none;
  }
`;

export const Title = styled.dt`
  color: rgba(243, 243, 243, 0.4);
  font-size: 12px;
  line-height: 130%;
  margin-left: ${({ ml }) => (ml ? ml : 0)}px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 14px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
  span {
    margin-left: 10px;
  }
`;

export const SubTitle = styled(Title)`
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    margin-left: 0px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-left: 0px;
    span {
      margin-left: 0px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: flex;
    flex-direction: column;
    margin-left: 0px;
    span {
      margin-left: 0px;
    }
  }
`;

export const SubContent = styled(SubTitle)`
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-left: 10px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 0px;
  }
`;

export const TextWrapper = styled.dd`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 0px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    align-items: flex-start;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: center;
    margin-top: 4px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    margin-top: 4px;
  }
`;

export const Content = styled.span`
  color: #f3f3f3;
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 4px;
    font-weight: 700;
  }
`;
