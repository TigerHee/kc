/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import Wrapper from './wrapper';
import withResponsive from '@kux/mui/lib/hocs/withResponsive';
import withTheme from '@kux/mui/lib/hocs/withTheme';
// import { useResponsive } from '@kux/mui';

@withResponsive
@withTheme
class GetData extends React.Component {
  render() {
    const { responsive, theme } = this.props;
    console.log(theme);
    return <div>Responsive Class Component: {JSON.stringify(responsive)}</div>;
  }
}

export default class WithResponsive extends React.Component {
  render() {
    return (
      <Wrapper>
        <GetData />
      </Wrapper>
    );
  }
}

// function GetData() {
//   const responsive = useResponsive();
//   console.log('responsive:', responsive);
//   return <div>Responsive Class Component: {JSON.stringify(responsive)}</div>;
// }
//
// export default function WithResponsive() {
//   return (
//     <Wrapper>
//       <GetData />
//     </Wrapper>
//   );
// }
