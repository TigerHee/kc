/**
 * Owner: will.wang@kupotech.com
 */

import { ICArrowRight2Outlined } from '@kux/icons';
import { useMemo } from 'react';

const { styled } = require('@kux/mui');

const GridItemContainer = styled.a`
  display: flex;
  width: 384px;
  min-height: 140px;
  padding: 28px;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;

  cursor: pointer;

  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.cover12};

  &:hover .item-title {
    transform: translate(0);
  }

  &:hover .item-title > svg {
    opacity: 1;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 28px 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 20px;
    min-height: unset;
  }
`;

const ItemContent = styled.div`
  display: flex;
  width: 100%;
  gap: 14px;
  justify-content: space-between;
`;

const ItemLeft = styled.div``;
const ItemRight = styled.div``;

const ItemIitle = styled.h3`
  margin: 0 0 10px 0;
  color: ${(props) => props.theme.colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;

  transition: all 0.3s ease-in-out;
  transform: translateX(-36px);

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  
  & > svg {
    margin-right: 12px;
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
    transform: translateX(-30px);
  }
`;

const ItemDesc = styled.p`
  color: ${(props) => props.theme.colors.text40};
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

const ItemLogo = styled.img`
  width: 44px;
  height: 44px;
  object-fit: contain;
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 32px;
    height: 32px;
  }
`;

export const GridItem = (props) => {
  const { logoStyle = {}, logo, darkLogo, isDark, url } = props;

  const currentLogo = useMemo(() => {
    if (isDark && darkLogo) {
      return darkLogo;
    }

    return logo;
  }, [darkLogo, isDark, logo])

  return (
    <GridItemContainer href={url} target="_blank" rel="nofollow noopener noreferrer">
      <ItemContent>
        <ItemLeft>
          <ItemIitle className="item-title">
            <ICArrowRight2Outlined />
            {props.title}
          </ItemIitle>
          <ItemDesc>{props.desc}</ItemDesc>
        </ItemLeft>
        <ItemRight>
          <ItemLogo src={currentLogo} alt={props.title} style={logoStyle} />
        </ItemRight>
      </ItemContent>
    </GridItemContainer>
  );
};
