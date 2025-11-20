/**
 * Owner: terry@kupotech.com
 */
import '@testing-library/jest-dom';
import { customRender } from 'src/test/setup';
import { Apr } from 'src/components/TradeActivity/GemPool/containers/ProjectItem/Apr.js';

describe('Apr Display', () => {
  it('normal render', () => {
    const { getByText } = customRender(<Apr apr={1} />)
    expect(getByText('908ebc584b974800a05e')).toBeInTheDocument();
  })

  it('empty render', () => {
    const { queryByText } = customRender(<Apr  />)
    expect(queryByText('908ebc584b974800a05e')).toBeNull();
  })

  it('normal render:end', () => {
    const { getByText } = customRender(<Apr apr={0} isEnd />)
    expect(getByText('908ebc584b974800a05e')).toBeInTheDocument();
  })
})