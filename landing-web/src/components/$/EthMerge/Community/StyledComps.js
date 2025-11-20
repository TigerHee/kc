/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import FOOTER_BG from 'assets/eth-merge/footer-bg.png';
import { ReactComponent as CirclesIcon } from 'assets/eth-merge/circles.svg';
import { ReactComponent as ArrowRight } from 'assets/eth-merge/arrow-right.svg';

// --- 样式start ---

export const StyledCirclesIcon = styled(CirclesIcon)`
  margin-left: 16px;
`;

export const StyledArrowRight = styled(ArrowRight)`
  margin-right: 12px;
  [dir='rtl'] & {
    transform: rotateY(180deg);
  }
`;

export const Wrapper = styled.div`
  background-origin: border-box;
  background-position: bottom;
  background-image: url(${FOOTER_BG});
  background-repeat: no-repeat;
  background-size: 100% auto;
`;

export const Index = styled.section`
  margin: 64px 16px 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const List = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #4440ff;
`;

export const ListItem = styled.div`
  :not(:last-of-type) {
    margin-bottom: 16px;
  }
  display: flex;
  align-items: center;
  min-height: 24px;
  overflow: hidden;
  a {
    margin-left: 8px;
    width: 250px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
    /* identical to box height, or 21px */

    color: #ffffff;
    :focus: {
      text-decoration: none;
    }

    opacity: 0.6;
  }
`;

export const SectionHeader = styled.h3`
  width: 240px;
  margin-bottom: 12px;
  text-align: center;

  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
`;

export const Desc = styled.p`
  margin-bottom: 16px;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  text-align: center;
  color: #ffffff;
  opacity: 0.4;
`;

export const Card = styled.div`
  width: 100%;
  min-height: 121px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #4440ff;
  margin-bottom: 16px;
`;

export const CardLink = styled.a`
  width: 100%;
  min-height: 121px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #4440ff;
  margin-bottom: 16px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 24px;
  background: #4440ff;
`;

export const CardBody = styled.div`
  width: 100%;
  padding: 12px 16px;
`;

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  span {
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 130%;
    /* identical to box height, or 42px */

    text-align: center;

    color: #ffffff;
  }
  h4 {
    margin: 0;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 130%;
    /* or 18px */

    color: #9462ff;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    /* autoprefixer: off */
    -webkit-line-clamp: 2;

    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const CardContent = styled.p`
  margin: 0;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: #ffffff;

  opacity: 0.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  /* autoprefixer: off */
  -webkit-line-clamp: 2;
`;
// --- 样式end ---
