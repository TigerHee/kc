/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.a`
  width: calc(50% - 20px);
  margin-top: 40px;
  cursor: pointer;
  border-radius: 12px;
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
  &:hover {
    box-shadow: 0px 10px 60px 0px rgba(0, 0, 0, 0.1), 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
    .mining_pool_arrow_right {
      background-color: #000;
      svg {
        color: #fff;
      }
    }
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    margin-top: 16px;
    padding: 20px;
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 90px);
  max-width: 212px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    max-width: calc(100% - 90px);
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: calc(100% - 60px);
    max-width: calc(100% - 60px);
    padding-right: 24px;
    [dir='rtl'] & {
      padding-right: 0px;
    }
  }
`;

export const Image = styled.img`
  width: 90px;
  height: 90px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 60px;
    height: 60px;
  }
`;

export const Title = styled.span`
  color: #000d1d;
  font-size: 18px;
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 0px;
    font-weight: 600;
    font-size: 16px;
  }
`;

export const Description = styled.span`
  color: rgba(29, 29, 29, 0.4);
  font-size: 16px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 22px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
    font-size: 14px;
  }
`;

export const ArrowRight = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: transparent;
  svg {
    color: #000;
    transition: color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;
