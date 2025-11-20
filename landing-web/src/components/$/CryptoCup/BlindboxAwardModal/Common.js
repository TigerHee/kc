/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo } from 'react';
import { styled } from '@kufox/mui/emotion';
import Button from '@kufox/mui/Button';
import { _t } from 'utils/lang';
import CashImg from 'assets/cryptoCup/cash.png';

const Title = styled.h2`
  margin: 4px 0 0;
  padding-right: 10px;
  font-weight: 600;
  font-size: 18px !important;
  line-height: 23px;
  color: #000d1d;

  & span {
    font-size: 18px !important;
  }
  & span span {
    font-size: 18px !important;
    color: rgba(45, 201, 133, 1);
  }
`;

const AwardLine = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AwardItem = styled.div`
  flex: 1;
`;

const AwardLogo = styled.img`
  display: block;
  margin: 0 auto;
  width: 97px;
  height: 97px;
`;

const AwardName = styled.div`
  margin-top: 14px;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  color: #2dc985;
  text-align: center;
`;

const NoticeText = styled.p`
  margin: 12px 0;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: ${props => props.theme.colors.text40};
`;

const FullButton = styled(Button)`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  background: #7ff2c0;
  border-radius: 90px;

  &:hover {
    background: rgb(127, 242, 192, 0.8);
  }
`;

const FullFlexButton = styled(FullButton)`
  display: flex;
  align-items: center;
`;

const FullButtonText = styled.div``;

const SeeContainer = styled.div`
  margin: 14px 0 -12px;
  display: flex;
  justify-content: center;
`;

const SeeButton = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  color: #2dc985;
  cursor: pointer;
`;

const AwardLineCenter = styled(AwardLine)`
  justify-content: center;
`;

const AwardLogoCenter = styled(AwardLogo)`
  display: block;
  margin: 0 auto;
`;

const ArrowRight = styled.img`
  margin-left: 2px;
  width: 12px;
  height: 12px;
  transform: translateY(1px);
`;

const CenterAward = memo(props => {
  const { name = _t('tBDieuHvHvmuv17g2G8JGN'), logo = CashImg } = props;

  return (
    <AwardLineCenter>
      <AwardItem>
        <AwardLogoCenter src={logo} alt="award-logo" />
        <AwardName>{name}</AwardName>
      </AwardItem>
    </AwardLineCenter>
  );
});

export default {
  Title,
  AwardLine,
  AwardItem,
  AwardLogo,
  AwardName,
  NoticeText,
  FullButton,
  FullFlexButton,
  FullButtonText,
  SeeContainer,
  SeeButton,
  CenterAward,
  ArrowRight,
};
