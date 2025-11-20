/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import ownerDocument from 'utils/ownerDocument';
import useForkRef from 'hooks/useForkRef';
import useEventCallback from 'hooks/useEventCallback';

function mapEventPropToEvent(eventProp) {
  return eventProp.substring(2).toLowerCase();
}

function clickedRootScrollbar(event, doc) {
  return (
    doc.documentElement.clientWidth < event.clientX ||
    doc.documentElement.clientHeight < event.clientY
  );
}

function ClickAwayListener(props) {
  const {
    children,
    disableReactTree = false,
    mouseEvent = 'onClick',
    onClickAway,
    touchEvent = 'onTouchEnd',
  } = props;
  const movedRef = React.useRef(false);
  const nodeRef = React.useRef(null);
  const activatedRef = React.useRef(false);
  const syntheticEventRef = React.useRef(false);
  React.useEffect(() => {
    setTimeout(() => {
      activatedRef.current = true;
    }, 0);
    return () => {
      activatedRef.current = false;
    };
  }, []);
  const handleRef = useForkRef(children.ref, nodeRef);

  const handleClickAway = useEventCallback((event) => {
    const insideReactTree = syntheticEventRef.current;
    syntheticEventRef.current = false;
    const doc = ownerDocument(nodeRef.current);
    if (
      !activatedRef.current ||
      !nodeRef.current ||
      ('clientX' in event && clickedRootScrollbar(event, doc))
    ) {
      return;
    }

    if (movedRef.current) {
      movedRef.current = false;
      return;
    }

    let insideDOM;

    if (event.composedPath) {
      insideDOM = event.composedPath().indexOf(nodeRef.current) > -1;
    } else {
      insideDOM =
        !doc.documentElement.contains(event.target) || nodeRef.current.contains(event.target);
    }

    if (!insideDOM && (disableReactTree || !insideReactTree)) {
      onClickAway(event);
    }
  });

  const createHandleSynthetic = (handlerName) => (event) => {
    syntheticEventRef.current = true;
    const childrenPropsHandler = children.props[handlerName];

    if (childrenPropsHandler) {
      childrenPropsHandler(event);
    }
  };

  const childrenProps = {
    ref: handleRef,
  };

  if (touchEvent !== false) {
    childrenProps[touchEvent] = createHandleSynthetic(touchEvent);
  }

  React.useEffect(() => {
    if (touchEvent !== false) {
      const mappedTouchEvent = mapEventPropToEvent(touchEvent);
      const doc = ownerDocument(nodeRef.current);

      const handleTouchMove = () => {
        movedRef.current = true;
      };

      doc.addEventListener(mappedTouchEvent, handleClickAway);
      doc.addEventListener('touchmove', handleTouchMove);
      return () => {
        doc.removeEventListener(mappedTouchEvent, handleClickAway);
        doc.removeEventListener('touchmove', handleTouchMove);
      };
    }

    return undefined;
  }, [handleClickAway, touchEvent]);

  if (mouseEvent !== false) {
    childrenProps[mouseEvent] = createHandleSynthetic(mouseEvent);
  }

  React.useEffect(() => {
    if (mouseEvent !== false) {
      const mappedMouseEvent = mapEventPropToEvent(mouseEvent);
      const doc = ownerDocument(nodeRef.current);
      doc.addEventListener(mappedMouseEvent, handleClickAway);
      return () => {
        doc.removeEventListener(mappedMouseEvent, handleClickAway);
      };
    }

    return undefined;
  }, [handleClickAway, mouseEvent]);
  return <>{React.cloneElement(children, childrenProps)}</>;
}

export default ClickAwayListener;
