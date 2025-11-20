/**
 * Owner: Ray.Lee@kupotech.com
 */
import Dialog from '@mui/Dialog';
import Radio from '@mui/Radio';

import styled from '@emotion/styled';

export const DialogWrapper = styled(Dialog)`
  .KuxDialog-content {
    max-height: 500px;
    padding-bottom: 32px;
  }
`;

export const Content = styled.div`
  position: relative;
  min-height: 300px;
`;

export const Group = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
`;

export const FooterWrapper = styled.div`
  padding: 0 32px 32px;
  border-top: 1px solid ${(props) => props.theme.colors.divider8};

  .KuxCheckbox-wrapper {
    margin: 12px 0;
    display: flex;
    align-items: flex-start;
  }

  .KuxCheckbox-checkbox {
    top: unset;
  }
`;

export const RadioItem = styled(Radio)`
  color: ${(props) => props.theme.colors.text};

  align-items: flex-start;

  &:not(:last-of-type) {
    margin-bottom: 8px;
  }

  .KuxRadio-radio {
    width: 20px;
    height: 20px;
    padding: 0;
  }

  .KuxRadio-inner {
    width: 20px;
    height: 20px;
  }

  .KuxRadio-text {
    line-height: 20px;
  }

  &.error {
    color: ${(props) => props.theme.colors.secondary};

    .KuxRadio-inner {
      border-color: ${(props) => props.theme.colors.secondary};
      &::after {
        background: ${(props) => props.theme.colors.secondary};
      }
    }
  }

  &.right {
    color: ${(props) => props.theme.colors.primary};
    .KuxRadio-inner {
      border-color: ${(props) => props.theme.colors.primary};
    }
  }
`;

export const ItemTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  margin: 17px 0;
  color: ${(props) => props.theme.colors.text};
`;

export const Answered = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  margin-top: 16px;
  color: ${(props) => props.theme.colors.icon60};

  .highlight {
    color: ${(props) => props.theme.colors.text};
    margin-left: 4px;
  }
`;

export const Protocal = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};

  a {
    color: ${(props) => props.theme.colors.primary};
  }
`;
