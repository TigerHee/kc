/**
 * Owner: will.wang@kupotech.com
 */

import { useTheme } from '@kux/mui-next';
import AccordionDom from '../Accordion';
import styles from './style.module.scss';

export default ({ data, ...restProps }) => {
  const theme = useTheme();

  return (
    <ul className={styles.wrapper} {...restProps}>
      {(data || []).map((item, index) => (
        <li key={index}>
          <AccordionDom key={index} title={item.question} description={item.answer} />
        </li>
      ))}
    </ul>
  );
};