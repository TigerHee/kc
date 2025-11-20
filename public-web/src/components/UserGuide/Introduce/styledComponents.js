/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { Link } from 'components/Router';

export const IntroduceWrapper = styled.section`
  margin-top: 32px;

  .more {
    padding: 16px 16px 50px;
    text-align: center;
  }
`;

export const HeaderWrapper = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    min-width: 20px;
    max-width: 20px;
    height: 20px;
    margin-right: 6px;
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;

export const ItemWrapper = styled(Link)`
  margin-top: 12px;
  padding: 16px;
  color: ${(props) => props.theme.colors.text} !important;
  background-color: ${(props) => props.theme.colors.cover2};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 12px;
  justify-content: space-between;

  svg {
    width: 20px;
    min-width: 20px;
    max-width: 20px;
    height: 20px;
    color: ${(props) => props.theme.colors.icon60};
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;

export const MoreWrapper = styled(Link)`
  color: ${(props) => props.theme.colors.primary} !important;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  display: inline-flex;
  align-items: center;

  svg {
    width: 16px;
    min-width: 16px;
    max-width: 16px;
    height: 16px;
    margin-left: 2px;
    color: ${(props) => props.theme.colors.icon};

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
`;
