/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
// import clsx from 'clsx';
import { styled } from '@kufox/mui/emotion';
import { Spin, ThemeProvider } from '@kux/mui';

const Container = styled.section`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: #fff;
  > .KuxSpin-root {
    align-self: center;
  }
`;

// import styles from './style.less';

// const Loading = (props) => {
//   const { classNames = {} } = props || {};
//   return (
//     <section className={`${styles.loading} ${classNames.container || ''}`}>
//       <div className={`${styles.wrapper} ${classNames.wrapper || ''}`}>
//         {Array.from({ length: 6 }).map((_, index) => (
//           <div
//             key={index}
//             className={clsx(styles.item, styles[`item${index + 1}`], classNames.item)}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

const Loading = () => {
  const size = window.innerWidth > 768 ? 'basic' : 'small';

  return (
    <Container data-inspector="loading" data-testid="loading">
      <ThemeProvider>
        <Spin size={size} spinning />
      </ThemeProvider>
    </Container>
  );
};

export default Loading;
