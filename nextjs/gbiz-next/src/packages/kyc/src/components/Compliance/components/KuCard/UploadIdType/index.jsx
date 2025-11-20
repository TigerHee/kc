/**
 * Owner: tiger@kupotech.com
 */
import { useEffect } from 'react';
import clsx from 'clsx';
import { isEmpty, isString } from 'lodash-es';
import { useTheme, Form, useSnackbar } from '@kux/mui';
import useLang from 'packages/kyc/src/hookTool/useLang';
import { Wrapper, ContentBox, FooterBtnBox } from 'kycCompliance/components/commonStyle';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import UploadFile from 'kycCompliance/components/FormPage/UploadFile';
import { getIdType } from 'kycCompliance/config';
import { postJsonWithPrefix } from 'kycCompliance/service';
import reference1light from './img/light/reference1.svg';
import reference1dark from './img/dark/reference1.svg';
import reference2light from './img/light/reference2.svg';
import reference2dark from './img/dark/reference2.svg';
import reference3light from './img/light/reference3.svg';
import reference3dark from './img/dark/reference3.svg';
import reference4light from './img/light/reference4.svg';
import reference4dark from './img/dark/reference4.svg';
import { Container } from './style';

const IMG_CONFIG = {
  light: {
    reference1: reference1light,
    reference2: reference2light,
    reference3: reference3light,
    reference4: reference4light,
  },
  dark: {
    reference1: reference1dark,
    reference2: reference2dark,
    reference3: reference3dark,
    reference4: reference4dark,
  },
};

const { useForm, FormItem } = Form;

export default ({ onPrePage, onNextPage, componentGroups = [], pageAfterApi, pageId }) => {
  const [form] = useForm();
  const { message } = useSnackbar();
  const { currentTheme } = useTheme();
  const { isSmStyle, setInnerPageElements, flowData, formData, crossPageData, setCrossPageData } = useCommonData();
  const { _t } = useLang();

  const { validateFields } = form;

  const components = componentGroups[0].components || [];

  const imgData = IMG_CONFIG[currentTheme];

  const referenceList = [
    {
      title: _t('ac0266c398454000ac5b'),
      img: imgData.reference1,
    },
    {
      title: _t('8140fc0e42964000a854'),
      img: imgData.reference2,
    },
    {
      title: _t('47131ab981344800a36c'),
      img: imgData.reference3,
    },
    {
      title: _t('ce1d0638cc024000a6ab'),
      img: imgData.reference4,
    },
  ];

  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('kyc_process_previous'),
      pageTitle: _t('5ff81451a1214800aa15', { idType }),
    });
  }, []);

  // 从formData重新获取crossPageData中每个key的最新值
  useEffect(() => {
    if (!isEmpty(crossPageData) && formData) {
      const updatedCrossPageData = {};
      Object.keys(crossPageData).forEach(key => {
        if (formData.hasOwnProperty(key)) {
          updatedCrossPageData[key] = formData[key];
        } else {
          updatedCrossPageData[key] = crossPageData[key];
        }
      });
      // 只有当有变化时才更新crossPageData
      const hasChanges = Object.keys(updatedCrossPageData).some(
        key => updatedCrossPageData[key] !== crossPageData[key]
      );

      if (hasChanges) {
        setCrossPageData(updatedCrossPageData);
      }
    }
  }, [formData, crossPageData, setCrossPageData]);

  const onNext = () => {
    validateFields().then(async values => {
      try {
        const params = {};
        Object.keys(values).forEach(key => {
          const val = values[key];
          params[key] = isString(val) ? val : val?.map(i => i.key)?.join(',');
        });
        const { flowId, transactionId, complianceStandardCode } = flowData;
        await postJsonWithPrefix(pageAfterApi, {
          flowId,
          transactionId,
          complianceStandardCode,
          pageId,
          metaMap: params,
        });
        onNextPage();
      } catch (error) {
        const { msg } = error;
        message.error(msg);
      }
    });
  };

  const uploadFileProps = {
    form,
  };

  const idTypeMap = {
    1: _t('d6d6b1e70c594000a603'),
    2: _t('723a03fb93e34800abdc'),
    3: _t('7a3d52ca0d674000aa69'),
    6: _t('669d9b3c08234800a45d'),
  };
  const idTypeValue = getIdType(isEmpty(crossPageData) ? formData : crossPageData);
  // 证件类型获取
  const idType = idTypeMap[idTypeValue];
  // 是否需要背面 - 只有护照不需要
  const isNeedBackSide = idTypeValue !== '2';

  const complianceMetaCode1 = components[0]?.complianceMetaCode;
  const complianceMetaCode2 = components[1]?.complianceMetaCode;

  return (
    <Wrapper>
      <ContentBox
        className={clsx({
          isSmStyle,
        })}
      >
        <Container
          className={clsx({
            isSmStyle,
          })}
        >
          {isSmStyle && <h2 className="title">{_t('5ff81451a1214800aa15', { idType })}</h2>}
          <h4 className="subtitle">{_t('a4e05d2b14054800a77f', { idType })}</h4>
          <div className="referenceList">
            {referenceList.map(item => (
              <div className="referenceItem" key={item.title}>
                <img src={item.img} alt={item.title} />
                <span>{item.title}</span>
              </div>
            ))}
          </div>

          <Form form={form}>
            <div className="uploadBox">
              <div className="uploadItem">
                <h4 className="subtitle">{_t('4c5b30baf3164800a055', { idType })}</h4>
                {complianceMetaCode1 && (
                  <FormItem name={complianceMetaCode1} initialValue={formData[complianceMetaCode1] || ''}>
                    <UploadFile {...components[0]} {...uploadFileProps} name={complianceMetaCode1} />
                  </FormItem>
                )}
              </div>

              {isNeedBackSide && complianceMetaCode2 ? (
                <div className="uploadItem">
                  <h4 className="subtitle">{_t('802369809b254000a8ef', { idType })}</h4>
                  <FormItem name={complianceMetaCode2} initialValue={formData[complianceMetaCode2] || ''}>
                    <UploadFile {...components[1]} {...uploadFileProps} name={complianceMetaCode2} />
                  </FormItem>
                </div>
              ) : null}
            </div>
          </Form>
        </Container>
      </ContentBox>

      {/* 底部按钮 */}
      <FooterBtnBox
        onPre={onPrePage}
        preText={_t('kyc_process_previous')}
        onNext={onNext}
        nextText={_t('cHGhPEiCiaW9EGwHRHhkfp')}
        nextBtnProps={{
          disabled: false,
        }}
      />
    </Wrapper>
  );
};
