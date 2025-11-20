/**
 * Owner: jessie@kupotech.com
 */
import { StyledTitle } from './styledComponents';

export default function Title({ title, coin, extra }) {
  return (
    <StyledTitle>
      <div className="title">
        <img src={coin} alt="coin" />
        {title}
      </div>
      {extra && <div className="extra">{extra}</div>}
    </StyledTitle>
  );
}
