/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { useState } from 'react';
import { _t } from 'src/tools/i18n';
import { ReactComponent as LessIcon } from 'static/account/kyc/index/less.svg';
import { ReactComponent as PlusIcon } from 'static/account/kyc/index/plus.svg';

const Container = styled.div`
  display: flex;
  padding: 28px 32px 16px;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  height: fit-content;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 16px 12px;
  }
`;
const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 4px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-weight: 700;
  }
`;
const ItemContainer = styled.div`
  display: flex;
  padding: 22px 0px 21px;
  flex-direction: column;
  gap: 16px;
  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.cover4};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 8px;
  }
`;
const ItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'auto')};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 15px;
  }
`;
const ItemIcon = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  svg {
    color: ${({ theme, active }) => (active ? theme.colors.icon60 : theme.colors.icon)};
  }
`;
const ItemDescription = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Item = ({ title, description, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <ItemContainer>
      <ItemTitle
        clickable={!!description}
        onClick={() => {
          if (description) {
            setOpen(!open);
          }
        }}
      >
        {title}
        {description ? (
          <ItemIcon active={open}>{open ? <LessIcon /> : <PlusIcon />}</ItemIcon>
        ) : null}
      </ItemTitle>
      {open ? <ItemDescription>{description}</ItemDescription> : null}
    </ItemContainer>
  );
};

export default function FAQ({ children }) {
  const list = children?.filter((child) => child?.type === Item);
  return (
    <Container data-inspector="account_kyc_faq">
      <Title>{_t('ib8hU23L3uqtcWzHhNybiV')}</Title>
      {list}
    </Container>
  );
}

FAQ.Item = Item;
