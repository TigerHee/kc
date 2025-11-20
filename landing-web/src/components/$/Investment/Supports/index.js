/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useIsMobile } from 'components/Responsive';
import styles from './style.less';

const SUPPORTLIST = [
  {
    title: 'Business Development',
    contents: ['Fundraising Strategy','Deck Guidance','Collaborative buidling','Resource Connection'],
  },
  {
    title: 'Technical Framework',
    contents: ['Code Review','Security Advice','Product Structure'],
  },
  {
    title: 'PR, Marketing and Community',
    contents: ['Community Building Strategy','Social Media Promotion','Marketing Strategy'],
  },
  {
    title: 'Business Strategy',
    contents: ['Tokenomics','Business Model','Operation Roadmap'],
  }
]

const Supports = () => {
  const isMobile = useIsMobile();
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div inspector="support_title" className={styles.title}>
          {window._BRAND_NAME_} Labs Incubation Service
        </div>
      </div>
      <div className={styles.supportsWrapper}>
        {SUPPORTLIST.map(item=> (
          <div className={styles.supportItem}>
            <h1>{item.title}</h1>
            {item.contents.map(content=><p key={content}>{content}</p>)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Supports;
