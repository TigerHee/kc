/**
 * Owner: garuda@kupotech.com
 */
import styled from '@emotion/styled';

export const TooltipContent = styled.div`
  padding: 7px 4px;
`;

export const TooltipBody = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

export const RightBox = styled.div`
  flex: 1;
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  margin-top: 3px;
  margin-bottom: 8px;
`;

export const Describe = styled.div`
  font-size: 12px;
  line-height: 130%;
  margin-top: 8px;
`;

export const GuidePlaceholder = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 1px;
  height: 1px;
  z-index: -1;
`;
