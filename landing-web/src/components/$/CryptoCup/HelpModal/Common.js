/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import Button from '@kufox/mui/Button';

const BannerBox = styled.div`
  margin: 0 -24px;
`;

const Banner = styled.img`
  width: 100%;
  height: 88px;
`;

const HighBanner = styled.img`
  width: 100%;
  height: 133px;
`;

const Intro = styled.p`
  margin: 16px 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: ${props => props.theme.colors.text40};
`;

const MainText = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 26px;
  color: ${props => props.theme.colors.text};

  span span {
    color: #2dc985;
  }
`;

const OkButton = styled(Button)`
  margin-top: 24px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  background: #7ff2c0;
  border-radius: 90px;

  &:hover {
    background: rgb(127, 242, 192, 0.8);
  }
`;

const CancelButtonBox = styled.div`
  margin: 14px 0 -12px;
  display: flex;
  justify-content: center;
`;

const CancelButton = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  color: #2dc985;
  cursor: pointer;
`;

export default {
  BannerBox,
  HighBanner,
  Banner,
  OkButton,
  CancelButtonBox,
  CancelButton,
  Intro,
  MainText,
};
