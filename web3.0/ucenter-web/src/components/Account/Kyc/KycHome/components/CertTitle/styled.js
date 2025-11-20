import { styled } from '@kux/mui';

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
`;
export const GapBox = styled.div`
  display: flex;
  flex-direction: ${({ dir = 'column' }) => dir};
  gap: ${({ gap = 8 }) => gap}px;
`;
