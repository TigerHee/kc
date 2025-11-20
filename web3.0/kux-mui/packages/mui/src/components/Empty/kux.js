import styled from 'emotion/index';
import { variant } from 'styled-system';

export const EmptyRoot = styled.div`
  display: inline-block;
  text-align: center;
  margin: auto;
`;

export const Description = styled.div`
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text40};
`;

export const SubDescription = styled.div`
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
`;

export const Image = styled.img`
  display: inline-block;
  ${variant({
    prop: 'size',
    variants: {
      small: {
        width: '136px',
        height: '112px',
      },
      large: {
        width: '180px',
        height: '148px',
      },
    },
  })}
`;
