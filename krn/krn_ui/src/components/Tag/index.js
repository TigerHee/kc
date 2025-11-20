/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import registerAPI from 'utils/registerAPI';
import API from './API';

const typeConfig = {
  info: {
    textColor: 'text40',
    bgColor: 'cover4',
  },
  success: {
    textColor: 'primary',
    bgColor: 'primary8',
  },
  error: {
    textColor: 'secondary',
    bgColor: 'secondary8',
  },
  warning: {
    textColor: 'complementary',
    bgColor: 'complementary8',
  },
};

const TagBox = styled.Pressable`
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  background-color: ${({ theme, type }) => theme.colorV2[typeConfig[type].bgColor]};
`;
const Content = styled.Text`
  align-items: center;
  font-size: ${({ size }) => (size === 'medium' ? '12px' : '10px')};
  line-height: ${({ size }) => (size === 'medium' ? '12px' : '10px')};
  font-style: normal;
  font-weight: 500;
  color: ${({ theme, type }) => theme.colorV2[typeConfig[type].textColor]};
`;

const Tag = ({ type, content, size, styles, ...otherProps }) => {
  return (
    <TagBox type={type} style={styles.tagBox} {...otherProps}>
      <Content type={type} size={size} style={styles.content}>
        {content}
      </Content>
    </TagBox>
  );
};

registerAPI(Tag, API);
export default Tag;
