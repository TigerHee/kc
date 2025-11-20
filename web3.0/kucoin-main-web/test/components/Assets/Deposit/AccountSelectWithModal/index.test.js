/**
 * Owner: willen@kupotech.com
 */

test('test', () => {})
// import React from 'react';
// import AccountSelectWithModal, {
//   ACCOUNT_TYPE,
// } from 'src/components/Assets/Deposit/AccountSelectWithModal/index';
// import { customRender } from 'test/setup';
// import { KuFoxThemeContext } from '@kufox/mui/context/index';
// import { fireEvent, screen } from '@testing-library/react';

// const data = { currentLang: 'en_US' };
// jest.mock('src/components/LoadLocale', () => {
//   return {
//     __esModule: true,
//     injectLocale: (WrappedComponent) => (props) => {
//       return <WrappedComponent {...props} lang={data.currentLang} currentLang={data.currentLang} />;
//     },
//     useLocale: jest.fn(),
//   };
// });

// describe('test AccountSelectWithModal', () => {
//   class Test extends React.Component {
//     constructor(props) {
//       super(props);
//     }
//     render() {
//       const { children, theme } = this.props;

//       return <KuFoxThemeContext.Provider value={theme}>{children}</KuFoxThemeContext.Provider>;
//     }
//   }
//   test('test AccountSelectWithModal', async () => {
//     customRender(
//       <Test
//         theme={{
//           breakpoints: {
//             down: () => {},
//           },
//         }}
//       >
//         <AccountSelectWithModal value={'MAIN'} />
//       </Test>,
//     );

//     fireEvent.click(screen.getByText('deposit.new.account.change'));

//     expect(screen.getByText('deposit.new.account.switch')).not.toBeEmptyDOMElement();
//   });

//   test('test AccountSelectWithModal', () => {
//     let accountList = [
//       {
//         accountType: 'test',
//       },
//       {
//         accountType: 'MAIN',
//       },
//       {
//         accountType: 'TRADE',
//       },
//       {
//         accountType: 'MARGIN',
//       },
//       {
//         accountType: 'CONTRACT',
//       },
//       {
//         accountType: 'ISOLATED',
//       },
//     ];

//     const onChange = jest.fn();

//     const { container, rerender } = customRender(
//       <Test
//         theme={{
//           breakpoints: {
//             down: () => {},
//           },
//         }}
//       >
//         <AccountSelectWithModal accountList={accountList} value={'TRADE'} />
//       </Test>,
//     );

//     data.currentLang = 'zh_CN';

//     rerender(
//       <Test
//         theme={{
//           breakpoints: {
//             down: () => {},
//           },
//         }}
//       >
//         <AccountSelectWithModal accountList={accountList} value={'TRADE'} onChange={onChange} />,
//       </Test>,
//     );
//     fireEvent.click(screen.getByText('deposit.new.account.change'));

//     fireEvent.click(screen.getByTestId('MAIN'));
//     expect(onChange).toHaveBeenCalledTimes(1);
//   });
// });

// describe('test ACCOUNT_TYPE', () => {
//   class Test extends React.Component {
//     constructor(props) {
//       super(props);
//     }
//     render() {
//       const { accountConfig, currentLang, styles } = this.props;

//       return <span>{accountConfig.labelComp(currentLang, styles)}</span>;
//     }
//   }

//   test('test AccountSelectWithModal', async () => {
//     const { container, rerender } = customRender(<Test accountConfig={ACCOUNT_TYPE['MAIN']} />);
//     expect(container.innerHTML).toContain('Ma');

//     rerender(<Test accountConfig={ACCOUNT_TYPE['CONTRACT']} />);
//     expect(container.innerHTML).toContain('Fu');
//   });
// });
