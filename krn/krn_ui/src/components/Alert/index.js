/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import registerAPI from 'utils/registerAPI';
import API from './API';
import infoIcon from 'assets/common/Alert/info.png';
import successIcon from 'assets/common/Alert/success.png';
import errorIcon from 'assets/common/Alert/error.png';
import warningIcon from 'assets/common/Alert/warning.png';
import arrowRightIcon from 'assets/common/Alert/arrowRight.png';

const typeConfig = {
  info: {
    icon: infoIcon,
    textColor: 'text60',
    bgColor: 'cover4',
  },
  success: {
    icon: successIcon,
    textColor: 'primary',
    bgColor: 'primary8',
  },
  error: {
    icon: errorIcon,
    textColor: 'secondary',
    bgColor: 'secondary8',
  },
  warning: {
    icon: warningIcon,
    textColor: 'complementary',
    bgColor: 'complementary8',
  },
};

const AlertBox = styled.Pressable`
  flex: 1;
  justify-content: flex-start;
  flex-direction: row;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme, type }) => theme.colorV2[typeConfig[type].bgColor]};
`;
const TypeIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  margin-top: 3px;
`;
const Content = styled.View`
  flex: 1;
  align-items: center;
  flex-direction: row;
`;
const TitleText = styled.Text`
  flex: 1;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: ${({ theme, type }) => theme.colorV2[typeConfig[type].textColor]};
`;
const ArrowIcon = styled.Image`
  width: 16px;
  height: 16px;
`;

const Alert = ({ type, title, showTypeIcon, showArrowIcon, styles, ...otherProps }) => {
  return (
    <AlertBox type={type} style={styles.alertBox} {...otherProps}>
      {showTypeIcon ? <TypeIcon source={typeConfig[type]?.icon} style={styles.typeIcon} /> : null}
      <Content style={styles.content}>
        <TitleText type={type} style={styles.titleText}>
          {title}
        </TitleText>
        {showArrowIcon ? <ArrowIcon source={arrowRightIcon} style={styles.arrowIcon} /> : null}
      </Content>
    </AlertBox>
  );
};

registerAPI(Alert, API);
export default Alert;
