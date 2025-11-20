import { styled, Tag } from '@kux/mui';

export const Container = styled.main`
  margin: 0 auto 80px;
  width: fit-content;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    margin: 0;
    padding: 0 16px;
  }
`;
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 580px;
  max-width: 580px;
  margin: 26px 16px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 32px;
    width: 100%;
    max-width: initial;
    margin: 16px 0 0;
  }
`;

export const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Back = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%; /* 18.2px */
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  .ICArrowRight2_svg__icon {
    transform: scaleX(-1);
  }
`;
export const Body = styled.section`
  display: flex;
  flex-direction: column;
  gap: 40px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 24px;
  }
`;
export const FormBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 20px;
  }
`;
export const Header = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
  margin-bottom: 0;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const Item = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px 24px;
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`;
export const ItemIconWrapper = styled.div`
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cover4};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  img {
    max-width: 30px;
    max-height: 30px;
  }
`;
export const ItemContent = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
  flex-wrap: wrap;
`;
export const ExTag = styled(Tag)`
  border-radius: 6px;
  line-height: 140%;
`;
export const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  a {
    color: ${({ theme }) => theme.colors.text60};
    text-decoration: underline;
  }
`;

export const FormItemLabel = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
  margin-top: 8px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
`;

export const StateLabel = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  direction: ltr;
`;
export const StateLabelText = styled.span``;
export const Restricted = styled.p`
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 4px;
  margin-left: 8px;
  padding: 2px 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;
