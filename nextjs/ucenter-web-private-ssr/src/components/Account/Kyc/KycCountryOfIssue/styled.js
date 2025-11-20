/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICQuestionOutlined } from '@kux/icons';
import { Button, styled, Tag } from '@kux/mui';
import createResponsiveMarginCss from '../utils/createResponsiveMarginCss';

export const Container = styled.div`
  ${({ theme }) => createResponsiveMarginCss(theme)};
`;

export const Wrapper = styled.div`
  margin: 0 auto 80px;
  width: 100%;
  max-width: 580px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 40px;
  }
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  margin-top: 48px;
  margin-bottom: 32px;
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

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const Item = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px 16px;
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  cursor: pointer;
`;
export const ItemIconWrapper = styled.div`
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.cover4};
  margin-right: 12px;
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
`;
export const ExTag = styled(Tag)`
  border-radius: 6px;
  line-height: 140%;
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
export const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
`;

export const QuestionIcon = styled(ICQuestionOutlined)`
  margin-left: 4px;
  color: ${({ theme }) => theme.colors.icon60};
  cursor: pointer;
`;
