/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.ul`
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  list-style: none;
`;

export const Card = styled.li`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(243, 243, 243, 0.08);
  background: rgba(18, 18, 18, 0.4);
  width: calc(50% - 12px);
  cursor: pointer;
  backdrop-filter: blur(11px);
  &:hover {
    border: 1px solid #01bc8d;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 16px;
  }
`;

export const Title = styled.h3`
  color: #f3f3f3;
  font-size: 20px;
  font-weight: 700;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

export const Transfer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 12px;
  background: rgba(243, 243, 243, 0.04);
  margin-top: 24px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    justify-content: flex-start;
    a {
      align-self: flex-end;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 16px;
    padding: 16px;
    a {
      align-self: flex-end;
    }
  }
`;

export const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  ${(props) => props.theme.breakpoints.down('lg')} {
    align-self: flex-start;
    width: 100%;
    margin-bottom: 20px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    align-self: flex-start;
    width: 100%;
    margin-bottom: 16px;
  }
`;

export const SymbolBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled.img`
  width: 18px;
  height: 18px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 16px;
    height: 16px;
  }
`;

export const Symbol = styled.span`
  color: #f3f3f3;
  font-size: 16px;
  font-weight: 700;
  line-height: 130%;
  margin-left: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const PriceWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: space-between;
    width: 100%;
    margin-top: 6px;
  }
`;

export const RateBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-left: 8px;
  }
`;

export const Price = styled.div`
  color: #f3f3f3;
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export const Rate = styled.div`
  color: ${({ color }) => color};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  margin-left: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 0px;
  }
`;

export const RateInfo = styled.span`
  color: rgba(243, 243, 243, 0.4);
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  margin-right: 4px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

export const Img = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 8px;
`;

export const TitleWraper = styled.div`
  margin-bottom: 12px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
  span {
    color: #f3f3f3;
    font-weight: 700;
    font-size: 16px;
    line-height: 130%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 6px;
    img {
      width: 16px;
      height: 16px;
    }
    span {
      font-size: 14px;
    }
  }
`;

export const RateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
  margin-bottom: 5px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    align-self: center;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    align-self: center;
    margin-bottom: 0px;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ last }) => (last ? 'flex-end' : 'space-between')};
  width: 100%;
`;

export const SymbolIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 20px;
    height: 20px;
  }
`;

export const SymbolInfo = styled.span`
  color: #f3f3f3;
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export const Button = styled.a`
  border-radius: 24px;
  padding: 10px 24px;
  background: #01bc8d;
  color: #1d1d1d;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 130%;
  &:hover {
    color: #1d1d1d;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 7px 20px;
  }
`;
