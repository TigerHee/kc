/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 588px;
  padding-top: 24px;
  ${({ theme }) => theme.breakpoints.down('md')} {
    width: 100%;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

export const SubTitle = styled.div`
  font-size: 12px;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.text60};
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  padding: 24px 0;
  font-size: 24px;
  text-align: center;
`;

export const AnswersWrapper = css`
  align-items: stretch;
`;

export const TipWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 24px 0;
  padding: 8px 16px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 22px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.02);
  border-radius: 4px;
`;
export const LastLine = styled.span`
  margin-top: 18px;
`;

export const SelectItemWrapper = css`
  margin: 6px 0;
`;

export const SelectItem = styled.div`
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 4px 12px;
  font-size: 14px;
  text-align: center;
  background: ${({ theme }) => theme.colors.cover2};
  border: 1px solid ${({ theme }) => theme.colors.text20};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 20, 42, 0.08);
  }

  img {
    position: absolute;
    right: 2px;
    bottom: 2px;
  }
`;

export const SelectItemActive = styled(SelectItem)`
  background: ${({ theme }) => theme.colors.overlay};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

export const Triangle = styled.div`
  position: absolute;
  right: -12px;
  bottom: -12px;
  width: 0;
  height: 0;
  border: 12px solid transparent;
  border-left: 12px solid ${({ theme }) => theme.colors.primary};
  transform: rotate(45deg);
  ${({ dir, theme }) =>
    dir === 'rtl' &&
    `
    position: absolute;
  left: -12px;
  width: 0;
  height: 0;
  border-right: 12px solid ${theme.colors.primary};
  transform: rotate(-45deg);
  bottom: -12px;
  `}
`;

export const FullWidthBtn = css`
  width: 100% !important;
  margin-top: 12px;
  margin-bottom: 64px;
`;

export const FailImg = styled.img`
  margin-top: 64px;
  margin-bottom: 12px;
`;

export const FailTitle = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

export const FailDes = styled.span`
  margin: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  opacity: 0.6;
`;

export const retryBtn = css`
  width: fit-content;
  min-width: 150px;
  margin-top: 18px;
  margin-bottom: 120px;
`;

export const FormWrapper = css`
  margin-bottom: 64px;
`;

/* rtl:begin:ignore */
export const ContryDropdown = css`
  [dir='rtl'] & > div > div {
    direction: rtl !important;
  }
`;

/* rtl:end:ignore */
