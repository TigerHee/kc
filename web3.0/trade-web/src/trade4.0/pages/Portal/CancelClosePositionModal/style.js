/*
 * owner: Borden@kupotech.com
 */
import styled from '@emotion/styled';

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Block = styled.div`
  margin-top: 24px;
`;

export const SymbolBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 130%;
  color: ${props => props.theme.colors.text};
`;

export const Tag = styled.div`
  min-width: 24px;
  text-align: center;
  font-size: 12px;
  border-radius: 6px;
  padding: 0 4px;
  margin-right: 8px;
  background: ${props => props.bg};
  color: ${props => props.theme.colors.textEmphasis};
`;

export const Position = styled(Block)`
  font-size: 16px;
  margin-top: 26px;
  color: ${props => props.theme.colors.text};
`;

export const PositionRow = styled(Row)`
  flex-wrap: wrap;
  &:not(:first-of-type) {
    margin-top: 8px;
  }
`;

export const Label = styled.span`
  color: ${props => props.theme.colors.text40};
`;

export const Value = styled.span`
  font-weight: 500;
`;

export const LinkFlag = styled.span`
  margin: 0 8px;
  color: ${props => props.theme.colors.text30};
`;

export const Text = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text40};
`;
