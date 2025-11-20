/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { memo } from 'react';
import { useSelector } from 'src/hooks/useSelector';

const AnchorWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: ${({ top }) => `-${top}px`}};
`;

const AnchorPlaceholder = memo(({ id }) => {
  const headerHeight = useSelector((state) => state?.gempool?.headerHeight);

  return <AnchorWrapper id={id} className="anchor" top={headerHeight} />;
});

export default AnchorPlaceholder;
