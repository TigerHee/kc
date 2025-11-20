/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback } from 'react';
import useMergedState from 'hooks/useMergedState';
import toArray from 'utils/toArray';
import PropTypes from 'prop-types';
import showEqual from 'utils/showEqual';
import styled from 'emotion/index';
import AccordionPanel from './AccordionPanel';

const AccordionRoot = styled.div`
  margin: 0;
  padding: 0;
  list-style: none;
`;

function getActiveKeysArray(activeKey) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    const activeKeyType = typeof currentActiveKey;
    currentActiveKey =
      activeKeyType === 'number' || activeKeyType === 'string' ? [currentActiveKey] : [];
  }
  return currentActiveKey.map((key) => String(key));
}

const Accordion = React.forwardRef((props, ref) => {
  const {
    children,
    defaultActiveKey,
    activeKey,
    accordion,
    onChange,
    expandIcon,
    bordered,
    ...others
  } = props;

  const [innerActiveKey, setInnerActiveKey] = useMergedState(defaultActiveKey, {
    value: activeKey,
    postState: (keys) => getActiveKeysArray(keys),
  });

  const onSetActiveKey = useCallback(
    (keys) => {
      setInnerActiveKey(keys);
      onChange?.(accordion ? keys[0] : keys);
    },
    [accordion, onChange, setInnerActiveKey],
  );

  const onItemClick = useCallback(
    (key) => {
      let _activeKey = [...innerActiveKey];
      if (accordion) {
        _activeKey = _activeKey[0] === key ? [] : [key];
      } else {
        _activeKey = [...innerActiveKey];
        const index = _activeKey.indexOf(key);
        const isActive = index > -1;
        if (isActive) {
          _activeKey.splice(index, 1);
        } else {
          _activeKey.push(key);
        }
      }
      onSetActiveKey(_activeKey);
    },
    [accordion, innerActiveKey, onSetActiveKey],
  );

  const childList = toArray(children).map((child, index) => {
    const key = child.key || String(index);
    let isActive = false;
    if (accordion) {
      isActive = innerActiveKey[0] === key;
    } else {
      isActive = innerActiveKey.indexOf(key) > -1;
    }
    const childProps = {
      key,
      isActive,
      panelKey: key,
      accordion,
      onItemClick,
      expandIcon,
      bordered,
      children: child.props.children,
      ...others,
    };
    if (child.type === 'string') {
      return child;
    }
    return React.cloneElement(child, childProps);
  });

  return <AccordionRoot ref={ref}>{childList}</AccordionRoot>;
});

Accordion.displayName = 'Accordion';

Accordion.propTypes = {
  accordion: PropTypes.bool,
  bordered: PropTypes.bool,
  activeKey: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
  defaultActiveKey: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
  expandIcon: PropTypes.func,
  onChange: PropTypes.func,
  dispersion: PropTypes.bool, // 分散
  size: PropTypes.oneOf(['default', 'small']), // dispersion true 有效
};

Accordion.defaultProps = {
  accordion: false,
  dispersion: false,
  size: 'default',
};

const MemoAccordion = React.memo(Accordion, (prevProps, nextProps) => {
  return showEqual(prevProps, nextProps);
});

MemoAccordion.AccordionPanel = AccordionPanel;

export default MemoAccordion;
