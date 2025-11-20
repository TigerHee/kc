/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import Privacy from './Privacy';

const BaseCardWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: ${({ isShowPrivacy }) => (isShowPrivacy ? '32px 32px 0' : '32px')};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ isShowPrivacy }) => (isShowPrivacy ? '20px 16px 0' : '20px 16px')};
  }
`;
const BaseCardWrapperTop = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: ${({ h5Direction = 'column-reverse' }) => h5Direction};
    gap: 16px 0;
    align-items: center;
    padding: 0px;
  }
`;
const LeftWrapper = styled.div`
  flex: 1;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    align-self: flex-start;
  }
`;
const RightWrapper = styled.div`
  flex-shrink: 0;
  margin-left: 40px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    align-self: flex-start;
    margin-left: unset;
  }
`;

const BottomWrapper = styled.div`
  margin-top: 40px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 24px;
  }
`;

const BaseCard = ({
  leftSlot,
  rightSlot,
  bottomSlot,
  className = '',
  h5Direction,
  isShowPrivacy = false,
}) => {
  const rv = useResponsive();

  return (
    <BaseCardWrapper isShowPrivacy={isShowPrivacy}>
      <BaseCardWrapperTop
        h5Direction={h5Direction}
        className={`KYBBaseCardWrapperTop ${className}`}
      >
        {leftSlot ? <LeftWrapper>{leftSlot}</LeftWrapper> : null}
        {rightSlot ? <RightWrapper className="KYBRightWrapper">{rightSlot}</RightWrapper> : null}
      </BaseCardWrapperTop>
      {bottomSlot ? <BottomWrapper className="KYBBottomWrapper">{bottomSlot}</BottomWrapper> : null}
      {isShowPrivacy ? <Privacy /> : null}
    </BaseCardWrapper>
  );
};

export default BaseCard;
