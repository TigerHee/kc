/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import useContextSelector from '../hooks/common/useContextSelector';
import NumberFormat from './common/NumberFormat';
import { isFinite } from '../utils/format';
import AddButton from './AddButton';

const FlexBox = styled.div`
  display: flex;
  align-items: center;
`;
const Container = styled.div`
  padding: 22px 20px 12px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.cover4};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 18px 12px 6px;
  }
`;
const Row = styled(FlexBox)`
  justify-content: space-between;
`;
const Info = styled(FlexBox)`
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  &:not(:first-of-type) {
    margin-left: 14px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-left: 10px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;
const StyledAddButton = styled(AddButton)`
  margin-left: 4px;
`;
const FieldBox = styled.div`
  margin-top: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 14px;
  }
`;

const formatBalance = (v, isLogin) => {
  return isLogin && isFinite(v) ? v : '--';
};

const FieldWrapper = ({ title, currency, balance, showAddButton, children, ...otherProps }) => {
  const { t: _t } = useTranslation('convert');
  const isLogin = useContextSelector((state) => Boolean(state.user));
  return (
    <Container {...otherProps}>
      <Row>
        <Info>{title}</Info>
        <Info>
          {_t('oTWzAYTsVvfiq8gyrmAA9w', { num: '' })}{' '}
          <span>
            <NumberFormat>{formatBalance(balance, isLogin)}</NumberFormat>
          </span>
          {Boolean(showAddButton) && <StyledAddButton coin={currency} />}
        </Info>
      </Row>
      <FieldBox>{children}</FieldBox>
    </Container>
  );
};

export default React.memo(FieldWrapper);
