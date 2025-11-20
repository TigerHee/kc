/*
 * owner: june.lee@kupotech.com
 */
import { useDispatch, useSelector } from 'react-redux';
import { styled, useResponsive, Spin } from '@kux/mui';
import useDebounceFn from '../../hooks/common/useDebounceFn';
import { NAMESPACE } from '../../config';
import SwapIcon from '../../components/SwapIcon';
import { useFromCurrency, useToCurrency } from '../../hooks/form/useStoreValue';

const LineContainer = styled.div`
  position: relative;
  height: 4px;
  background: ${(props) => props.theme.colors.overlay};
`;
const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: ${(props) => props.theme.colors.overlay};
  cursor: pointer;
`;

const InnerContent = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.cover4};
  border: 4px solid ${(props) => props.theme.colors.overlay};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 32px;
    height: 32px;
  }

  svg {
    transform: rotate(90deg);
  }
`;

const SwapButton = ({ onClick, ...otherProps }) => {
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();

  const { run } = useDebounceFn(
    (pair) => {
      const [newFromCurrency, newToCurrency] = pair;
      const currencyGroup = {
        toCurrency: newToCurrency,
        fromCurrency: newFromCurrency,
      };
      dispatch({
        type: `${NAMESPACE}/updateUsddCurrency`,
        payload: currencyGroup,
      });
      if (onClick) onClick();
    },
    { wait: 500, leading: true },
  );

  return (
    <LineContainer>
      <Content onClick={() => run([toCurrency, fromCurrency])} {...otherProps}>
        <InnerContent>
          <SwapIcon size={sm ? 16 : 12} />
        </InnerContent>
      </Content>
    </LineContainer>
  );
};

export default SwapButton;
