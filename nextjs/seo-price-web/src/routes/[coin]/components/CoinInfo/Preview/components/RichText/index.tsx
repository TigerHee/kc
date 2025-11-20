/**
 * Owner: will.wang@kupotech.com
 */
import useHtmlToReact from "@/hooks/useHtmlToReact";
import { trackClick } from "gbiz-next/sensors";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import clsx from "clsx";
import useTranslation from "@/hooks/useTranslation";

const RichText = ({
  info = { text: "", subText: "" },
  children,
  isFaq = false,
  onClick = () => {},
}: {
  info: {
    text: string;
    subText: string;
  };
  isFaq?: boolean;
  children: any;
  onClick?: () => void;
}) => {
  const { _t } = useTranslation();

  const { text, subText } = info;
  const [isHide, setIsHide] = useState(true);
  const [lineNumber, setLineNumber] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleHide = (evt) => {
    trackClick(["ViewMore", "2"]);
    evt.stopPropagation();
    setIsHide(false);
  };

  useEffect(() => {
    if (!contentRef.current) return;
    const content = contentRef.current;
    const lines = content.scrollHeight / 22;
    setLineNumber(Math.fround(lines));
  }, [subText, children]);

  const { eles } = useHtmlToReact({ html: subText, checkTenantATagRendering: true });

  return (
    <div className={styles.richTextWrapper} onClick={onClick}>
      {!!text && !isFaq && <h2 className={styles.title}>{text}</h2>}
      <div
        className={clsx(styles.content, {
          [styles.ellipsis]: isFaq ? false : isHide,
        })}
        ref={contentRef}
      >
        <article className={styles.article}>{eles}</article>
        {children}
        {isHide && lineNumber > 3 && !isFaq && (
          <span className={styles.viewMore}>
            <span onClick={handleHide}>{_t("ahaG8LR8isY59KrfnDsFtz")}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default RichText;
