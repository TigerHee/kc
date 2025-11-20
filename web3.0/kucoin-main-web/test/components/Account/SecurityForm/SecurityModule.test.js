
/**
 * Owner: willen@kupotech.com
 */
test('test', () => {})
// import React from 'react';
// import SecurityModule from 'src/components/Account/SecurityForm/SecurityModule';
// import { act, fireEvent, screen, waitFor } from '@testing-library/react';
// import { customRender } from 'test/setup';
// import { SnackbarContext } from '@kufox/mui/context/index';

// jest.mock('react-redux', () => {
//   return {
//     __esModule: true,
//     default: null,
//     ...jest.requireActual('react-redux'),
//     useDispatch: jest.fn().mockImplementation(() => () => Promise.reject({ code: '40106' })),
//   };
// });

// jest.mock('@kufox/mui', () => {
//   return {
//     __esModule: true,
//     ...jest.requireActual('@kufox/mui'),
//     withSnackbar: () => {
//       return {
//         message: {},
//       };
//     },
//   };
// });

// class Test extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     const { children, ...restProps } = this.props;
//     return <SnackbarContext.Provider value={restProps}>{children}</SnackbarContext.Provider>;
//   }
// }

// describe('test SecurityModule', () => {
//   test('test SecurityModule', async () => {
//     const onSuccess = jest.fn();

//     const { rerender, container } = customRender(
//       <Test>
//         <SecurityModule
//           allowTypes={[]}
//           bizType={'BIND_PHONE'}
//           warning="warning-test"
//           onSuccess={onSuccess}
//         />
//       </Test>,
//       {
//         user: {},
//         security_new: {},
//       },
//     );
//     expect(container.innerHTML).toContain('warning-test');
//     // expect(onSuccess).toHaveBeenCalledTimes(1);

//     rerender(
//       <Test>
//         <SecurityModule
//           allowTypes={[]}
//           bizType={'BIND_PHONE'}
//           warning="warning-test"
//           onSuccess={onSuccess}
//         />
//       </Test>,
//     );
//   });
// });
