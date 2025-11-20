
/**
 * Owner: willen@kupotech.com
 */
test('test', () => {})
// import React from 'react';
// import CoinSelectWithModal from 'src/components/Assets/Deposit/CoinSelectWithModal/index';
// import { customRender } from 'test/setup';
// import { KuFoxThemeContext } from '@kufox/mui/context/index';
// import { fireEvent, screen } from '@testing-library/react';

// class Test extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     const { children, ...restProps } = this.props;

//     return <KuFoxThemeContext.Provider value={restProps}>{children}</KuFoxThemeContext.Provider>;
//   }
// }

// jest.mock('@kufox/mui/hooks/useTheme', () => {
//   return {
//     __esModule: true,
//     default: () => {
//       return {
//         breakpoints: {
//           down: () => {},
//         },
//       };
//     },
//   };
// });

// describe('test Empty', () => {
//   test('test Empty', () => {
//     let state = {
//       coinin: {
//         filters: {},
//         searchRecords: ['btc', 'eth'],
//       },
//       user_assets: {},
//       currency: {},
//       coins: {},
//       user: {},
//       categories: undefined,
//     };
//     const { container, rerender } = customRender(
//       <Test>
//         <CoinSelectWithModal />
//       </Test>,
//       state,
//     );
//     expect(container.innerHTML).toContain('deposit.new.coin.prefix');
//   });

//   test('test Empty', () => {
//     let state = {
//       coinin: {
//         filters: {},
//         searchRecords: ['btc', 'eth'],
//       },
//       user_assets: { coinIn: [{ currency: 'btc' }, , { currency: 'eth' }] },
//       currency: {},
//       coins: {},
//       user: {},
//       categories: { btc: { name: 'btc' } },
//     };
//     const { container, rerender } = customRender(
//       <Test>
//         <CoinSelectWithModal />
//       </Test>,
//       state,
//     );
//     expect(container.innerHTML).toContain('deposit.new.coin.prefix');
//   });
// });
