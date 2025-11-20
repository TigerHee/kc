/**
 * Owner: will.wang@kupotech.com
 */
import styles from "./style.module.scss";

const Tag = ({
  info = { text: "" },
  onClick = () => {},
}: {
  info?: { text: string };
  onClick?: () => void;
}) => {
  return (
    <p className={styles.tag} onClick={onClick}>
      {`{ ${String(info.text || "").toUpperCase()} }`}
    </p>
  );
};

export default Tag;
