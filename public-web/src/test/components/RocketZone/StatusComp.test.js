/**
 * Owner: jessie@kupotech.com
 */
import '@testing-library/jest-dom';
import StatusComp from 'src/components/RocketZone/containers/OngoingProject/StatusComp.js';
import { customRender } from 'src/test/setup';

describe('NumFormatComp', () => {
  it('renders NumFormatComp', () => {
    customRender(<StatusComp status={0} typeName={'gemPreMarket'} />);
    customRender(<StatusComp status={1} typeName={'gemPreMarket'} />);
    customRender(<StatusComp status={2} typeName={'gemPreMarket'} />);
    customRender(<StatusComp status={3} typeName={'gemPreMarket'} />);
    customRender(<StatusComp status={4} typeName={'gemPreMarket'} />);
    customRender(<StatusComp status={1} typeName={'gemVote'} />);
    customRender(<StatusComp status={2} typeName={'gemVote'} />);
  });
});
