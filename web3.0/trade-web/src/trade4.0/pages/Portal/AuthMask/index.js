/**
 * Owner: borden@kupotech.com
 */

import React, { memo } from 'react';
import Button from '@mui/Button';
import styled from '@emotion/styled';
import infoDark from '@/assets/toolbar/open-marginmask-dark.png';
import infoLight from '@/assets/toolbar/open-marginmask-light.png';
import { useTheme } from '@kux/mui';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  flex-direction: column;

  button {
    font-size: 12px;
  }
`;

export const Desc = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
`;

export const Img = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

/**
 * 访问受限的遮罩，比如未开通杠杆时，杠杆交易区展示遮罩
 */
const AuthMask = ({
  desc,
  btnText,
  children = null,
  onClick = () => {},
  ...otherProps
}) => {
  const { currentTheme } = useTheme();
  return (
    <Wrapper {...otherProps}>
      <Img src={currentTheme === 'dark' ? infoDark : infoLight} />
      {!!desc && <Desc>{desc}</Desc>}
      {!!btnText && (
        <Button variant="text" size="small" onClick={onClick} type="brandGreen">
          {btnText}
        </Button>
      )}
      {children}
    </Wrapper>
  );
};

export default memo(AuthMask);
