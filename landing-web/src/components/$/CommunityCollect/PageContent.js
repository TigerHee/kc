/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { styled } from '@kux/mui/emotion';
import { Spin } from '@kux/mui';
import { useKuxMediaQuery } from 'src/hooks';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useRef, useState } from 'react';

const Container = styled.div`
  position: relative;
  max-width: 1200px;
  padding: 0 0 80px;
  margin: 0 auto;

  ${(props) => props.theme.breakpoints.down('xl')} {
    padding: 0 32px 80px;
    transition: all .3s ease;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
    top: -20px;
  }
`;

const SpinContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200px 0;
`;

export function PageContent(props) {
  const { loading, children } = props;
  const nodeRef = useRef(null);
  const [show, setShow] = useState(false);
  const { downSm } = useKuxMediaQuery();
  const loadingSize = !downSm ? 'basic' : 'small';

  useEffect(() => {
    if (!loading) {
      setShow(true);
    }
  }, [props.loading]);

  return (
    <Container data-inspector="communityCollect">
      {loading ? (
        <SpinContainer>
          <Spin spinning={loading} size={loadingSize} />
        </SpinContainer>
      ) : (
        <CSSTransition
          in={show}
          timeout={500}
          className="community-collect-page-content"
          unmountOnExit
        >
          <div ref={nodeRef}>{children}</div>
        </CSSTransition>
      )}
    </Container>
  );
}
