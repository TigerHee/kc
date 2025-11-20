/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';


export const Maker = styled.section`
  margin-top: ${_r(16)};
  display: inline-flex;
  align-items: center;
`;

export const Logo = styled.img`
  width: ${_r(20)};
  height: ${_r(20)};
  margin-right: ${_r(4)};
  border-radius: 50%;
`;

export const Name = styled.span`
  font-weight: 500;
  font-size: ${_r(16)};
  color: #fff;
  opacity: 0.4;
`;

export const TitleLine = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  > .title {
    flex: 1;
  }
  > .logo {
    margin-right: ${_r(25)};
  }
`;

export const Wrapper = styled.div`
  margin-top: ${_r(14)};
`;

export const TitleContent = styled.section`
  font-weight: 600;
  font-size: ${_r(28)};
  color: #fff;
  flex: 1;
  margin-bottom: 0;
  > p {
    margin-bottom: 0;
  }
`;

export const TitleLogo = styled.img`
  width: ${_r(102)};
  height: ${_r(94)};
  align-self: flex-start;
`;

export const Desc = styled.p`
  font-weight: 400;
  font-size: 12px;
  margin-top: ${_r(10)};
  .light {
    font-weight: 600;
    font-size: 12px;
    line-height: 130%;
    text-align: justify;
    color: #80DC11;
    margin-right: ${_r(4)};
  }
`;