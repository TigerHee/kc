/**
 * Owner: ella.wang@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
`;

export const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 24px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    grid-gap: 16px;
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.a`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: inherit;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

export const CardTitle = styled.span`
  color: #f3f3f3;
  font-size: 16px;
  font-weight: 700;
  line-height: 130%;
  position: absolute;
  left: 20px;
  bottom: 18px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    bottom: 24px;
  }
`;

export const Info = styled.span`
  color: rgba(243, 243, 243, 0.6);
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  position: absolute;
  left: 20px;
  bottom: 4px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    bottom: 8px;
  }
`;
