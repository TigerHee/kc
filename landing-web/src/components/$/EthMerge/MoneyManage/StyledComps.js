/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { ReactComponent as ArrowRight } from 'assets/eth-merge/arrow-right.svg';

// --- 样式start ---
export const StyledArrowRight = styled(ArrowRight)`
  width: 16px;
  height: 16px;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;
export const Index = styled.section`
  margin: 64px 16px 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SectionHeader = styled.h3`
  width: 240px;
  margin-bottom: 17px;
  text-align: center;

  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ListItem = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 16px;
  }
  min-height: 162px;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #4440ff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  :hover {
    background: linear-gradient(0deg, rgba(57, 16, 173, 0.4), rgba(57, 16, 173, 0.4)), #000000;
  }
`;

export const ItemHeader = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-weight: 700;
    font-size: 18px;
    line-height: 130%;
    /* or 23px */

    text-align: center;

    color: #ffffff;

    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const ItemDesc = styled.p`
  margin: 0;
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  /* or 18px */

  color: #ffffff;

  opacity: 0.4;
`;

export const ItemBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

export const Duration = styled.span`
  font-weight: 700;
  font-size: 56px;
  line-height: 120%;
  /* or 67px */

  display: flex;
  align-items: center;
  letter-spacing: -2px;

  color: #ffffff;

  opacity: 0.08;
`;

export const Info = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  font-weight: 700;
  font-size: 14px;
  line-height: 130%;
  /* or 18px */

  text-align: right;
  justify-content: space-between;

  color: #ffffff;
`;

export const ChangeRate = styled.div`
  margin-top: 4px;
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  /* or 31px */

  text-align: right;

  color: #77ff8d;
`;
// --- 样式end ---
