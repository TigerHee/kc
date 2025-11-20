/**
 * Owner: will.wang@kupotech.com
 */
import Panel from './Panel';
import styles from './style.module.scss';

export default ({ data, ...restProps }) => {

  return (
    <ul className={styles.wrapper}  {...restProps}>
      {(data || []).map((i, index) => (
        <li key={`${i.question}_${index}`}>
          <Panel data={i} isAbout key={`${i.question}_${index}`} index={index} data-key={index} />
        </li>
      ))}
    </ul>
  );
};