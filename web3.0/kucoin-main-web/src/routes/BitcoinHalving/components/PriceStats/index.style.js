/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  max-width: 1200;
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(243, 243, 243, 0.08);
  background: rgba(243, 243, 243, 0.02);
  padding: 24px;
  display: flex;
  flex-direction: row;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 24px 16px;
  }
`;

export const PriceWrapper = styled.div`
  width: calc(50% - 76px);
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

export const PriceBox = styled.dl`
  display: flex;
  flex-direction: column;
  margin: 0px;
`;

export const Title = styled.dt`
  color: rgba(243, 243, 243, 0.4);
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
  a {
    color: rgba(243, 243, 243, 0.4);
  }
  a:hover {
    color: rgba(243, 243, 243, 0.4);
  }
`;

export const Price = styled.dd`
  color: #f3f3f3;
  font-size: 28px;
  font-weight: 700;
  line-height: 130%;
  margin-top: 8px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 10px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 6px;
    font-size: 24px;
  }
`;

export const ListBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 24px 0px 0px 0px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    align-items: flex-start;
    margin: 24px 0px 0px 0px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 20px 0px 0px 0px;
  }
`;

export const ListItem = styled.dl`
  display: flex;
  flex-direction: column;
  width: 33.3%;
`;

export const Line = styled.div`
  width: 1px;
  height: 135px;
  background: rgba(243, 243, 243, 0.04);
  margin: 0px 38px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 70%;
    height: 1px;
    margin: 24px 0px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 20px 0px;
  }
`;

export const InfoTitle = styled.dt`
  color: rgba(243, 243, 243, 0.4);
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const Info = styled.dd`
  color: ${({ color }) => color};
  font-size: 18px;
  font-weight: 500;
  line-height: 130%;
  margin-top: 8px;
  margin-bottom: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 6px;
    font-weight: 600;
    font-size: 14px;
  }
`;

export const RiseFall = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: row;
    justify-content: space-between;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`;

export const TitleWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;

export const RiseFallTitle = styled.h3`
  color: #f3f3f3;
  font-size: 20px;
  font-weight: 700;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

export const RiseFallInnfo = styled.mark`
  color: rgba(243, 243, 243, 0.4);
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-top: 8px;
  background: transparent;
  padding: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
