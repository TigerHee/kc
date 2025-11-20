/**
 * Owner: sean.shi@kupotech.com
 */
import { Button, Form, Input, useResponsive, useTheme } from '@kux/mui';
import Back from 'components/common/Back';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import safeWordIconDark from 'static/account/security/safe-word-dark.svg';
import safeWordIcon from 'static/account/security/safe-word-light.svg';
import { _t, _tHTML } from 'tools/i18n';
import { ExampleModal } from './exampleModal';
import {
  BackWrap,
  ButtonGroup,
  ExtendForm,
  InfoIcon,
  InfoIconWrap,
  StyledButton,
  StyledDesc,
  StyledFormBody,
  StyledMainIcon,
  StyledSafeWordForm,
  StyledTips,
  StyledTitle,
} from './styled';

const { useForm, FormItem } = Form;

const SAFE_WORD_MAX_LENGTH = 8;

export default ({ onSubmit, onBack }) => {
  const [form] = useForm();
  const theme = useTheme();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  // 提交按钮是否禁用
  const [disabled, setDisabled] = useState(true);
  // 是否打开示例弹窗
  const [showExampleModal, setShowExampleModal] = useState(false);
  // 请求过程中展示 loading 态
  const loading = useSelector((state) => state.loading.effects['account_security/saveSafewords']);
  // 接口返回的安全语
  const { loginSafeWord, mailSafeWord, withdrawalSafeWord } = useSelector(
    (state) => state.account_security,
  );

  // 接口中不包含任何安全语，则是第一次设置
  const isFirstSetting = !loginSafeWord && !mailSafeWord && !withdrawalSafeWord;
  // 是否进入安全语编辑态
  const [isEdit, setIsEdit] = useState(isFirstSetting);

  // 安全语表单值变化时回调
  const valueChange = (changedValues, allValues) => {
    let newValues = {};
    // 变更的值只要超过8位不再展示
    Object.keys(changedValues).forEach((key) => {
      if (changedValues[key]) {
        // 只能输入数字，超过8位不再展示
        newValues[key] = (changedValues[key].match(/\d/g) || [])
          .join('')
          .slice(0, SAFE_WORD_MAX_LENGTH);
      }
    });
    // 只要有输入1个安全语，按钮就不置灰
    const ret = Object.entries({ ...allValues, ...newValues }).some(([key, val]) =>
      new RegExp(`^\\\d{${SAFE_WORD_MAX_LENGTH}}$`).test(val),
    );
    setDisabled(!ret);
    form.setFieldsValue(newValues);
  };

  const validator = (_, value, callback) => {
    const reg = new RegExp(`^\\\d{${SAFE_WORD_MAX_LENGTH}}$`);
    // 如果没有输入，不报错，或者如果有 * 认为是默认值，也不报错
    if (!value || value.includes('*') || reg.test(value)) {
      callback();
    } else if (!reg.test(value)) {
      // 如果不满 8 位，则提示报错
      callback(new Error(_t('23450b9a15b64000af43')));
    } else {
      callback();
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const submitValue = {};
        Object.keys(values).forEach((key) => {
          const val = values[key];
          // 只提交符合 8 位字符的值，对于后端返回的带 * 的默认值不提交
          if (new RegExp(`^\\\d{${SAFE_WORD_MAX_LENGTH}}$`).test(val)) {
            submitValue[key] = val;
          }
        });
        onSubmit(submitValue);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  return (
    <StyledSafeWordForm>
      <BackWrap>
        <Back />
      </BackWrap>
      {!isH5 ? (
        <StyledMainIcon>
          <img
            src={theme.currentTheme === 'light' ? safeWordIcon : safeWordIconDark}
            alt="type icon"
          />
        </StyledMainIcon>
      ) : null}

      <StyledTitle>
        <div>{isFirstSetting ? _t('7221eb8503b34800a739') : _t('c08f13a2b8274800a6c0')}</div>
      </StyledTitle>
      <StyledDesc
        onClick={(e) => {
          // 通过代理事件的方式处理翻译中的元素点击事件
          const target = e.target;
          if (target.tagName.toUpperCase() === 'B') {
            setShowExampleModal(true);
          }
        }}
      >
        {_tHTML('8707ef17af1e4000a315')}
      </StyledDesc>
      <StyledTips>
        <InfoIconWrap>
          <InfoIcon size={16} color={theme.colors.complementary} />
        </InfoIconWrap>
        {_tHTML('1c91e563227d4800a47c')}
      </StyledTips>
      <StyledFormBody>
        <ExtendForm size="large" form={form} onValuesChange={valueChange}>
          <FormItem
            label={_t('6107028294b64800a297')}
            name="loginSafeWord"
            initialValue={loginSafeWord}
            rules={[{ validator }]}
            validateTrigger={['onBlur']}
          >
            <Input
              allowClear={true}
              size="xlarge"
              placeholder={_t('23450b9a15b64000af43')}
              disabled={!isFirstSetting && !isEdit}
              onFocus={() => {
                // 第一次选中输入框，将带 * 的默认值清空
                const curr = form.getFieldValue('loginSafeWord') || '';
                if (curr.includes('*')) {
                  form.setFieldsValue({
                    loginSafeWord: '',
                  });
                }
              }}
            />
          </FormItem>
          <FormItem
            label={_t('cd1a4604ee584800a7d7')}
            name="mailSafeWord"
            initialValue={mailSafeWord}
            rules={[{ validator }]}
            validateTrigger={['onBlur']}
          >
            <Input
              allowClear={true}
              size="xlarge"
              placeholder={_t('23450b9a15b64000af43')}
              disabled={!isFirstSetting && !isEdit}
              onFocus={() => {
                // 第一次选中输入框，将带 * 的默认值清空
                const curr = form.getFieldValue('mailSafeWord') || '';
                if (curr.includes('*')) {
                  form.setFieldsValue({
                    mailSafeWord: '',
                  });
                }
              }}
            />
          </FormItem>
          <FormItem
            label={_t('508c86a948b84800a29a')}
            name="withdrawalSafeWord"
            initialValue={withdrawalSafeWord}
            rules={[{ validator }]}
            validateTrigger={['onBlur']}
          >
            <Input
              allowClear={true}
              size="xlarge"
              placeholder={_t('23450b9a15b64000af43')}
              disabled={!isFirstSetting && !isEdit}
              onFocus={() => {
                // 第一次选中输入框，将带 * 的默认值清空
                const curr = form.getFieldValue('withdrawalSafeWord') || '';
                if (curr.includes('*')) {
                  form.setFieldsValue({
                    withdrawalSafeWord: '',
                  });
                }
              }}
            />
          </FormItem>
          <ButtonGroup>
            {/* 不是第一次设置安全码 & 编辑态中，则展示取消按钮 */}
            {!isFirstSetting && isEdit && (
              <StyledButton>
                <Button size="large" variant="outlined" fullWidth onClick={onBack}>
                  {_t('cancel')}
                </Button>
              </StyledButton>
            )}
            <StyledButton>
              {isFirstSetting && (
                <Button
                  loading={loading}
                  size="large"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  {_t('6ffe56cae7764800a8b7')}
                </Button>
              )}
              {!isFirstSetting && !isEdit && (
                <Button
                  loading={loading}
                  size="large"
                  fullWidth
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  {_t('c08f13a2b8274800a6c0')}
                </Button>
              )}
              {!isFirstSetting && isEdit && (
                <Button
                  loading={loading}
                  size="large"
                  fullWidth
                  disabled={disabled}
                  onClick={handleSubmit}
                >
                  {_t('submit')}
                </Button>
              )}
            </StyledButton>
          </ButtonGroup>
        </ExtendForm>
      </StyledFormBody>
      <ExampleModal
        open={showExampleModal}
        onClose={() => {
          setShowExampleModal(false);
        }}
      />
    </StyledSafeWordForm>
  );
};
