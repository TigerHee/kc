/**
 * Owner: saiya.lee@kupotech.com
 *
 * @description Collapse component
 */
import { Children, isValidElement, cloneElement, useRef, useEffect, useMemo } from 'react';
import { clx, flattenReactChildren } from '@/common';
import { TradeAddIcon, TradeSubIcon, TriangleBottomIcon } from '@kux/iconpack';
import { HStack } from '../stack';
import { Spacer } from '../spacer';
import { type ICollapseProps, useViewModel } from './use-viewmodel';

export { type ICollapseProps, type ICollapseItem } from './use-viewmodel';

import './style.scss'


/**
 * Collapse component
 */
export function Collapse(props: ICollapseProps) {
  const vm = useViewModel(props)
  return (
    <div className={'kux-collapse '+ ('is-' + (props.size || 'auto'))}>
      {
        props.items ?
          props.items.map(item => (
            <Panel
              key={item.key}
              header={item.title}
              content={item.content}
              accordion={props.accordion}
              expandIcon={props.expandIcon}
              isActive={vm.activeKey.includes(item.key)}
              toggle={() => vm.toggleActiveKey(item.key)}
            />
          ))
          : <AlteredChildren {...props} activeKey={vm.activeKey} toggle={vm.toggleActiveKey} />
      }
    </div>
  )
}

Collapse.Panel = Panel;

export interface ICollapsePanelProps {
  header: React.ReactNode
  content: React.ReactNode
  isActive?: boolean
  expandIcon?: ICollapseProps['expandIcon']
  // 手风琴模式: 同一时间只能展开一个面板
  accordion?: ICollapseProps['accordion']
  toggle?: () => void
}

function Panel(props: ICollapsePanelProps) {
  const panelContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panelContent = panelContentRef.current;
    if (!panelContent) return;
    if (props.isActive) {
      panelContent.style.setProperty('--kux-collapse-panel-content-height', `${panelContent.scrollHeight}px`);
    } else {
      panelContent.style.removeProperty('--kux-collapse-panel-content-height');
    }
  }, [props.isActive]);
  
  return (
    <div className={clx('kux-collapse-panel', {'active': props.isActive})}>
      <HStack className='kux-collapse-panel-header' onClick={() => props.toggle?.()}>
        <div>{props.header}</div>
        <Spacer minLength={16}/>
        <div className='kux-collapse-panel-header-icon'>
          {props.expandIcon ? props.expandIcon({ isActive: props.isActive || false }) : (
            props.accordion ? (
              <TriangleBottomIcon size={16} className='triangle-icon'  />
            ) : props.isActive ? (
              <TradeSubIcon size={16} />
            ) : (
              <TradeAddIcon size={16} />
            )
          )}
        </div>
      </HStack>
      <div className='kux-collapse-panel-content' ref={panelContentRef}>
        <div className='kux-collapse-panel-content-inner'>
          {props.content}
        </div>
      </div>
    </div>
  )
}



function AlteredChildren(props: Omit<ICollapseProps, 'activeKey'> & { activeKey: (string|number)[], toggle: (key: string|number) => void}) {
  const childrenArray = useMemo(() => {
    if (!props.children) return [];
    return flattenReactChildren(props.children);
  }, [props.children]);
  if (!childrenArray.length) return null;
  return Children.map(childrenArray, (child) => {
    if (!isValidElement(child)) return child;

    const key = child.key as string | number;
    return cloneElement(child, {
      // @ts-expect-error child should be a valid panel
      accordion: props.accordion,
      expandIcon: props.expandIcon,
      toggle: () => props.toggle(key),
      isActive: props.activeKey.includes(key),
    });
  });
}