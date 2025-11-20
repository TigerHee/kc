/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';


export const SliderWrapper = styled.div`
  padding: 10px 0 52px;
  margin: 0 12px;
`;

export const AlertWrapper = styled.div`
  margin-bottom: 16px;
  display: ${(props) => (props.open ? 'block' : 'none')};
`;

export const TipsBox = styled.div`
  background-color: ${(props) => props.theme.colors.cover4};
  color: ${(props) => props.theme.colors.text60};
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  padding: 12px 16px;
  border-radius: 8px;

  .highlight {
    color: ${(props) => props.theme.colors.primary};
  }

  margin-bottom: 32px;
`;
