/**
 * Owner: will.wang@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { styled, useResponsive } from '@kux/mui';

export const FundSectionContainer = styled.div`
  width: 100%;
`;

export const FundContent = styled.div`
  width: 1200px;
  margin: 0 auto 120px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 0 32px;
  }
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 0 16px;
    margin: 0 auto 40px;
  }
`;

export const Fundtitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  line-height: 130%;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

export const FundParagraph = styled.p`
  color: ${(props) => props.theme.colors.text40};
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: 16px auto 64px;
  width: 800px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 16px auto 56px;
    width: 100%;
  }
  
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
    margin: 8px auto 24px;
  }
`;


export const FundSmCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 23px;

  & div:last-child {
    flex: 1;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 12px;
  }
`

export const FundCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: stretch;

  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: 20px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 12px;
  }
`;

export const FundBigCard = styled.a`
  display: flex;
  width: 516px;
  flex: 0 0 516px;
  padding: 40px 32px;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;

  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.cover8};

  cursor: pointer;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    flex: 0 0 273px;
  }

  & .top-logo > svg {
    transform: translateX(-36px);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    will-change: auto;
  }

  &:hover .top-logo > svg {
    transform: translateX(0);
    opacity: 1;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 28px 20px;
    gap: 20px;
    flex: 0 0 auto;
  }
`;

export const FuncSmCardWrapper = styled.a`
  padding: 30px 32px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.cover8};

  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: center;

  & .top-logo > svg {
    transform: translateX(-36px);
    opacity: 0;
    transition: all 0.3s ease-in-out;
    will-change: auto;
  }

  &:hover .top-logo > svg {
    transform: translateX(0);
    opacity: 1;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    padding: 28px 20px;
    gap: 20px;
  }
`;

const LeftArea = styled.div`
  & > img {
    width: 62px;
    height: 44px;
    object-fit: contain;
    flex: 0 0 62px;

    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 39px;
      height: 28px;
      flex: 0 0 auto;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const RightArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > h3 {
    margin: 0;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 22px;
    line-height: 1.3;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  & > p {
    margin: 0;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 16px;
    line-height: 1.5;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 8px;
    width: 100%;

    & > h3 {
      font-size: 16px;
      width: 100%;
    }

    & > p {
      font-size: 13px;
    }
  }
`;

export const FuncSmCard = ({ img, title, desc, ...rest }) => {
  const responsive = useResponsive();
  const isSm = !responsive.sm;

  return (
    <FuncSmCardWrapper {...rest}>
      <LeftArea className='top-logo'>
        {img}

        {
          isSm && (
            <ICArrowRight2Outlined size={24} />
          )
        }
      </LeftArea>
      <RightArea>
        <h3 className='top-logo'>
          <span>
            {title}
          </span>
          {
          !isSm && (
            <ICArrowRight2Outlined size={24} />
          )
        } 
        </h3>
        <p>{desc}</p>
      </RightArea>
    </FuncSmCardWrapper>
  );
};
