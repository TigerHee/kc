/**
 * Owner: victor.ren@kupotech.com
 */
import PropTypes from 'prop-types';
import chainPropTypes from './chainPropTypes';

function isClassComponent(elementType) {
  // elementType.prototype?.isReactComponent
  const { prototype = {} } = elementType;

  return Boolean(prototype.isReactComponent);
}

function acceptingRef(props, propName) {
  const element = props[propName];
  if (element == null || typeof window === 'undefined') {
    return null;
  }

  let warningHint;

  const elementType = element.type;

  if (typeof elementType === 'function' && !isClassComponent(elementType)) {
    warningHint = 'Did you accidentally use a plain function component for an element instead?';
  }

  if (warningHint !== undefined) {
    console.error('error');
  }

  return null;
}

const elementAcceptingRef = chainPropTypes(PropTypes.element, acceptingRef);
elementAcceptingRef.isRequired = chainPropTypes(PropTypes.element.isRequired, acceptingRef);

export default elementAcceptingRef;
