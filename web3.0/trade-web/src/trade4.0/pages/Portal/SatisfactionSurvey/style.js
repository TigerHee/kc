/**
 * Owner: harry.lai@kupotech.com
 */
import { FlexColumm } from '@/style/base';
import { styled } from '@/style/emotion';
import { getThemeVal } from 'utils/theme';
import { CloseOutlined } from '@kux/icons';

export const SurveyWrap = styled(FlexColumm)`
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 320px;
  min-height: 172px;
  max-height: ${({ grow }) => (!grow ? '172px' : '500px')};
  padding: 40px 24px;
  z-index: 999;
  border-radius: 16px;
  font-family: Roboto;
  filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.05)) drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.1));
  transition: max-height 0.5s ease;
  background: linear-gradient(0deg, rgba(1, 188, 141, 0.08) 0%, rgba(1, 188, 141, 0) 100%) bottom /
      100% 80px no-repeat,
    ${({ theme }) => theme.colors.layer};
`;

export const CloseIcon = styled(CloseOutlined)`
  width: 16px;
  height: 16px;
  position: absolute;
  right: 16px;
  top: 16px;
  fill: ${({ theme }) => theme.colors.icon40};
  cursor: pointer;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TopAreaIconWrap = styled.section`
  width: 64px;
  height: 64px;
  border-radius: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: ${({ theme }) => theme.colors.layer};
  top: -32px;
  left: 32px;
`;

export const TopAreaIcon = styled.img`
  width: 48px;
  height: 48px;
`;

export const Question = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  text-align: center;
  font-family: Roboto;
`;

export const TextArea = styled.textarea`
  margin-top: 16px;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  border-radius: 8px;
  min-height: 80px;
  max-height: 110px;
  border: 1px solid ${({ theme }) => theme.colors.cover16};
  background: ${({ theme }) => theme.colors.layer};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  line-height: 130%;
  padding: 8px 12px;
  font-family: Roboto;

  :focus-visible {
    outline: ${({ theme }) => theme.colors.primary} solid 1px;
  }
`;
