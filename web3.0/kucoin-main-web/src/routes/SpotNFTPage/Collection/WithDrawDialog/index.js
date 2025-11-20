/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useCallback, memo, useRef } from 'react';
import { connect } from 'react-redux';
import { trim } from 'lodash';
import cls from 'classnames';
import { Input, InputAdornment, Form } from '@kc/mui';
import { Button } from '@kufox/mui';
import CustomDialog from 'components/SpotNFT/CustomDialog';
import { _t } from 'tools/i18n';
import { useIsMobile } from '../../util';
import style from './style.less';

const { Item: FormItem } = Form;

const WithDrawDialog = (props) => {
  const [network, setNetwork] = useState('');
  const addressRef = useRef(null);
  const { open, onCancel, onOk, info, form, dispatch } = props;
  const { getFieldDecorator, validateFields, setFieldsValue } = form;
  const isMobile = useIsMobile();
  const handlePaste = useCallback(
    async (e) => {
      e && e.preventDefault();
      const data = await navigator.clipboard.readText();
      if (data) {
        setFieldsValue({ address: data });
        // 主动触发一下
        addressRef.current && addressRef.current.focus();
        requestAnimationFrame(() => {
          addressRef.current && addressRef.current.blur();
        });
      }
    },
    [setFieldsValue],
  );

  const clear = useCallback(() => {
    setFieldsValue({ address: '' });
    setNetwork('');
  }, [setFieldsValue]);

  const handleConfirm = useCallback(
    (e) => {
      e && e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          clear();
          onOk({
            ...values,
            network,
          });
        }
      });
    },
    [clear, onOk, validateFields, network],
  );

  const handleCancel = () => {
    clear();
    onCancel();
  };

  const checkAddressValidator = useCallback(
    (rule, value, callback) => {
      const fn = async () => {
        try {
          if (!value) {
            return callback(new Error(_t('form.required')));
          }
          const r = await dispatch({
            type: 'withdraw/checkIfInnerAddr',
            payload: {
              address: value,
              currency: trim(info.nftCurrency),
              memo: '',
            },
          });
          if (r.isValid) {
            if (r.validChainList && r.validChainList.length > 0) {
              const validChain = r.validChainList[0];
              // 判断是否内外链
              if (!validChain.isOurAddress) {
                setNetwork(validChain.chainName);
                callback();
                return;
              } else {
                callback(new Error(_t('igo.nft.collection.withdrawAddressNote')));
              }
            }
            callback(new Error(_t('form.format.error')));
          } else {
            callback(new Error(_t('form.format.error')));
          }
        } catch (e) {
          console.error(e);
          callback(new Error(_t('form.format.error')));
        }
      };
      fn();
    },
    [info, dispatch, setNetwork],
  );

  if (!info) {
    return null;
  }
  return (
    <CustomDialog
      className={style.withDrawDialog}
      title={'Withdraw of NFT'}
      titleAlignMobile={'left'}
      open={open}
      showCloseX
      cancelText=""
      footer={null}
      onCancel={handleCancel}
    >
      <Form>
        <div className={style.infoContainer}>
          <div className={style.imgContainer}>
            <img src={info.nftLogoUrl} alt="" />
          </div>
          <div className={style.name}>{info.nftName}</div>
        </div>

        <FormItem
          className={cls(style.inputContainer, style.withPasteContainer)}
          label={_t('igo.nft.collection.address')}
        >
          {getFieldDecorator(`address`, {
            validate: [
              {
                rules: [
                  {
                    required: false,
                    message: _t('form.required'),
                  },
                ],
              },
              {
                trigger: ['onBlur', 'onSubmit'],
                rules: [
                  {
                    validator: checkAddressValidator,
                  },
                ],
              },
            ],
            validateTrigger: 'onBlur',
          })(
            <Input
              ref={addressRef}
              className={style.withPasteInput}
              endAdornment={
                isMobile ? null : (
                  <InputAdornment>
                    <Button onClick={handlePaste} className={style.withPaste}>
                      {_t('igo.nft.collection.paste')}
                    </Button>
                  </InputAdornment>
                )
              }
              fullWidth
            />,
          )}
        </FormItem>
        <FormItem
          className={cls(style.inputContainer, style.readonly)}
          label={_t('igo.nft.collection.network')}
        >
          <Input readOnly className={style.readonlyInput} value={network} fullWidth />
        </FormItem>

        <Button className={style.button} onClick={handleConfirm} fullWidth>
          {_t('igo.nft.collection.withdraw')}
        </Button>
      </Form>
    </CustomDialog>
  );
};

export default connect((state) => {
  const { loading } = state;
  return {
    checkAddressLoading: loading.effects['withdraw/checkIfInnerAddr'],
  };
})(memo(Form.create()(WithDrawDialog)));
