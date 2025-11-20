/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';
import createDetectElementResize from './detectElementResize';

const Root = styled.div`
  div {
    overflow-x: hidden;
  }
`;

export default class AutoSizer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: props.defaultHeight || 0,
      width: props.defaultWidth || 0,
    };
  }

  componentDidMount() {
    const { nonce } = this.props;
    if (
      this._autoSizer &&
      this._autoSizer.parentNode &&
      this._autoSizer.parentNode.ownerDocument &&
      this._autoSizer.parentNode.ownerDocument.defaultView &&
      this._autoSizer.parentNode instanceof
        this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement
    ) {
      this._parentNode = this._autoSizer.parentNode;

      this._detectElementResize = createDetectElementResize(nonce);
      this._detectElementResize.addResizeListener(this._parentNode, this._onResize);

      this._onResize();
    }
  }

  componentWillUnmount() {
    if (this._detectElementResize && this._parentNode) {
      this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
    }
  }

  _onResize = () => {
    const { disableHeight, disableWidth, onResize } = this.props;

    if (this._parentNode) {
      // Guard against AutoSizer component being removed from the DOM immediately after being added.
      // This can result in invalid style values which can result in NaN values if we don't handle them.
      // See issue #150 for more context.

      const height = this._parentNode.offsetHeight || 0;
      const width = this._parentNode.offsetWidth || 0;

      const style = window.getComputedStyle(this._parentNode) || {};
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
      const paddingRight = parseInt(style.paddingRight, 10) || 0;
      const paddingTop = parseInt(style.paddingTop, 10) || 0;
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0;

      const newHeight = height - paddingTop - paddingBottom;
      const newWidth = width - paddingLeft - paddingRight;

      if (
        (!disableHeight && this.state.height !== newHeight) ||
        (!disableWidth && this.state.width !== newWidth)
      ) {
        this.setState({
          height: height - paddingTop - paddingBottom,
          width: width - paddingLeft - paddingRight,
        });

        onResize({ height, width });
      }
    }
  };

  _setRef = (autoSizer) => {
    this._autoSizer = autoSizer;
  };

  render() {
    const { children, className, disableHeight, disableWidth, style } = this.props;
    const { height, width } = this.state;

    const outerStyle = { overflow: 'visible' };
    const childParams = {};

    let bailoutOnChildren = false;

    if (!disableHeight) {
      if (height === 0) {
        bailoutOnChildren = true;
      }
      outerStyle.height = 0;
      childParams.height = height;
    }

    if (!disableWidth) {
      if (width === 0) {
        bailoutOnChildren = true;
      }
      outerStyle.width = 0;
      childParams.width = width;
    }

    return (
      <Root
        className={className}
        ref={this._setRef}
        style={{
          ...outerStyle,
          ...style,
        }}
      >
        {!bailoutOnChildren && children(childParams)}
      </Root>
    );
  }
}

AutoSizer.defaultProps = {
  onResize: () => {},
  disableHeight: false,
  disableWidth: false,
  style: {},
};
