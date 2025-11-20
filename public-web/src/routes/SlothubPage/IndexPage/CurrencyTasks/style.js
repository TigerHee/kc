/*
 * owner: borden@kupotech.com
 */
import { Input, styled, Tabs } from '@kux/mui';

export const Container = styled.section`
  margin-top: 36px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 60px;
  }
`;

export const Title = styled.h2`
  display: inline;
  margin-bottom: 0;
  font-weight: 700;
  font-size: 18px;
  /* line-height: 130%; */
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: 36px;
  }
`;

export const TabBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 12px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 24px;
  }
`;

export const StyledTabs = styled(Tabs)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .KuxTab-selected {
      color: ${(props) => props.theme.colors.text} !important;
      background-color: ${(props) => props.theme.colors.cover4} !important;
      border-color: ${(props) => props.theme.colors.cover4} !important;
      border-radius: 4px !important;
      transition: none;
    }
  }
`;

export const StyledInput = styled(Input)`
  width: 160px;
  margin-left: 16px;
  input[type='search'] {
    -webkit-appearance: none;
  }
  input::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    display: none;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    height: 28px;
    margin-top: 12px;
    margin-left: 0;
    padding-left: 14px;
    .KuxDivider-root {
      margin: 0 1px;
    }

    input {
      font-size: 12px;
    }
  }
`;

export const InputFormWrap = styled.form`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;
