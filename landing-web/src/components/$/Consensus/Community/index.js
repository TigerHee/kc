/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';
import { RightOutlined } from '@kufox/icons';
import { Button } from '@kufox/mui';
import { openPage } from 'helper';
import { useIsSmall, useIsMiddle } from 'hooks/mediaQuery';
import applyImg from 'assets/consensus/community-btn.png';
import applyMidImg from 'assets/consensus/community-btn-mid.png';
import JumpLink from '../JumpLink';
import styles from './style.less';
import ListingStyles from '../Listing/style.less';
import commonStyles from '../index.less';

const Community = ({ config }) => {
  const { block3, block2, block1, btnText, applyLink } = config;
  const { isInApp } = useSelector(state => state.app);
  const isMid = useIsMiddle();
  const isSmall = useIsSmall();

  const goApply = () => {
    openPage(isInApp, applyLink);
  };

  const renderBlock1 = () => {
    return (
      <div className={styles.block1}>
        <h2 className={commonStyles.commonTabTitle}>{block1.title}</h2>
        <div className={styles.list}>
          {block1.list.map(el => {
            return (
              <div className={styles.item}>
                <div className={styles.itemLogo} />
                <div className={styles.titleStyle}>{el.title}</div>
                <div className={styles.itemDesc}>{el.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBlock2 = () => {
    const { part1, part2, part3, tailText, tailLink } = block2;
    return (
      <div className={styles.block2}>
        <h2 className={commonStyles.commonTabTitle}>{block2.title}</h2>
        <div className={styles.block2Grid}>
          <div className={styles.part1}>
            <div className={styles.titleStyle}>{part1.title}</div>
            <>
              {part1.descs.map(el => (
                <div className={styles.part1Desc}>{el}</div>
              ))}
            </>
            <div>
              <JumpLink {...part1.tailLink} />
            </div>
          </div>
          <div className={styles.part2}>
            <div className={styles.titleStyle}>{part2.title}</div>
            <>
              {part2.descs.map(el => (
                <div className={styles.part2Desc}>
                  <span>{el[0]}</span> <span>{el[1]}</span>
                </div>
              ))}
            </>
            {/* 小屏幕时图片结构移动到此处 */}
            <>
              {isSmall && (
                <div className={styles.part4}>
                  <div className={styles.part4Glow}></div>
                  <div className={styles.part4Img}></div>
                </div>
              )}
            </>
          </div>
          <div className={styles.part3}>
            <div className={styles.titleStyle}>{part3.title}</div>
            <>
              {part3.descs.map(el => (
                <div className={styles.part3Desc}>
                  <div>{el[0]}</div>
                  <div>
                    {!!el[1] ? (
                      <div className={styles.jhgf}>
                        {el[1].map(item => (
                          <div>
                            · <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </>
            <div>
              <JumpLink {...part3.tailLink} />
            </div>
            <p className={`${commonStyles.commonFoot} ${styles.foot}`}>
              <span>{tailText}</span> <JumpLink {...tailLink} />
            </p>
          </div>
          <>
            {!isSmall && (
              <div className={styles.part4}>
                <div className={styles.part4Glow}></div>
                <div className={styles.part4Img}></div>
              </div>
            )}
          </>
        </div>
      </div>
    );
  };

  const renderBlock3 = () => {
    return (
      <div className={styles.block3}>
        <h2 className={commonStyles.commonTabTitle}>{block3.title}</h2>
        <div className={styles.list}>
          {block3.list.map(el => {
            return (
              <div className={styles.item}>
                <div className={styles.itemLogo} />
                <div className={styles.itemDesc}>{el.desc}</div>
                <div>
                  <JumpLink {...el.link} />
                </div>
              </div>
            );
          })}
        </div>
        <div className={ListingStyles.imgBox}>
          <img className={ListingStyles.applyImg} src={isMid ? applyMidImg : applyImg} alt="" />
          <Button className={ListingStyles.btnStyle} onClick={goApply}>
            <span>{btnText}</span>
            <RightOutlined className="ml-6" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.out}>
      <>
        <div className={styles.bigWords} />
        {renderBlock1()}
        {renderBlock2()}
        {renderBlock3()}
      </>
    </div>
  );
};

export default React.memo(Community);
