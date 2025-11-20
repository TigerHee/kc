/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { addLangToPath } from 'utils/lang';

export default class SafeLink extends React.Component {
  static defaultProps = {
    isSelf: false,
  };

  render() {
    const { children, href, className, isSelf } = this.props;
    const target = isSelf ? '_self' : '_blank';
    return (
      <a
        href={addLangToPath(href)}
        className={className}
        target={target}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
}
