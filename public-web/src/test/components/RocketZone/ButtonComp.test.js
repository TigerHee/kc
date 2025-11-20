/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import ButtonComp from 'src/components/RocketZone/containers/OngoingProject/ButtonComp.js';
import { customRender } from 'src/test/setup';

describe('NumFormatComp', () => {
  it('renders NumFormatComp', () => {
    customRender(<ButtonComp status={1} typeName={'gemPreMarket'} shortName={'BTC'} url={'/'} />);
    customRender(<ButtonComp status={1} typeName={'gemVote'} shortName={'BTC'} />);
    customRender(<ButtonComp status={2} typeName={'gemVote'} shortName={'BTC'} />);
  });
});
