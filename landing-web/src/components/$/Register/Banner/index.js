/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect, useState, Fragment, useMemo } from 'react';
// import ReactGA from 'react-ga';
import { Input, Button, Form } from 'antd';
import { css } from '@emotion/css';
import { _t, _tHTML } from 'utils/lang';
import { useDispatch, useSelector } from 'dva';
import { Box } from '@kufox/mui';
import { REGEXP } from 'components/DrawerSignUp/const';
import DrawerSignUp from 'components/DrawerSignUp';
import { uet_report_conversion, trackFbRegister } from 'components/$/RegisterCommon/tool';
import bannerSvg from 'assets/registration/banner_image.svg';
import liheSvg from 'assets/registration/lihe.svg';
import liheTextSvg from 'assets/registration/lihe_text.svg';
import styles from './style.less';
import { kcsensorsClick, kcsensorsManualExpose, addSpmIntoQuery } from 'utils/ga';

// 捕获方式：1代表落地注册页
const CAPTURE_WAY = 1;

const getStyle = () => ({
  bonusImg: css`
    width: 80;
    height: 64;
    position: 'relative';
    top: -38;
  `,
  ruBonusImg: css`
    width: 80;
    height: 64;
    position: 'relative';
    top: -38;
  `,
  liheBox: css`
    position: 'absolute';
    top: 12;
    left: '50%';
    transform: 'translateX(-50%)';
  `,
  liheSvg: css`
    animation: '$move 2s 0s infinite';
  `,
});

const Banner = ({ form: { getFieldDecorator, validateFields } }) => {
  const dispatch = useDispatch();
  const { currentLang } = useSelector((state) => state.app);
  const { signupVisible } = useSelector((state) => state.register);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [tabKey, setTabKey] = useState('sign.email.tab');
  const _styles = getStyle();

  useEffect(() => {
    if (signupVisible) {
      setVisible(true);
    }
  }, [signupVisible]);

  useEffect(() => {
    if (visible) {
      kcsensorsManualExpose({ kc_pageid: 'B1landRegister' }, ['popUp', '1']);
    }
  }, [visible]);

  const handleSubmit = useCallback((e) => {
    // ReactGA.ga('send', 'event', 'ld', 'click', 'register');
    kcsensorsClick(['confirmButton', '1']);
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const value = values.email;
        if (REGEXP.phone.test(value)) {
          setTabKey('sign.phone.tab');
          setPhone(value);
          setEmail(null);
        } else {
          setTabKey('sign.email.tab');
          setEmail(value);
          setPhone(null);
        }
        setVisible(true);
      }
    });
  }, []);

  // 关闭弹窗
  const onClose = useCallback((e) => {
    e?.stopPropagation();
    setVisible(false);
    dispatch({
      type: 'register/update',
      payload: {
        signupVisible: false,
      },
    });
  }, []);

  const bonusImg = useMemo(() => {
    return (
      <Box
        className={
          currentLang === 'ru_RU'
            ? [_styles.ruBonusImg, styles.imgBox]
            : [_styles.bonusImg, styles.imgBox, 'bonusImg001']
        }
      >
        <img src={liheTextSvg} alt="" />
        <Box className={_styles.liheBox}>
          <img src={liheSvg} alt="" className={_styles.liheSvg} />
        </Box>
      </Box>
    );
  }, [currentLang, _styles]);

  return (
    <Fragment>
      <div className={styles.banner}>
        <div className={styles.left}>
          <div className={styles.leftTitle} inspector="title">
            {_t('register.banner.new.title')}
          </div>
          <div className={styles.leftSub} inspector="sub_title">
            {_t('register.banner.sub')}
          </div>

          <Form hideRequiredMark onSubmit={handleSubmit}>
            <div className={styles.leftSign}>
              <Form.Item>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        const checkValue = (value || '').trim();
                        if (!checkValue) {
                          callback(_t('form.format.error'));
                          return;
                        }
                        if (REGEXP.phone.test(checkValue) || REGEXP.email.test(checkValue)) {
                          callback();
                        } else {
                          callback(_t('register.format.error'));
                        }
                      },
                    },
                  ],
                })(
                  <Input
                    inspector="email_input"
                    placeholder={_t('register.banner.email')}
                    className={styles.signInput}
                  />,
                )}
              </Form.Item>

              <Button
                inspector="submit"
                type="primary"
                className={styles.signBtn}
                htmlType="submit"
              >
                {_t('register.signup')}
              </Button>
            </div>
          </Form>
        </div>
        <img inspector="banner_img" src={bannerSvg} alt="" />
      </div>
      <DrawerSignUp
        role='dialog'
        open={visible}
        showDiscount
        agreeJSX={_tHTML('term.user.agree')}
        tabKey={tabKey}
        initEmail={email}
        initPhone={phone}
        bonusImg={bonusImg}
        recallType={CAPTURE_WAY}
        onClose={(e) => onClose(e)}
        onChange={async (data) => {
          if(window.ym) window.ym(84577030, 'reachGoal', 'registration');
          uet_report_conversion();
          trackFbRegister(data);
          let blockID = '';
          if (data && data['$$blockID']) {
            blockID = data['$$blockID'];
          }
          let redirectUrl = `/referral?lang=${currentLang}`;
          if (blockID) {
            redirectUrl = await addSpmIntoQuery(redirectUrl, [blockID, '1']);
          }
          window.location.href = redirectUrl;
        }}
      />
    </Fragment>
  );
};

export default Form.create()(Banner);
