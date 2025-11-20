/**
 * Owner: terry@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import { useSelector } from 'dva';
import { _t } from 'utils/lang';
import { sensors } from 'utils/sensors';
import {
  Row,
  BrandWrapper,
  IconWrapper,
  StyledKCIcon,
  StyledXIcon,
  StyledUserIcon,
  StyledEmptyUserIcon,
  Named,
  Title,
  Desc,
  RegisterBtn,
} from '../styles';

const syncLabel = (name1, name2, icon1, icon2) => {
  if (!name1 || !name2 || !icon1 || !icon2) return;
  try {
    const _width = Math.max(name1?.scrollWidth, name2?.scrollWidth);
    if (!_width) return;
    [name1, name2].forEach((el) => {
      el.style.width = `${_width}px`;
    });
    [icon1, icon2].forEach((el) => {
      el.style.width = `${_width}px`;
    });
  } catch (e) {
    console.error(e);
  }
};

const Brand = ({ clickSignUp, query, currentLang }) => {
  const { userInfo } = useSelector((state) => state.invite);
  const { nickName } = userInfo || {};
  const { subject } = query || {};
  const isUserEmpty = !subject;
  const name1 = useRef();
  const name2 = useRef();
  const icon1 = useRef();
  const icon2 = useRef();

  useEffect(() => {
    if (isUserEmpty || !nickName) return;
    setTimeout(() => {
      syncLabel(name1?.current, name2?.current, icon1?.current, icon2?.current);
    }, 100);
  }, [nickName, isUserEmpty]);

  return (
    <>
      <BrandWrapper>
        <Row>
          <IconWrapper ref={icon1}>
            {isUserEmpty ? <StyledEmptyUserIcon /> : <StyledUserIcon />}
          </IconWrapper>
          <StyledXIcon />
          <IconWrapper ref={icon2}>
            <StyledKCIcon />
          </IconWrapper>
        </Row>
        <Row between style={{ width: '100%' }}>
          <Named ref={name1} user>
            {isUserEmpty || !nickName ? '--' : nickName}
          </Named>
          <Named ref={name2}>{window._BRAND_NAME_}</Named>
        </Row>
      </BrandWrapper>
      <Title>{_t('ifoLAiwZJpVtPq5RqXbbF8')}</Title>
      <Desc>{_t('fZMMbjv1KeffrUHAkgojan')}</Desc>
      <RegisterBtn
        onClick={() => {
          clickSignUp();
          sensors.trackClick(['InviteeSignUp', '1'], {
            language: currentLang,
            subject,
          });
        }}
      >
        {_t('vhzcz1xTGvtxA5Ah1prFEQ')}
      </RegisterBtn>
    </>
  );
};

export default Brand;
