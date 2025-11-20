/**
 * Owner: willen@kupotech.com
 */
import { Box, styled, useResponsive } from '@kux/mui';
import Privacy from './Privacy';

const VERTICAL_PADDING_LG = '32px';
const VERTICAL_PADDING_SM = '20px';

const BaseCardWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: ${VERTICAL_PADDING_LG} 32px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${VERTICAL_PADDING_SM} 16px 0;
  }
`;
const BaseCardWrapperTop = styled.div`
  display: flex;
  align-items: flex-start;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: ${({ h5Direction = 'column-reverse' }) => h5Direction};
    gap: 12px 0;
    align-items: center;
    padding: 0px;
  }
`;
const LeftWrapper = styled.div`
  flex: 1;
`;
const RightWrapper = styled.div`
  flex-shrink: 0;
  margin-left: 40px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: unset;
  }
`;

const BottomWrapper = styled.div`
  margin-top: 20px;
`;

const BaseCard = ({ leftSlot, rightSlot, bottomSlot, className, privacy = true, h5Direction }) => {
  const rv = useResponsive();
  const downSmall = !rv?.sm;
  return (
    <BaseCardWrapper className="BaseCardWrapper">
      <BaseCardWrapperTop h5Direction={h5Direction} className={className}>
        {leftSlot ? <LeftWrapper>{leftSlot}</LeftWrapper> : null}
        {rightSlot ? <RightWrapper>{rightSlot}</RightWrapper> : null}
      </BaseCardWrapperTop>

      {bottomSlot ? (
        <BottomWrapper className="BaseCardBottomWrapper">{bottomSlot}</BottomWrapper>
      ) : null}

      {privacy ? (
        <Privacy />
      ) : (
        <Box style={{ height: downSmall ? VERTICAL_PADDING_SM : VERTICAL_PADDING_LG }} />
      )}
    </BaseCardWrapper>
  );
};

export default BaseCard;
