/**
 * Owner: gavin.liu1@kupotech.com
 */
import { Spin } from '@kufox/mui';
import { styled } from '@kufox/mui/emotion';
import styles from './style.less';

const StyledSpin = styled(Spin)`
  ${props => {
    if (props?.internalSize) {
      return `
      .KuxSpin-spin {
        width: ${props.internalSize}px;
        height: ${props.internalSize}px;
      }
      `
    }
  }}
`

export const BetterSpin = ({ children, size: internalSize, ...props }) => {
  return (
    <div className={styles.spin}>
      <StyledSpin internalSize={internalSize} {...props}>
        {children}
      </StyledSpin>
    </div>
  );
};
