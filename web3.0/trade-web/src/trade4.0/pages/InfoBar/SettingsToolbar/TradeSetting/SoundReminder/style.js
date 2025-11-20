/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const Row = styled(Container)`
  justify-content: space-between;
  padding: 12px 0;
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${props => props.theme.colors.text};
`;

export const Describe = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  color: ${props => props.theme.colors.text40};
`;
