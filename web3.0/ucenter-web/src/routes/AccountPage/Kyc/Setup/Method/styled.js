import { ICArrowDownOutlined } from '@kux/icons';
import { styled, Tag } from '@kux/mui';
import createResponsiveMarginCss from 'src/components/Account/Kyc/utils/createResponsiveMarginCss';

export const Container = styled.div`
  ${({ theme }) => createResponsiveMarginCss(theme)};
  margin-bottom: 55px;
`;

export const Wrapper = styled.div`
  max-width: 580px;
  width: 100%;
  margin: 26px auto 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: 16px auto 0;
  }
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  margin-top: 48px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 32px;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 20px;
    margin-top: 20px;
  }
`;

export const Item = styled.div`
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  display: flex;
  flex-direction: column;
  gap: 24px;
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 20px;
    padding: 24px 16px;
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
`;
export const ItemHeaderLeft = styled.div`
  display: flex;
  width: 48px;
  min-width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cover2};
  color: ${({ theme }) => theme.colors.text};
  margin-right: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 36px;
    min-width: 36px;
    height: 36px;
  }
`;
export const ItemHeaderCenter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;
export const ItemHeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
`;
export const ItemHeaderTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%; /* 22.4px */
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
export const ItemHeaderDesc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
`;
export const ItemContent = styled.div`
  cursor: auto;
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 32px 0px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cover2};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 28px;
    padding-bottom: 24px;
  }
`;
export const ContentDesc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
export const ExTag = styled(Tag)`
  border-radius: 6px;
  line-height: 140%;
`;
export const ArrowDownIcon = styled(ICArrowDownOutlined)`
  transform: ${({ active }) => `rotate(${active ? 180 : 0}deg)`};
  transition: 'transform 0.3s';
`;
