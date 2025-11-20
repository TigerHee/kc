/**
 * Owner: Lena@kupotech.com
 */
import { Spin, styled, useSnackbar } from '@kux/mui';
import classnames from 'classnames';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import { ReactComponent as CameraIcon } from '@/static/account/kyc/lego/camera_button.svg';
import { ReactComponent as CameraSmIcon } from '@/static/account/kyc/lego/camera_button_sm.svg';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import imgCompress from 'utils/imageCompressor';
import Loading from './Loading';
import Photo from './Photo';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const WIDTH = 580;
const HEIGHT = 362;
const BOTTOM_HEIGHT = 70;
const SCALE = HEIGHT / WIDTH;

const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const Wrapper = styled.div`
  position: relative;
  padding-top: 24px;
  height: ${(props) => (props.photo ? '400px' : '440px')};
  margin-right: -17px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-color: ${(props) => props.theme.colors.divider} transparent;
  -ms-scrollbar-track-color: transparent;
  scrollbar-track-color: transparent;
  scrollbar-width: 6px;
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.divider};
    border-radius: 13px;
  }
  &.hide {
    height: 0;
    padding: 0;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100vw;
    margin: 0 -16px;
  }
`;
const Content = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 16px;
    border-radius: 0;
  }
`;

const BottomContent = styled.div`
  padding-top: ${HEIGHT}px;
  width: auto;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: ${(props) => `${props.contentWidth}px`};
    margin: 0 auto;
    padding-top: ${(props) => `${props.contentWidth * SCALE}px`};
    padding-bottom: ${BOTTOM_HEIGHT}px;
  }
`;
const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  width: ${WIDTH}px;
  overflow: hidden;
  height: ${HEIGHT}px;
  /* border-radius: 8px; */
  opacity: ${(props) => (props.showCamera ? 1 : 0)};
  z-index: 2;
  background-color: transparent;
  display: block;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: 0;
    right: 16px;
    left: 16px;
    display: flex;
    justify-content: center;
    width: ${(props) => `${props.contentWidth}px`};
    height: ${(props) => `${props.contentWidth * SCALE}px`};
    border-radius: 0;
  }
`;
const Video = styled.video`
  /* border-radius: 8px; */
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    position: absolute;
    width: ${(props) => `${props.contentWidth}px`};
    height: ${(props) => `${props.contentWidth * SCALE}px`};
    border-radius: 0;
  }
`;
const StyledDiv = styled.div`
  width: 100%;
  height: ${HEIGHT - BOTTOM_HEIGHT}px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: ${(props) => `${props.contentWidth * SCALE - BOTTOM_HEIGHT}px`};
  }
`;

const CameraBtnOuterWrapper = styled.div`
  position: relative;
  z-index: 9;
  cursor: pointer;
  width: 50px;
  height: 50px;
  position: relative;
  display: inline-block;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before,
  &::after {
    position: absolute;
    width: 50px;
    height: 50px;
    border: 2px solid #fff;
    border-radius: 50%;
    opacity: 0;
    content: '';
  }
  &::before {
    animation: Wave 1.1s ease-in-out;
  }
  &::after {
    animation: SecondWave 1.1s ease-in-out 0.4s infinite;
  }
  @keyframes SecondWave {
    0% {
      transform: scale(1);
      opacity: 0.3;
    }

    30% {
      transform: scale(1);
      opacity: 0.3;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }
`;

const CameraBtn = styled(CameraIcon)`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;
const CameraSmBtn = styled(CameraSmIcon)`
  width: 80px;
  height: 80px;
  cursor: pointer;
`;
const CameraWrapper = styled.div`
  width: ${WIDTH}px;
  z-index: 3;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: 0;
    right: 16px;
    left: 16px;
    width: auto;
  }
`;
const CameraBottom = styled.div`
  width: 100%;
  height: ${BOTTOM_HEIGHT}px;
  line-height: 80px;
  background: rgba(0, 0, 0, 0.64);
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: ${(props) => `${props.contentWidth}px`};
  }
`;

const Desc = styled.p`
  font-size: 14px;
  line-height: 130%;
  margin-bottom: 9px;
  color: ${(props) => props.theme.colors.text60};
`;
const StyledSpin = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const TitleMap = {
  idcard: {
    front: '4fwmiJ3ej2tmrN4P8wYA77',
    back: '3fKvnmpkxYpkmCSWMk5rD2',
  },
  passport: {
    front: 'mmauEWMm8jLqvN9B9ZVv8t',
  },
  drivinglicense: {
    front: 'azrehcu1jDG3d9neaZxYdf',
    back: 'jyZ88JJLh2mRV2TmukvK6e',
  },
};
const Camera = ({ onOk }) => {
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const getUserMedia = (constrains, success, error) => {
    if (navigator.mediaDevices.getUserMedia) {
      //最新标准API
      navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia) {
      //webkit内核浏览器
      navigator.webkitGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator.mozGetUserMedia) {
      //Firefox浏览器
      navigator.mozGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator.getUserMedia) {
      //旧版API
      navigator.getUserMedia(constrains).then(success).catch(error);
    }
  };
  const [cameraDevices, setCameraDevices] = useState([]);
  const videoDom = document.querySelector('#camera-shot-video');
  const [photo, setPhoto] = useState('');
  const [imageCapture, setImageCapture] = useState(null);
  const [noCamera, setNoCamera] = useState(null);
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;

  const {
    kycInfo,
    legoPhotos,
    photoType,
    showCamera,
    legoCameraStep,
    kyc2ChannelInfo,
    legoPhotoIds: _legoPhotoIds,
  } = useSelector((state) => state.kyc);
  const loading = useSelector(
    (state) =>
      state.loading.effects['kyc/uploadImg'] ||
      state.loading.effects['kyc/submitKycOcr'] ||
      state.loading.effects['kyc/checkImg'] ||
      false,
  );
  const [legoPhotoIds, setLegoPhotoIds] = useState(_legoPhotoIds);
  const [spinning, setSpinning] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const [error, setError] = useState('');

  const resizeChange = () => {
    setContentWidth(document.body.offsetWidth - 32);
  };
  useEffect(() => {
    resizeChange();
    // 监听
    window.addEventListener('resize', resizeChange);
    // 销毁
    return () => window.removeEventListener('resize', resizeChange);
  }, []);

  const startCamera = () => {
    setPhoto('');

    try {
      kcsensorsManualExpose(
        [],
        {
          get_photo_status: 'start_get_photo',
          get_photo_result: '',
          shoot_type: 'manual',
          fail_reason: '',
          supplier_name: 'kucoin_web_camera',
          photo_side: photoType,
        },
        'kyc2_get_id_photo',
      );
    } catch (error) {
      console.log('err', error);
    }

    getUserMedia(
      {
        // video可直接传true，deviceId没传参数则使用默认的
        video: {
          width: isH5 ? contentWidth : WIDTH,
          height: isH5 ? contentWidth * SCALE : HEIGHT,
          frameRate: {
            min: 15,
            ideal: 30,
            max: 30,
          },
          deviceId:
            cameraDevices.length && cameraDevices[0].deviceId
              ? { exact: cameraDevices[0].deviceId }
              : undefined,
        },
        facingMode: 'user',
        audio: false,
      },
      (stream) => {
        setImageCapture(stream);
        // 播放视频流(兼容旧版video src)
        if ('srcObject' in videoDom) {
          videoDom.srcObject = stream;
        } else {
          videoDom.src = window.URL
            ? window.URL.createObjectURL(stream)
            : window.webkitURL.createObjectURL(stream);
        }
        videoDom.onloadedmetadata = function (e) {
          videoDom.play();

          dispatch({
            type: 'kyc/update',
            payload: {
              showCamera: true,
            },
          });

          try {
            kcsensorsManualExpose(
              [],
              {
                category: 'KucoinKYC',
                name: 'GetCameraAccessSuccess',
              },
              'technology_event',
            );
          } catch (error) {
            console.log('err', error);
          }
        };
      },
      (err) => {
        // message.error('摄像头开启失败！');
        setNoCamera(true);
        try {
          kcsensorsManualExpose(
            [],
            {
              category: 'KucoinKYC',
              name: 'GetCameraAccessFailed',
            },
            'technology_event',
          );
        } catch (error) {
          console.log('err', error);
        }
      },
    );
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const arr = [];
      for (const deviceInfo of deviceInfos) {
        if (deviceInfo.kind === 'videoinput') {
          arr.push({
            deviceId: deviceInfo.deviceId, // 摄像头的设备ID
            label: deviceInfo.label || 'camera', // 摄像头的设备名称
          });
        }
      }
      console.log('Camera-arr', arr);
      setCameraDevices(arr);
    });
  }, []);

  const stopCamera = () => {
    imageCapture &&
      imageCapture.getVideoTracks().forEach((track) => {
        track.stop();
      });
  };

  const shot = async () => {
    if (!photo) {
      if (spinning) {
        return;
      }
      setSpinning(true);
      dispatch({
        type: 'kyc/update',
        payload: {
          legoCameraStep: photoType === 'back' ? 'backPhoto' : 'frontPhoto',
        },
      });

      html2canvas(videoDom, {
        scale: 2,
      }).then(function (canvas) {
        const blob = canvas.toDataURL('image/png', 1);
        setPhoto(blob);
        setSpinning(false);
        // stopCamera();
        try {
          kcsensorsManualExpose(
            [],
            {
              get_photo_status: 'finish_get_photo',
              get_photo_result: 'success_get_photo',
              shoot_type: 'manual',
              fail_reason: '',
              supplier_name: 'kucoin_web_camera',
              photo_side: photoType,
            },
            'kyc2_get_id_photo',
          );
        } catch (error) {
          console.log('err', error);
          try {
            kcsensorsManualExpose(
              [],
              {
                get_photo_status: 'finish_get_photo',
                get_photo_result: 'failed_get_photo',
                shoot_type: 'manual',
                fail_reason: '',
                supplier_name: 'kucoin_web_camera',
                photo_side: photoType,
              },
              'kyc2_get_id_photo',
            );
          } catch (error) {
            console.log('err', error);
          }
        }
      });
      try {
        trackClick(['B1KYCKucouinCameraShoot', '1']);
      } catch (error) {
        console.log('err', error);
      }
    } else {
      setPhoto('');
    }
  };

  useEffect(() => {
    return () => {
      if (imageCapture) {
        stopCamera();
      }
    };
  }, [imageCapture]);

  const base64ToBlob = (url) => {
    let arr = url.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const blobToFile = (base64, fileName) => {
    const blob = base64ToBlob(base64);
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
  };

  const uploaImg = async (file) => {
    // 压缩图片并上传
    let uploadFile = file;
    const { size } = file;
    const sizeMb = size / (1024 * 1024);
    // 大于1Mb启用压缩上传
    if (sizeMb > 1) {
      try {
        uploadFile = await imgCompress(file);
      } catch (e) {
        console.error('图片压缩上传失败', e);
      }
    }
    const data = await dispatch({
      type: 'kyc/uploadImg',
      payload: { file: uploadFile, kycType: 0, photoType: photoType === 'front' ? 0 : 1 },
    });
    return data;
  };

  const submit = async (ids) => {
    dispatch({
      type: 'kyc/update',
      payload: {
        legoPhotoIds: ids,
        kyc_id_photo_catch_type: 'shot',
      },
    });

    const data = await dispatch({
      type: 'kyc/submitKycOcr',
      payload: {
        frontPhoto: ids.frontPhoto,
        backendPhoto: ids.backendPhoto || ids.frontPhoto,
        ekycflowId: kyc2ChannelInfo?.ekycflowId,
      },
    });
    if (data?.success && data?.data) {
      setPhoto('');
      onOk('facial');
      dispatch({
        type: 'kyc/update',
        payload: {
          showCamera: false,
        },
      });
    } else {
      data?.msg && message.error(data?.msg);
    }
    stopCamera();
  };

  const handleContinue = async () => {
    try {
      trackClick(['B1KYCIDPhotoCheckConfirm', '1'], {
        photo_side: photoType,
      });
    } catch (error) {
      console.log('err', error);
    }
    //上传照片
    const data = await uploaImg(blobToFile(photo));

    if (data?.success && data?.data) {
      //iqa检测
      const res = await dispatch({
        type: 'kyc/checkImg',
        payload: {
          ekycFlowId: kyc2ChannelInfo?.ekycflowId,
          type: photoType === 'front' ? 'FRONT' : 'BACK',
          photo: data.data,
        },
      });
      if (res?.data && res.success) {
        if (kycInfo?.identityType === 'passport') {
          dispatch({
            type: 'kyc/update',
            payload: {
              legoPhotos: {
                frontPhoto: photo,
              },
              legoType: 'camera',
            },
          });
          setLegoPhotoIds({ frontPhoto: data.data });
          submit({ frontPhoto: data.data });
        } else {
          if (photoType === 'front') {
            dispatch({
              type: 'kyc/update',
              payload: {
                legoPhotos: {
                  frontPhoto: photo,
                },
                photoType: 'back',
                legoCameraStep: 'backCamera',

                showCamera: false,
              },
            });
            setLegoPhotoIds({ frontPhoto: data.data });
            setPhoto('');
          } else {
            dispatch({
              type: 'kyc/update',
              payload: {
                legoPhotos: {
                  ...legoPhotos,
                  backPhoto: photo,
                },
                legoType: 'camera',
              },
            });

            setLegoPhotoIds({ ...legoPhotoIds, backendPhoto: data.data });
            submit({ ...legoPhotoIds, backendPhoto: data.data });
          }
        }
      } else {
        console.log('msg', res?.msg);
        setError(res?.msg);
      }
    }
    if (!data?.success && data?.msg) {
      message.error(data?.msg);
    }
  };

  useEffect(() => {
    if (legoCameraStep && videoDom) {
      if (legoCameraStep.includes('Camera') && !showCamera) {
        startCamera();
      } else if (legoCameraStep.includes('Photo') && !photo) {
        // stopCamera();

        setPhoto(photoType === 'back' ? legoPhotos?.backPhoto : legoPhotos?.frontPhoto);
      }
    }
  }, [legoPhotos, videoDom, photoType, legoCameraStep, showCamera, photo]);

  // 组件初始化时启动摄像头
  useEffect(() => {
    if (videoDom && !showCamera && !photo) {
      startCamera();
    }
  }, [videoDom]);

  useEffect(() => {
    setNoCamera(cameraDevices.length === 0);
  }, [cameraDevices]);

  const retry = async () => {
    try {
      trackClick(['B1KYCCameraFailedRetry', '1']);
    } catch (error) {
      console.log('err', error);
    }
    await dispatch({
      type: 'kyc/update',
      payload: {
        showCamera: false,
      },
    });
    startCamera();
  };

  useEffect(() => {
    if (showCamera && !photo) {
      try {
        kcsensorsManualExpose(['B1KYCKucouinCamera', '1'], {});
      } catch (error) {
        console.log('err', error);
      }
    }
  }, [photo, showCamera]);

  useEffect(() => {
    if (!photo) {
      setError('');
    }
  }, [photo]);

  return (
    <>
      {showCamera && photo ? (
        <Photo
          error={error}
          contentWidth={contentWidth}
          loading={loading}
          photo={photo}
          alt="photo"
          handleContinue={handleContinue}
          photoType={photoType}
          isH5={isH5}
          onOk={onOk}
          retry={retry}
        />
      ) : (
        <>
          {showCamera && TitleMap[kycInfo?.identityType] ? (
            <Title>{_t(TitleMap[kycInfo?.identityType][photoType])}</Title>
          ) : null}
        </>
      )}
      <Wrapper
        position={!photo ? 'relative' : 'static'}
        photo={photo}
        showBg={showCamera && !photo}
        className={classnames({
          hide: showCamera && photo,
          Wrapper: true,
        })}
      >
        {!showCamera ? (
          <Loading
            kycInfo={kycInfo}
            type={noCamera ? 'fail' : 'success'}
            retry={retry}
            photoType={photoType}
            isH5={isH5}
          />
        ) : photo ? null : (
          <Content>
            <CameraWrapper>
              <StyledDiv contentWidth={contentWidth} />
              <CameraBottom contentWidth={contentWidth} className="CameraBottom">
                <CameraBtnOuterWrapper
                  onClick={() => {
                    shot();
                  }}
                >
                  <CameraBtn />
                </CameraBtnOuterWrapper>
              </CameraBottom>
              <StyledSpin spinning={spinning} size="small" />
            </CameraWrapper>

            <BottomContent contentWidth={contentWidth}>
              <Desc>{_t('cLrLm4GR1XyU953XjWmv4c')}</Desc>
            </BottomContent>
            {isH5 ? (
              <CameraBtnOuterWrapper
                onClick={() => {
                  shot();
                }}
              >
                <CameraSmBtn />
              </CameraBtnOuterWrapper>
            ) : null}
          </Content>
        )}
        <VideoWrapper showCamera={showCamera && !photo} contentWidth={contentWidth}>
          <Video
            id="camera-shot-video"
            autoPlay="autoplay"
            muted="muted"
            playsInline
            webkit-playsinline="true"
            x5-video-player-type="h5"
            contentWidth={contentWidth}
          />
        </VideoWrapper>
      </Wrapper>
    </>
  );
};
export default Camera;
