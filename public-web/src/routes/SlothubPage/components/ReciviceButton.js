/*
 * owner: borden@kupotech.com
 */
import { styled } from '@kux/mui';
import React from 'react';
import { _t } from 'src/tools/i18n';
import Button from './mui/Button';

const StyledButton = styled(Button)`
  position: relative;
  &,
  &:hover {
    color: ${(props) => props.theme.colors.text};
    background-color: #d3f475;
  }
`;
const Badge = styled.div`
  position: absolute;
  top: -10px;
  right: 0px;
  padding: 2px 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 130%;
  color: #fff;
  border-radius: 46px;
  background: #282828;
`;

const ReciviceButton = ({ receiveTimes, ...otherProps }) => {
  if (receiveTimes <= 0) return null;
  return (
    <StyledButton {...otherProps}>
      {_t('d5d14e3321f24000ad65')}
      {receiveTimes > 1 && <Badge>x{receiveTimes}</Badge>}
    </StyledButton>
  );
};

export default React.memo(ReciviceButton);
